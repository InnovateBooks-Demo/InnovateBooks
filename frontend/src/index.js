// Polyfill for process (required by simple-peer for WebRTC)
import process from 'process/browser';
window.process = process;

import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register PWA service worker
serviceWorkerRegistration.register();
