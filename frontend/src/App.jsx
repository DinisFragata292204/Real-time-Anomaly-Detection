import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimpleLogin from './pages/Login.jsx';
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import CreateSensor from "./pages/CreateSensor.jsx";
import CreateNewUser from "./pages/CreateNewUser.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/createNewUser" element={<CreateNewUser />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/createSensor" element={<ProtectedRoute><CreateSensor /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App