// O cartão individual de cada prato. 
// Mostra o nome, descrição, ingredientes, preço, o controlo de quantidade e o botão "Adicionar". 
// Também não tem estado próprio.
import styles from "./DishCard.module.scss";

export default function DishCard({ dish, quantity, inOrder, tableConfirmed, onQtyChange, onAdd }) {
    return (
        <div className={styles.dishCard}>
            <div className={styles.dishName}>{dish.name}</div>
            <div className={styles.dishDesc}>{dish.description}</div>
            {dish.ingredients && dish.ingredients.length > 0 && (
                <div className={styles.dishIngredients}>
                    {dish.ingredients.map(ing => ing.name).join(", ")}
                </div>
            )}
            <div className={styles.dishPrice}>€ {parseFloat(dish.price).toFixed(2)}</div>
            <div className={styles.dishFooter}>
                <div className={styles.qtyCtrl}>
                    <button className={styles.qtyBtn} onClick={() => onQtyChange(dish.id, -1)}>−</button>
                    <span className={styles.qtyVal}>{quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => onQtyChange(dish.id, +1)}>+</button>
                </div>
                <button
                    className={`${styles.addBtn}${inOrder ? " " + styles.added : ""}`}
                    onClick={() => onAdd(dish)}
                    disabled={!tableConfirmed}
                >
                    {inOrder ? "Adicionado ✓" : "Adicionar"}
                </button>
            </div>
        </div>
    );
}