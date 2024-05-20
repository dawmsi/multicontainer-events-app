import { Outlet } from "react-router-dom";
import Drawer from "./components/Drawer";
import BottomNavbar from "./components/BottomNavbar";

function App() {
  return (
    <Drawer>
      <Outlet />
      <BottomNavbar />
    </Drawer>
  );
}

export default App;
