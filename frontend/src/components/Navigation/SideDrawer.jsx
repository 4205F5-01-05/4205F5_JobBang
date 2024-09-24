// --- IMPORTS ---
import { createPortal } from "react-dom";

import "./SideDrawer.css";

// --- DEFAULT FUNCTION ---
const SideDrawer = (props) => {
  const content = (
    <aside className="side-drawer" onClick={props.onClick}>
      {props.children}
    </aside>
  );

  return createPortal(content, document.getElementById("drawer"));
};

export default SideDrawer;
