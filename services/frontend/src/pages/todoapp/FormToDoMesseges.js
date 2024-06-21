const FormToDoMesseges = ({errorList}) => {
    return (
        <div>
            {errorList.map((error,i) =>(
                <p key={i}>{error}</p>
            ))}
        </div>
    );
};

export default FormToDoMesseges;