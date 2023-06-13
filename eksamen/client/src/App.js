import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import UserHome from "./pages/userhome";
import Signup from "./pages/signup";
import Mypage from "./pages/mypage";
import Adminpage from "./pages/adminpage";
import Record from "./pages/policeInfo";

import Chat from "./pages/chat";
import Meeting from "./pages/meeting";
import MultipleUsers from "./pages/multipleUsers";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/userhome" element={<UserHome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/adminpage" element={<Adminpage />} />
          <Route path="/record" element={<Record />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/multipleUsers" element={<MultipleUsers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
