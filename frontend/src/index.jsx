import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
<<<<<<< HEAD
import App from "./components/App";
=======
import App from "./App";

//import App from "./components/App";
>>>>>>> 3534a8cd3ebc0fb5816cc1547908f3a7c05784e2
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
