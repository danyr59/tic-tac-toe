import "./LostScreen.css";
import { ACTION } from "./utils";


const LostScreen = () =>
{
    const handleClose = () =>
    {
        const data = { action: ACTION.CLOSE};
        window.electronAPI.send(data); 
    }
    return (
        <div className="win-screen">
                <div class="defeat-message">
                    Derrota
                </div>
                <button className="btn" onClick={handleClose}>Salir</button>

        </div>
    );
}

export default LostScreen