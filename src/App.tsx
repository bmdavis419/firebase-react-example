import { useState } from "react";
import { useFBAuth } from "@matterhorn-studios/react-fb-auth";
import NavBar from "./components/NavBar";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const { user } = useFBAuth();
  return (
    <div className="w-full h-screen py-4 px-8 text-white bg-gray-900">
      <NavBar loggedIn={user !== null} />
      {user ? <LoggedIn /> : <LoggedOut />}
    </div>
  );
};

const LoggedIn: React.FC = () => {
  return <div>logged in</div>;
};

const LoggedOut: React.FC = () => {
  return <div>logged out</div>;
};

export default App;
