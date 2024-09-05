import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

//import App from "./components/App";
import { AuthProvider } from "./context/auth-context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

// Utilisation du authProvider source: Jad Sabbagh
