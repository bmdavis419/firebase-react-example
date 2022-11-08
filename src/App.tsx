import { useState } from "react";
import { useFBAuth } from "@matterhorn-studios/react-fb-auth";
import NavBar from "./components/NavBar";
import { User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const App: React.FC = () => {
  const { user, loading } = useFBAuth();

  if (loading) return <div>loading...</div>;

  return (
    <div className="w-full h-screen py-4 px-8 text-white bg-gray-900">
      <NavBar loggedIn={user !== null} />
      {user ? <LoggedIn user={user} /> : <LoggedOut />}
    </div>
  );
};

const LoggedIn: React.FC<{ user: User }> = ({ user }) => {
  const [nTask, setNTask] = useState({
    task: "",
    description: "",
  });

  return (
    <div className="w-full flex justify-center">
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
            console.log("Document written with ID: ", docRef.id);
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
  );
};

const LoggedOut: React.FC = () => {
  return <div>Please login!</div>;
};

export default App;
