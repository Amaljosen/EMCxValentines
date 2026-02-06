import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./Create"
import Dashboard from "./Dashboard";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Create/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}
