// --- IMPORTS ---
import MainNavigation from "../components/Navigation/MainNavigation";
import { Outlet } from "react-router-dom";

// --- DEFAULT FUNCTION ---
export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}
