import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Recycle from "./pages/Recycle";
import Dashboard from "./pages/Dashboard";
import Track from "./pages/Track";
import Management from "./pages/Management";
import Services from "./pages/Services";
import IncentivesBoard from "./pages/IncentivesBoard";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recycle" element={<Recycle />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track/:id" element={<Track />} />
        <Route path="/management" element={<Management />} />
        <Route path="/services" element={<Services />} />
        <Route path="/incentives" element={<IncentivesBoard />} />
      </Routes>
    </BrowserRouter>
  );
}
