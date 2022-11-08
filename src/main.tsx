import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FBAuthProvider } from "@matterhorn-studios/react-fb-auth";
import { auth, gProvider } from "./firebase";
import { browserLocalPersistence } from "firebase/auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FBAuthProvider
    fb_auth={auth}
    g_provider={gProvider}
    persistence_type={browserLocalPersistence}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </FBAuthProvider>
);
