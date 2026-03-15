// O ecrã inicial que aparece quando o cliente abre a página.
//  Mostra o seletor de número de mesa e o botão de confirmação.
//  Não tem lógica própria — recebe tudo via props do ClientMenu.
import styles from "./TableOverlay.module.scss";

export default function TableOverlay({ tableNumber, onIncrement, onDecrement, onConfirm, visible }) {
    return (
        <div className={`${styles.overlay} ${!visible ? styles.hidden : ""}`}>
            <div className={styles.overlayBox}>
                <span className={styles.star}>✦</span>
                <h1>Bem-vindo</h1>
                <p>Indique o número da sua mesa para começar.</p>
                <div className={styles.tableRow}>
                    <button className={styles.numBtn} onClick={onDecrement}>−</button>
                    <span className={styles.tableNum}>{tableNumber}</span>
                    <button className={styles.numBtn} onClick={onIncrement} disabled={tableNumber >= 25}>+</button>
                </div>
                <button className={styles.cta} onClick={onConfirm}>Confirmar Mesa</button>
            </div>
        </div>
    );
}
