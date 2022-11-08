import { useFBAuth } from "@matterhorn-studios/react-fb-auth";

const NavBar: React.FC<{ loggedIn: boolean }> = ({ loggedIn }) => {
  const { googleSignIn, logOut } = useFBAuth();

  return (
    <nav className="flex justify-between align-middle">
      <h3 className="text-4xl font-bold">Tasks Demo</h3>
      <ul className="flex flex-row space-x-10 items-center">
        <li>
          <a
            href="https://firebase.google.com/docs/web/setup"
            target="_blank"
            rel="noreferrer noopener"
            className="font-light hover:underline"
          >
            Firebase
          </a>
        </li>
        <li>
          <a
            href="https://vitejs.dev/guide/"
            target="_blank"
            rel="noreferrer noopener"
            className="font-light hover:underline"
          >
            React + Vite
          </a>
        </li>
        <li>
          <a
            href="https://tailwindcss.com/docs/guides/create-react-app"
            target="_blank"
            rel="noreferrer noopener"
            className="font-light hover:underline"
          >
            Tailwind
          </a>
        </li>
        {loggedIn ? (
          <LogoutButton signOut={logOut} />
        ) : (
          <LoginButton signIn={googleSignIn} />
        )}
      </ul>
    </nav>
  );
};

const LoginButton: React.FC<{ signIn: Function }> = ({ signIn }) => {
  return (
    <button
      className="bg-yellow-500 px-3 py-2 font-bold rounded-md shadow-lg hover:bg-yellow-600"
      onClick={() => signIn()}
    >
      login
    </button>
  );
};

const LogoutButton: React.FC<{ signOut: Function }> = ({ signOut }) => {
  return (
    <button
      className="bg-red-500 px-3 py-2 font-bold rounded-md shadow-lg hover:bg-red-600"
      onClick={() => signOut()}
    >
      logout
    </button>
  );
};

export default NavBar;
