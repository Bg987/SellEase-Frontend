import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStateProvider } from './components/GS'; // import the provider
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </React.StrictMode>
);
