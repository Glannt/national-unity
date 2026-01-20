import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import TimelinePage from "@/pages/timeline";
import ConnectionsPage from "@/pages/connections";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<TimelinePage />} path="/timeline" />
      <Route element={<ConnectionsPage />} path="/connections" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
