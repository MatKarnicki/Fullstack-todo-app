import { useState, useEffect } from "react";
import ToDoForm from "./ToDoForm";
import TaskItem from "./TaskItem";
import { useKeycloak } from "@react-keycloak/web";

const ToDoItems = () => {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState("");
  const { keycloak } = useKeycloak();
  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    if (keycloak.authenticated) {
      setToken(keycloak.token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchTasks(token);
    }
  }, [token]);

  const fetchTasks = async () => {
    console.log(token);
    try {
      const response = await fetch("http://localhost:3001/api/todo", {
        headers: {
          authorization: `${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setTasks(data.todos);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (taskText, taskDate) => {
    try {
      const response = await fetch("http://localhost:3001/api/todo", {
        method: "POST",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: taskText, date: taskDate }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error adding task:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/todo`, {
        method: "DELETE",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
        }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error deleting task:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/todo`, {
        method: "PUT",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
        }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error completing task:", response.statusText);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <>
      <h1>TO-DO</h1>
      <ul>
        {tasks.length !== 0 ? (
          tasks.map((task, i) => (
            <TaskItem
              key={i}
              task={task}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <h2>You have no tasks</h2>
        )}
      </ul>
      <ToDoForm handleAddTask={handleAddTask} />
    </>
  );
};

export default ToDoItems;
