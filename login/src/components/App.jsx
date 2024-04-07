import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "../routes/Login";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import  Search from "../routes/Search";
import Status from "./Status";

import { UserContextProvider } from "../context/UserContext";

function App() {
  return (
    <>
      <UserContextProvider>
              <Router>
                  <Routes>
                      <Route exact path="/" Component={Login} />
                      <Route exact path="/home" Component={Home} />
                      <Route exact path="/status/:id" Component={Status} />
                      <Route exact path="/profile/:id" Component={Profile} />
                      <Route exact path="/search" Component={Search} />
                  </Routes>
              </Router>
      </UserContextProvider>
    </>
  );
}

export default App;
