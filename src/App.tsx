import { Routes, Route } from "react-router-dom";
import  Home from "./pages/Home";
import Map from "./pages/Map";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
    </Routes>
  );
}