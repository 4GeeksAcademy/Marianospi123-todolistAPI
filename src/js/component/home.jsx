import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

 
  useEffect(() => {
    fetchTasksFromAPI();
  }, []);

  const fetchTasksFromAPI = () => {
   
    fetch("https://playground.4geeks.com/apis/fake/todos/user/mariano")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks from API", error));
  };

  const handleTaskTextChange = (event) => {
    setTaskText(event.target.value);
  };

  const handleAddTask = () => {
    if (taskText) {
      const newTask = { label: taskText, done: false };
      
      fetch("https://playground.4geeks.com/apis/fake/todos/user/mariano", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...tasks, newTask]),
      })
        .then((response) => response.json())
        .then(() => {
        
          fetchTasksFromAPI();
        })
        .catch((error) => console.error("Error adding task to API", error));

      setTaskText("");
    }
  };

  const handleTaskDelete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
   
    fetch("https://playground.4geeks.com/apis/fake/todos/user/mariano", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTasks),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch the updated task list from the API
        fetchTasksFromAPI();
      })
      .catch((error) => console.error("Error deleting task from API", error));
  };

  const handleTaskToggle = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    // Send a PUT request to update the entire task list in the API
    fetch("https://playground.4geeks.com/apis/fake/todos/user/mariano", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTasks),
    })
      .then((response) => response.json())
      .then(() => {
        // Fetch the updated task list from the API
        fetchTasksFromAPI();
      })
      .catch((error) => console.error("Error updating task in API", error));
  };

  return (
    <div>
      <h1> TODOS</h1>
      <div>
        <input
          type="text"
          placeholder="Nueva tarea"
          value={taskText}
          onChange={handleTaskTextChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleAddTask();
            }
          }}
        />
      </div>
      {tasks.length === 0 ? (
        <p>No hay tareas, añadir tareas</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <span
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                }}
                onClick={() => handleTaskToggle(index)}
              >
                {task.label}
              </span>
              {task.done && (
                <button onClick={() => handleTaskDelete(index)}>X</button>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="total-tasks">Tareas por hacer: {tasks.length}</p>
    </div>
  );
};

export default TodoList;
