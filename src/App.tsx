import { useEffect, useRef, useState } from "react";
import { useFBAuth } from "@matterhorn-studios/react-fb-auth";
import NavBar from "./components/NavBar";
import { User } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Task } from "./interfaces/task";
import TaskCard from "./components/TaskCard";

const App: React.FC = () => {
  const { user, loading } = useFBAuth();

  const [needRefetch, setNeedRefetch] = useState(true);

  if (loading) return <div>loading...</div>;

  return (
    <div className="w-full h-screen py-4 px-8 text-white bg-gray-900">
      <NavBar loggedIn={user !== null} />
      {user ? (
        <LoggedIn
          user={user}
          setNeedsRefetch={setNeedRefetch}
          needsRefetch={needRefetch}
        />
      ) : (
        <LoggedOut />
      )}
    </div>
  );
};

const TaskList: React.FC<{
  user: User;
  needsRefetch: boolean;
  setNeedsRefetch: Function;
}> = ({ user, needsRefetch, setNeedsRefetch }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const hasFetchedTasks = useRef(false);

  // fetch the tasks from firestore
  const fetchTasks = async () => {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const db_tasks: Task[] = querySnapshot.docs.map((doc) => {
      return {
        completed: doc.data().completed,
        createdAt: new Date(doc.data().createdAt.seconds * 1000),
        completedAt: new Date(doc.data().completedAt.seconds * 1000),
        description: doc.data().description,
        task: doc.data().task,
        uid: doc.data().uid,
        id: doc.id,
      };
    });
    setTasks(db_tasks);
  };

  // initial fetch
  useEffect(() => {
    if (!hasFetchedTasks.current) {
      hasFetchedTasks.current = true;
      fetchTasks();
    }
  }, []);

  // refetch when needed
  useEffect(() => {
    if (needsRefetch) {
      fetchTasks();
      setNeedsRefetch(false);
    }
  }, [needsRefetch]);

  return (
    <div className="w-[600px] flex flex-col">
      {tasks.map((task) => (
        <TaskCard task={task} setNeedsRefetch={setNeedsRefetch} key={task.id} />
      ))}
    </div>
  );
};

const LoggedIn: React.FC<{
  user: User;
  needsRefetch: boolean;
  setNeedsRefetch: Function;
}> = ({ user, needsRefetch, setNeedsRefetch }) => {
  const [nTask, setNTask] = useState({
    task: "",
    description: "",
  });

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col">
        <TaskList
          user={user}
          needsRefetch={needsRefetch}
          setNeedsRefetch={setNeedsRefetch}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            // create the task in the db
            try {
              const docRef = await addDoc(collection(db, "tasks"), {
                uid: user.uid,
                task: nTask.task,
                description: nTask.description,
                completed: false,
                createdAt: new Date(),
                completedAt: new Date(),
              });
              // force refresh the tasks (should be optimized but this is a demo idc)
              setNeedsRefetch(true);
              setNTask({
                task: "",
                description: "",
              });
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }}
          className="w-[600px] bg-gray-700 p-2 rounded-md"
        >
          <h2 className="font-bold text-center underline text-2xl">
            Create New Task
          </h2>
          <div className="mb-4">
            <label htmlFor="task" className="font-light text-gray-200 block">
              task
            </label>
            <input
              type="text"
              name="task"
              value={nTask.task}
              onChange={(e) => setNTask({ ...nTask, task: e.target.value })}
              className="w-full rounded-md p-1 text-black shadow-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="font-light text-gray-200 block"
            >
              description
            </label>
            <textarea
              name="description"
              className="w-full rounded-md p-1 text-black shadow-md"
              rows={5}
              value={nTask.description}
              onChange={(e) =>
                setNTask({ ...nTask, description: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="px-2 py-1 font-bold bg-green-500 hover:bg-green-600 ml-8 rounded-lg mb-4"
          >
            create
          </button>
        </form>
      </div>
    </div>
  );
};

const LoggedOut: React.FC = () => {
  return <div>Please login!</div>;
};

export default App;
