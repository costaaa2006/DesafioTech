// O painel lateral direito com o resumo do pedido. Lista os pratos adicionados, calcula o total e tem o botão "Fazer Pedido". 
// Em mobile torna-se um overlay quando ativado.

export default function OrderPanel({ order, tableNumber, tableConfirmed, submitting, mobileOpen, onRemove, onSubmit }) {
    const total = order.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <aside className={`cm-order-panel${mobileOpen ? " mobile-open" : ""}`}>
            <div className="cm-order-inner">
                <h2 className="cm-order-title">O Seu Pedido</h2>
                <p className="cm-order-table-label">
                    {tableConfirmed ? `Mesa ${tableNumber}` : "—"}
                </p>

                <div className="cm-order-items">
                    {order.length === 0 ? (
                        <p className="cm-order-empty">Nenhum prato adicionado ainda.</p>
                    ) : (
                        order.map(item => (
                            <div key={item.dish} className="cm-order-item">
                                <div>
                                    <div className="cm-order-item-name">{item.name}</div>
                                    <div className="cm-order-item-qty">{item.qty}×</div>
                                </div>
                                <div className="cm-order-item-price">€ {(item.price * item.qty).toFixed(2)}</div>
                                <button className="cm-remove-btn" onClick={() => onRemove(item.dish)}>×</button>
                            </div>
                        ))
                    )}
                </div>

                <div className="cm-order-footer">
                    <div className="cm-total-row">
                        <span className="cm-total-label">Total</span>
                        <span className="cm-total-value">€ {total.toFixed(2)}</span>
                    </div>
                    <button
                        className="cm-submit-btn"
                        disabled={order.length === 0 || !tableConfirmed || submitting}
                        onClick={onSubmit}
                    >
                        {submitting ? "A enviar..." : "Fazer Pedido"}
                    </button>
                </div>
            </div>
        </aside>
    );
}