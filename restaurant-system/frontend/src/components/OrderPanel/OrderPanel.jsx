// O painel lateral direito com o resumo do pedido. Lista os pratos adicionados, calcula o total e tem o botão "Fazer Pedido". 
import styles from "./OrderPanel.module.scss";

export default function OrderPanel({ order, tableNumber, tableConfirmed, submitting, onRemove, onSubmit }) {
    const total = order.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <aside className={styles.orderPanel}>
            <div className={styles.orderInner}>
                <h2 className={styles.orderTitle}>O Seu Pedido</h2>
                <p className={styles.orderTableLabel}>
                    {tableConfirmed ? `Mesa ${tableNumber}` : "—"}
                </p>

                <div className={styles.orderItems}>
                    {order.length === 0 ? (
                        <p className={styles.orderEmpty}>Nenhum prato adicionado ainda.</p>
                    ) : (
                        order.map(item => (
                            <div key={item.dish} className={styles.orderItem}>
                                <div>
                                    <div className={styles.orderItemName}>{item.name}</div>
                                    <div className={styles.orderItemQty}>{item.qty}×</div>
                                </div>
                                <div className={styles.orderItemPrice}>€ {(item.price * item.qty).toFixed(2)}</div>
                                <button className={styles.removeBtn} onClick={() => onRemove(item.dish)}>×</button>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.orderFooter}>
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total</span>
                        <span className={styles.totalValue}>€ {total.toFixed(2)}</span>
                    </div>
                    <button
                        className={styles.submitBtn}
                        disabled={!tableConfirmed || submitting}
                        onClick={onSubmit}
                    >
                        {submitting ? "A enviar..." : "Fazer Pedido"}
                    </button>
                </div>
            </div>
        </aside>
    );
}