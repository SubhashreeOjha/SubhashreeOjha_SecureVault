import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vault from "./pages/Vault";
import SecurityCenter from "./pages/SecurityCenter";
import Recovery from "./pages/Recovery";
function App(){return <BrowserRouter><Routes><Route path="/" element={<Navigate to="/login" replace/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/recovery" element={<Recovery/>}/><Route path="/vault" element={<Vault/>}/><Route path="/security" element={<SecurityCenter/>}/><Route path="*" element={<Navigate to="/login" replace/>}/></Routes></BrowserRouter>}
export default App;
