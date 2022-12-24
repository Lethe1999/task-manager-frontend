import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TaskForm from './TaskForm';
import Task from './Task';
import axios from 'axios';
import { URL } from '../App';
import loadingImg from '../assets/loader.gif';

const TaskList = () => {
    // Form
    const [formData, setFormData] = useState({
        name: '',
        completed: false,
    });
    const { name } = formData;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target);
        setFormData({ ...formData, [name]: value });
    };

    // Create a task
    const createTask = async (e) => {
        e.preventDefault();
        // Check
        if (name === '') {
            return toast.error("Input field cannot be empty!");
        }
        // Add to the database
        await axios.post(`${URL}/api/tasks`, formData)
            .then(() => {
                toast.success("Task added successfully");
                setFormData({ ...formData, name: '' });
            })
            .catch((error) => {
                toast.error(error.message);
            })
        // try {
        //     console.log("aaa");
        //     await axios.post("http://localhost:5001/api/tasks", formData);
        //     console.log("bbb");
        //     toast.success("Task added successfully");
        //     setFormData({ ...formData, name: '' });
        // } catch (error) {
        //     toast.error(error.message);
        //     console.log(error);
        // }
        getTasks();
    };


    // Read tasks
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getTasks = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${URL}/api/tasks`);
            // console.log(data);
            setTasks(data);
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false);
    };
    useEffect(() => {
        getTasks();
    }, [])

    useEffect(() => {
        setCompletedTasks(tasks.filter((task) => {
            return task.completed;
        }));
    }, [tasks])


    // Update a task
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState('');

    const getSingleTask = async (task) => {
        setIsEditing(true);
        setTaskId(task._id);
        setFormData({ name: task.name, completed: false });
    };

    const updateTask = async (e) => {
        e.preventDefault();
        if (name === '') {
            return toast.error("Input field cannot be empty!");
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskId}`, formData);
            toast.success("Update task successfully!");
            setFormData({ ...formData, name: '' });
            setIsEditing(false);
            getTasks();     // Refresh
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Complete a task
    const setToComplete = async (task) => {
        const newForm = {
            name: task.name,
            completed: true,
        };
        try {
            await axios.put(`${URL}/api/tasks/${task._id}`, newForm);
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    };


    // Delete a task by id
    const deleteTask = async (id, name) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`);
            toast.success(`Delete task ${name} successfully.`)
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <>
            <h2>Task Manager</h2>
            <TaskForm
                updateTask={updateTask}
                createTask={createTask}
                name={name}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
            />
            <div className="--flex-between --pb">
                <p>
                    <b>Total Tasks: </b>
                    {tasks.length}
                </p>
                <p>
                    <b>Completed Tasks: </b>
                    {completedTasks.length}
                </p>
            </div>
            <hr />
            {
                isLoading &&
                <div className='--flex-center'>
                    <img src={loadingImg} alt='' />
                </div>
            }
            {
                !isLoading && tasks.length === 0 ?
                    <p className='--py'>No task found. Please add a task.</p>
                    :
                    <>
                        {
                            tasks.map((task, index) => {
                                return (
                                    <Task
                                        key={task._id}
                                        task={task} index={index}
                                        deleteTask={deleteTask}
                                        getSingleTask={getSingleTask}
                                        setToComplete={setToComplete}
                                    />
                                );
                            })
                        }
                    </>
            }
        </>
    );
};

export default TaskList;