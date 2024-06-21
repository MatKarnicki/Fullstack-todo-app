import React from "react";

const TaskItem = ({ task, onComplete, onDelete }) => {
  return (
    <li>
      {`${task.title} due to: ${task.date} completed: ${
        task.completed ? "Yes" : "No"
      }`}
      {!task.completed && (
        <div>
          <button onClick={() => onDelete(task.id)}>Delete</button>
          <button onClick={() => onComplete(task.id)}>Complete</button>
        </div>
      )}
      {task.completed && (
        <div>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
