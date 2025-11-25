import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleLogin from './pages/Login.jsx';
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App