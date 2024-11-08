"use client";

import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "../routes/Login";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import  Search from "../routes/Search";
import StatusPage from "../routes/StatusPage";
import TagPage from "../routes/TagPage";
import { UserContextProvider } from "../context/UserContext";
import { ErrorProvider } from "../context/ErrorContext";
import ThemeSwitchPage from "../routes/ThemeSwitchPage";
import Vikalp from "../routes/Vikalp";
import Graph from "../routes/Graph";
import GraphProfile from "../routes/GraphProfile";
import About from "../routes/About";

// App component contains all the routes of the application
function App() {
	const experience = localStorage.getItem("experience");
	const selectedExp = {
		1: "Classic",
		2: "Graph"
	}
	if(!(experience in selectedExp)){
		alert("Invalid Experience Selected. Redirecting to Classic Experience");
		localStorage.setItem("experience", 1);
		window.location.reload(false);
	}
	const expMap = {
		"home": [Home, Graph],
		"profile": [Profile, GraphProfile]
	}
	return (
		<>
			<UserContextProvider>	
				<ErrorProvider>
					<Router>
						<Routes>
							<Route exact path="/" Component={Login} />
							<Route exact path="/auth" Component={Login} />
							<Route exact path="/home" Component={expMap["home"][+experience - 1]} />
							<Route exact path="/status/:id" Component={StatusPage} />
							<Route exact path="/profile/:id" Component={expMap["profile"][+experience - 1]} />
							<Route exact path="/search/:q" Component={Search} />
							<Route exact path="/tags/:name" Component={TagPage} />
							<Route exact path="/theme" Component={ThemeSwitchPage} />
							<Route exact path="/vikalp" Component={Vikalp} />
							{/* <Route exact path="/graph" Component={Graph} /> */}
							<Route exact path="/about" Component={About} />
							<Route path="*" element={<div>404</div>} />
						</Routes>
					</Router>
				</ErrorProvider>
			</UserContextProvider>
		</>
	);
}

export default App;
