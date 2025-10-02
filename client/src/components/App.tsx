import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";

function App() {
  return (
    <div>
      <main style={{ marginLeft: "270px" }}>
        <Sidebar />
        <h1>Dom Zdravlja</h1>
        <Outlet /> {/* tu će se prikazivati djeca rute */}
      </main>
    </div>
  );
}

export default App;
