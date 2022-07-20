import "./App.css";
import Landing from "./pages/Landing/Index";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import DashBoard from "./layout/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<DashBoard />}>
          <Route path="/home"element ={<Home/>}/>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          {/* <Route path="post/:id" element={<Landing />} /> */}
        </Route>
        <Route path="/team" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
