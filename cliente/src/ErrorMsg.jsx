

const ErrorMsg = ({msg}) =>
{
    if(msg == "")
        return <></>
    return(
        <div className="error-msg">
            <img src="/error.svg" alt="" />
            <p>{msg}</p>
        </div>
    )
}

export default ErrorMsg;