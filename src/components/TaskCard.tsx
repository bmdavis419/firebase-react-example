import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Task } from "../interfaces/task";

const TaskCard: React.FC<{ task: Task; setNeedsRefetch: Function }> = ({
  task,
  setNeedsRefetch,
}) => {
  const completeTask = async () => {
    const tasksRef = collection(db, "tasks");
    const docRef = doc(tasksRef, task.id);
    await updateDoc(docRef, {
      completed: true,
      completedAt: new Date(),
    });
    setNeedsRefetch(true);
  };

  const deleteTask = async () => {
    const tasksRef = collection(db, "tasks");
    const docRef = doc(tasksRef, task.id);
    await deleteDoc(docRef);
    setNeedsRefetch(true);
  };

  return (
    <div className="w-full bg-gray-700 mb-4 p-4 shadow-lg rounded-md">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">{task.task} </h2>
        <h4 className="font-light text-gray-300 italic">
          {task.createdAt.toISOString().split("T")[0]}
        </h4>
      </div>
      <p>{task.description}</p>
      <div className="flex justify-center">
        {!task.completed ? (
          <button
            className="mb-4 bg-green-600 p-1 font-bold text-md rounded-lg shadow-lg hover:bg-green-700"
            onClick={() => completeTask()}
          >
            complete
          </button>
        ) : (
          <button
            className="mb-4 border-4 border-green-600 p-1 font-bold text-md rounded-lg"
            disabled
          >
            completed at: {task.completedAt.toLocaleTimeString()} on{" "}
            {task.completedAt.toLocaleDateString()}
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <button
          className="bg-red-600 p-1 font-bold text-md rounded-lg shadow-lg hover:bg-green-700"
          onClick={() => deleteTask()}
        >
          delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
