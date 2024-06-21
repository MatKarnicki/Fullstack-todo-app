import FormToDoDate from "./FormToDoDate";
import FormToDoItem from "./FormToDoItem";
import FormToDoMesseges from "./FormToDoMesseges";
import { useState } from "react";

const ToDoForm = ({ handleAddTask }) => {
  const [taskDate, setDate] = useState();
  const [taskText, setText] = useState();
  const [errorList, addError] = useState([]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleError = (msg) => {
    addError([...errorList, msg]);
  };
  const clearError = () => {
    addError([]);
  };
  const handleOnClick = () => {
    if (!(taskText && taskDate)) {
      handleError("Prosze uzupelnic formularz");
    } else if (new Date() > new Date(taskDate)) {
      handleError("Termin upłynął, ustaw to później");
    } else {
      handleAddTask(taskText, taskDate);
      clearError();
    }
  };
  return (
    <>
      <FormToDoItem handleTextChange={handleTextChange}></FormToDoItem>
      <p />
      <FormToDoDate handleDateChange={handleDateChange}></FormToDoDate>
      <p />
      <FormToDoMesseges errorList={errorList}></FormToDoMesseges>
      <p />
      <input type="submit" onClick={handleOnClick}></input>
    </>
  );
};
export default ToDoForm;
