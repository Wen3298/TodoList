import React, { useEffect, useState } from 'react';

const TaskList = () => { //se empieza con una constante y funcion flecha
    const [tasks, setTasks] = useState([]);// se crea un array vacio donde se van a almacenar las tareas 
    const [loading, setLoading] = useState(true);// le ponemos true para cuando empiece que muestre si los datos estan cargando 
    const [error, setError] = useState(null);// eso se usa basicamente para almacenar  cualquier error que se pueda tener 
    const [taskName, setTaskName] = useState('');//Almacena el nombre de la nueva tarea en otras palabras esta vacio.

    const [isUpdating, setIsUpdating] = useState(false); // Nuevo estado para controlar la actualización
  //GET
    const getData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/task');
            if (!response.ok) { // el response lo que hace es verificar si la respuesta esta bien si no manda el mensaje 
                throw new Error('La respuesta de la red no es correcta');
            }
            const data = await response.json(); 
            setTasks(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
 //POST
    const addTask = async () => {
        if (!taskName) return;
        try {
            const response = await fetch('http://localhost:3000/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: taskName, status: false }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            await response.json();
            setTaskName('');
            getData();
        } catch (error) {
            setError(error.message);
        }
    };
//DELETE
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/task/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
            });
            getData();
        } catch (error) {
            setError(error.message);
        }
    };
 //PUT
    const toggleStatus = async (id) => {
        if (isUpdating) return; // Salir si ya se está actualizando una tarea
        setIsUpdating(true); // Marcar que se está actualizando
        try {
            const task = tasks.find((task) => task.id === id);
            const updatedStatus = !task.status;
            const response = await fetch(`http://localhost:3000/api/task/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: task.name, status: updatedStatus }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Actualizar el estado local de la tarea
            setTasks(tasks.map(task => task.id === id ? { ...task, status: updatedStatus } : task));

        } catch (error) {
            setError(error.message);
        } finally {
            setIsUpdating(false); // Desmarcar que se está actualizando
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Nombre de la tarea"
            />
            <button onClick={addTask}>Agregar Tarea</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.status}
                            onChange={() => toggleStatus(task.id)}
                            disabled={isUpdating} // Deshabilitar checkbox durante la actualización
                        />
                        <span style={{ textDecoration: task.status ? 'line-through' : 'none' }}>
                            {task.name} - {task.status ? 'Completada' : 'Pendiente'}
                        </span>
                        <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
