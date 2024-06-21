const FormToDoDate = ({handleDateChange}) => {
    return <>
    <label>TODO due date </label>
    <input type="date" required onChange={handleDateChange}></input>
    </>;
};

export default FormToDoDate;