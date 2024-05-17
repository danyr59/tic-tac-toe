

const ErrorMsg = ({msg, onClose}) =>
{
    if(msg == "")
        return <></>
    return(
        <div onClick={onClose} className="error-msg">
            <img src="/error.svg" alt="" />
            <p>{msg}</p>
        </div>
    )
}

export default ErrorMsg;