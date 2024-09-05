import { useState, useCallback } from "react";

import MainNavigation from "../components/Navigation/MainNavigation";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

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
