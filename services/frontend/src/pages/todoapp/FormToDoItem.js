const FormToDoItem = ({handleTextChange}) => {
    return <>
    <label>Your todo </label>
    <input type="text" onChange={handleTextChange} required></input>
    </>;
};

export default FormToDoItem;