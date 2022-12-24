import { FaCheckDouble, FaEdit, FaRegTrashAlt } from 'react-icons/fa';

const Task = ({ task, index, deleteTask, getSingleTask, setToComplete }) => {
    // console.log(task);
    return (
        <div className={`task ${task.completed ? 'completed' : ''}`}>
            <p>
                <b>{index + 1}. </b>
                {task.name}
            </p>
            <div className="task-icons">
                <FaCheckDouble color='green' onClick={() => setToComplete(task)} />
                <FaEdit color='purple' onClick={() => getSingleTask(task)} />
                <FaRegTrashAlt color='red' onClick={() => deleteTask(task._id, task.name)} />
            </div>
        </div>
    );
};

export default Task;