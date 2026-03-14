// O ecrã inicial que aparece quando o cliente abre a página.
//  Mostra o seletor de número de mesa e o botão de confirmação.
//  Não tem lógica própria — recebe tudo via props do ClientMenu.

export default function TableOverlay({ tableNumber, onIncrement, onDecrement, onConfirm, visible }) {
    return (
        <div className={`cm-overlay${!visible ? " hidden" : ""}`}>
            <div className="cm-overlay-box">
                <span className="cm-star">✦</span>
                <h1>Bem-vindo</h1>
                <p>Indique o número da sua mesa para começar</p>
                <div className="cm-table-row">
                    <button className="cm-num-btn" onClick={onDecrement}>−</button>
                    <span className="cm-table-num">{tableNumber}</span>
                    <button className="cm-num-btn" onClick={onIncrement} disabled={tableNumber >= 25}>+</button>
                </div>
                <button className="cm-cta" onClick={onConfirm}>Confirmar Mesa</button>
            </div>
        </div>
    );
}
