import {
  Repo,
  WebSocketClientAdapter,
  IndexedDBStorageAdapter,
  RepoContext,
} from "@automerge/react";

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const syncServerUrl = import.meta.env.VITE_SYNC_SERVER_URL;
console.log(`sync server URL: ${syncServerUrl}`);

const repo = new Repo({
  network: [
    new WebSocketClientAdapter(syncServerUrl),
  ],
  storage: new IndexedDBStorageAdapter("automerge"),
});

// @ts-expect-error -- we put the handle and the repo on window so you can experiment with them from the dev tools
window.repo = repo;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <Suspense>
        <App />
      </Suspense>
    </RepoContext.Provider>
  </React.StrictMode>,
);
