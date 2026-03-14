// O cartão individual de cada prato. 
// Mostra o nome, descrição, ingredientes, preço, o controlo de quantidade e o botão "Adicionar". 
// Também não tem estado próprio.

export default function DishCard({ dish, quantity, inOrder, tableConfirmed, onQtyChange, onAdd }) {
    return (
        <div className="cm-dish-card">
            <div className="cm-dish-name">{dish.name}</div>
            <div className="cm-dish-desc">{dish.description}</div>
            {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="cm-dish-ingredients">
                    {dish.ingredients.map(ing => ing.name).join(", ")}
                </div>
            )}
            <div className="cm-dish-price">€ {parseFloat(dish.price).toFixed(2)}</div>
            <div className="cm-dish-footer">
                <div className="cm-qty-ctrl">
                    <button className="cm-qty-btn" onClick={() => onQtyChange(dish.id, -1)}>−</button>
                    <span className="cm-qty-val">{quantity}</span>
                    <button className="cm-qty-btn" onClick={() => onQtyChange(dish.id, +1)}>+</button>
                </div>
                <button
                    className={`cm-add-btn${inOrder ? " added" : ""}`}
                    onClick={() => onAdd(dish)}
                    disabled={!tableConfirmed}
                >
                    {inOrder ? "Adicionado ✓" : "Adicionar"}
                </button>
            </div>
        </div>
    );
}