// A camada de comunicação com o Django.
//  É o único ficheiro que faz fetch — procura as categorias, resolve o ID da mesa e submete o pedido.
//  Os componentes nunca chamam a API diretamente, passam sempre por aqui.

export async function fetchCategories() {
    const res = await fetch("/api/categories/");
    if (!res.ok) throw new Error("Erro ao carregar o menu.");
    return await res.json();
}

export async function fetchTableId(tableNumber) {
    const res = await fetch("/api/tables/");
    if (!res.ok) throw new Error("Erro ao carregar as mesas.");
    const tables = await res.json();
    const found = tables.find(t => t.number === tableNumber);
    return found ? found.id : tableNumber;
}

export async function submitOrder(tableId, order) {
    const res = await fetch("/api/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            table: tableId,
            items: order.map(i => ({ dish: i.dish, quantity: i.qty })),
        }),
    });
    if (!res.ok) throw new Error("Erro ao submeter o pedido.");
}