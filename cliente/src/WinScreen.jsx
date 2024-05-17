import "./WinScreen.css";
import { ACTION } from "./utils";

const WinScreen = () =>
{
    const handleClose = () =>
    {
        const data = { action: ACTION.CLOSE};
        window.electronAPI.send(data); 
    }
    return (
        <div className="win-screen">
                <div class="victory-message">
                    ¡Ganaste!
                </div>
                <button className="btn" onClick={handleClose}>Salir</button>
        </div>
    );
}

export default WinScreen