import "./ErrorMsg.css";
import { ACTION } from "./utils";

const WaitingPage = () =>
{
    const handleClose = () =>
    {
        const data = { action: ACTION.CLOSE};
        window.electronAPI.send(data); 
    }

    return (
        <div className="waiting">
            <h2>En espera</h2>
            <div class="loader"></div>
            <p>Esperando que otro jugador se conecte</p>
            <button onClick={handleClose} className="btn">Salir</button>
        </div>
    );
}

export default WaitingPage;