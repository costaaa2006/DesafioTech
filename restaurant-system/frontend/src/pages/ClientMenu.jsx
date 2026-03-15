// É o cérebro da aplicação. Gere todo o estado (mesa, pedido, quantidades) e coordena os restantes componentes. 
// É aqui que vivem as funções de lógica como adicionar ao pedido, submeter, e fazer reset.

import { useState, useEffect } from "react";
import TableOverlay from "../components/TableOverlay/TableOverlay";
import DishCard from "../components/DishCard/DishCard";
import OrderPanel from "../components/OrderPanel/OrderPanel";
import { fetchCategories, fetchTableId, submitOrder } from "../services/menuService";

import styles from "./ClientMenu.module.scss";

export default function ClientMenu() {
    const [tableNumber, setTableNumber] = useState(1);
    const [tableId, setTableId] = useState(null);
    const [tableConfirmed, setTableConfirmed] = useState(false);

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    const [quantities, setQuantities] = useState({});
    const [order, setOrder] = useState([]);

    const [showSuccess, setShowSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [showWarning, setShowWarning] = useState(false);

    // Carregar menu da API
    useEffect(() => {
        async function loadMenu() {
            const data = await fetchCategories();
            setCategories(data);
            setActiveCategory(data[0]?.id ?? null);
            setLoading(false);
        }
        loadMenu();
    }, []);

    // Confirmar mesa
    async function handleConfirmTable() {
        const id = await fetchTableId(tableNumber);
        setTableId(id);
        setTableConfirmed(true);
    }

    // Alterar quantidade de um prato
    function handleQtyChange(dishId, delta) {
        setQuantities(prev => ({
            ...prev,
            [dishId]: Math.max(1, (prev[dishId] ?? 1) + delta),
        }));
    }

    // Adicionar prato ao pedido
    function handleAddToOrder(dish) {
        const qty = quantities[dish.id] ?? 1;
        setOrder(prev => {
            const existing = prev.find(i => i.dish === dish.id);
            if (existing) {
                return prev.map(i => i.dish === dish.id ? { ...i, qty: i.qty + qty } : i);
            }
            return [...prev, { dish: dish.id, name: dish.name, qty, price: parseFloat(dish.price) }];
        });
        setQuantities(prev => ({ ...prev, [dish.id]: 1 }));
    }

    // Remover prato do pedido
    function handleRemove(dishId) {
        setOrder(prev => prev.filter(i => i.dish !== dishId));
    }

    // Submeter pedido
    async function handleSubmit() {
        if (order.length === 0) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000); // desaparece após 3 segundos
            return;
        }
        setSubmitting(true);
        try {
            await submitOrder(tableId, order);
        } catch {
            // mostra sucesso mesmo sem backend em dev
        } finally {
            setSubmitting(false);
            setShowSuccess(true);
        }
    }

    // Reset após pedido enviado
    function handleReset() {
        setOrder([]);
        setQuantities({});
        setShowSuccess(false);
        setTableConfirmed(false);
        setTableNumber(1);
        setTableId(null);
    }

    const activeDishes = categories.find(c => c.id === activeCategory)?.dishes ?? [];
    const totalItems = order.reduce((sum, i) => sum + i.qty, 0);

    return (
        <div className={styles.root}>

            {/* Overlay seleção de mesa */}
            <TableOverlay
                tableNumber={tableNumber}
                visible={!tableConfirmed}
                onIncrement={() => setTableNumber(n => Math.min(25, n + 1))}
                onDecrement={() => setTableNumber(n => Math.max(1, n - 1))}
                onConfirm={handleConfirmTable}
            />

            {/* Overlay sucesso */}
            {showSuccess && (
                <div className={styles.success}>
                    <div className={styles.successBox}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Pedido Enviado!</h2>
                        <p>O seu pedido foi enviado para a cozinha.<br />Será servido em breve.</p>
                        <button className={styles.cta} onClick={handleReset}>Novo Pedido</button>
                    </div>
                </div>
            )}

            {/* Layout principal */}
            <div className={styles.layout}>

                {/* Painel do menu */}
                <main className={styles.menu}>
                    <header className={styles.header}>
                        <div className={styles.headerTop}>
                            <span className={styles.headerStar}>✦</span>
                            <span className={styles.headerTable}>
                                {tableConfirmed ? `Mesa ${tableNumber}` : "—"}
                            </span>
                        </div>
                        <h1 className={styles.menuTitle}>Menu</h1>
                    </header>

                    <nav className={styles.tabs}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.tabBtn} ${cat.id === activeCategory ? styles.active : ""}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>

                    <div className={styles.dishes}>
                        {loading ? (
                            <div className={styles.loading}>
                                <div className={styles.loadingDot} />
                                <div className={styles.loadingDot} />
                                <div className={styles.loadingDot} />
                            </div>
                        ) : (
                            <div className={styles.dishesGrid}>
                                {activeDishes.map(dish => (
                                    <DishCard
                                        key={dish.id}
                                        dish={dish}
                                        quantity={quantities[dish.id] ?? 1}
                                        inOrder={!!order.find(i => i.dish === dish.id)}
                                        tableConfirmed={tableConfirmed}
                                        onQtyChange={handleQtyChange}
                                        onAdd={handleAddToOrder}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                {/* Painel do pedido */}
                <OrderPanel
                    order={order}
                    tableNumber={tableNumber}
                    tableConfirmed={tableConfirmed}
                    submitting={submitting}
                    onRemove={handleRemove}
                    onSubmit={handleSubmit}
                />
            </div>

            {/* Aviso sem pratos */}
            {showWarning && (
                <div className={styles.warning}>
                    Adicione pelo menos um prato antes de fazer o pedido.
                </div>
            )}
            
        </div>
    );
}