import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Body from "./components/Body";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import Feed from "./components/Feed";
import Connection from "./components/Connection";
import Request from "./components/Request";
import SignupPage from "./components/Signup";
import Chat from "./components/Chat";
import Premium from "./components/Premium";
function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage/>}/>
          <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed/>}/>
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connection/>}/>
              <Route path="/requests" element={<Request/>}/>
              <Route path="/chat/:id" element={<Chat/>}/>
              <Route path="/payment" element={<Premium/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
