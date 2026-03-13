// kitchen_dashboard.js

const STATUS_FLOW = ["OR", "PR", "CD", "RS", "CO"];

// Guarda referência ao cartão que está a ser arrastado
let draggedCard = null;

// ── Modal ────────────────────────────────────────────────────────────────────

function openModal(order) {
    // Remove modal anterior se existir
    document.getElementById('order-modal')?.remove();

    const itemsHTML = order.summary.map(item => `
        <div class="modal-dish">
            <div class="modal-dish-header">
                <span class="modal-dish-name">${item.dish}</span>
                <span class="modal-dish-qty">${item.quantity}×</span>
            </div>
            <ul class="modal-ingredients">
                ${item.ingredients && item.ingredients.length
                    ? item.ingredients.map(ing => `<li>${ing}</li>`).join('')
                    : '<li class="no-ingredients">Sem ingredientes registados</li>'
                }
            </ul>
        </div>
    `).join('');

    const STATUS_LABELS = { OR: "Order Preview", PR: "Preparing", CD: "Cooling Down", RS: "Ready to Serve", CO: "Concluded" };

    const modal = document.createElement('div');
    modal.id = 'order-modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-box">
            <button class="modal-close">✕</button>
            <div class="modal-header">
                <h2>Mesa ${order.table_number}</h2>
                <span class="modal-status">${STATUS_LABELS[order.status] || order.status}</span>
            </div>
            <p class="modal-time">Recebido às ${new Date(order.created_at).toLocaleTimeString()}</p>
            <div class="modal-dishes">${itemsHTML}</div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fechar ao clicar no backdrop ou no botão
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // Animação de entrada
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;
    modal.classList.remove('modal-visible');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
}

// Fechar com Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

async function loadOrders() {
    const response = await fetch('/api/orders/summary/');
    const orders = await response.json();

    STATUS_FLOW.forEach(status => document.getElementById(status).innerHTML = "");

    orders.forEach(order => {
        const column = document.getElementById(order.status);
        if (!column) return;

        const card = createCard(order);
        column.appendChild(card);
    });
}

function createCard(order) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('draggable', 'true');
    card.dataset.orderId = order.id;
    card.dataset.status = order.status;

    const itemsHTML = order.summary.map(item => `
        <li draggable="false">
            <strong>${item.quantity}×</strong> ${item.dish}
        </li>
    `).join('');

    card.innerHTML = `
        <h4 draggable="false">Mesa ${order.table_number}</h4>
        <small draggable="false">${new Date(order.created_at).toLocaleTimeString()}</small>
        <ul class="items" draggable="false">${itemsHTML}</ul>
    `;

    // Guardar os dados do pedido no cartão para usar no modal
    card._orderData = order;

    // Clique abre o modal (só se não estiver a arrastar)
    card.addEventListener('click', () => {
        if (!draggedCard) openModal(card._orderData);
    });

    // Drag start no cartão
    card.addEventListener('dragstart', e => {
        draggedCard = card;
        // fallback para browsers mais antigos
        e.dataTransfer.setData('text/plain', card.dataset.orderId);
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        draggedCard = null;
        card.classList.remove('dragging');
    });

    return card;
}

function setupDragAndDrop() {
    // Event delegation: um único listener por coluna, na coluna inteira (`.column`)
    // Assim não interessa se o utilizador larga em cima de um cartão filho ou numa zona vazia.
    document.querySelectorAll('.column').forEach(columnWrapper => {
        const statusCode = columnWrapper.dataset.status;

        // Permitir drop em toda a área da coluna (incluindo sobre cartões filhos)
        columnWrapper.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        columnWrapper.addEventListener('dragenter', e => {
            e.preventDefault();
            columnWrapper.classList.add('drag-over');
        });

        columnWrapper.addEventListener('dragleave', e => {
            // Só remove a classe se saiu mesmo da coluna (não apenas de um filho)
            if (!columnWrapper.contains(e.relatedTarget)) {
                columnWrapper.classList.remove('drag-over');
            }
        });

        columnWrapper.addEventListener('drop', async e => {
            e.preventDefault();
            columnWrapper.classList.remove('drag-over');

            const card = draggedCard;
            if (!card) return;

            const oldStatus = card.dataset.status;
            const newStatus = statusCode;

            const oldIndex = STATUS_FLOW.indexOf(oldStatus);
            const newIndex = STATUS_FLOW.indexOf(newStatus);

            if (newIndex !== oldIndex + 1) {
                alert("Só é possível avançar para a fase seguinte do pedido!");
                return;
            }

            // Move o cartão visualmente para a nova coluna
            const container = columnWrapper.querySelector('.cards-container');
            container.appendChild(card);

            // Atualiza o status localmente
            card.dataset.status = newStatus;

            // Se chegou a Concluded, remove o cartão após 10 segundos
            if (newStatus === "CO") {
                setTimeout(() => {
                    card.classList.add('card-fade-out');
                    card.addEventListener('animationend', () => card.remove(), { once: true });
                }, 10000);
            }

            // Sincroniza com o backend
            try {
                await fetch(`/api/orders/${card.dataset.orderId}/status/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                });
            } catch (err) {
                console.error("Erro ao atualizar estado do pedido:", err);
            }
        });
    });
}

// Refresh manual
document.getElementById("refresh-btn").addEventListener("click", loadOrders);

// Inicialização — setupDragAndDrop corre UMA vez; loadOrders pode correr várias
setupDragAndDrop();
loadOrders();