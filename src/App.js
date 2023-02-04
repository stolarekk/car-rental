import React from "react";
import "./App.css";
import CarList from "./components/CarTile/CarTile";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import UserProfile from "./components/UserProfile/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
} from "react-router-dom";
function App() {
	const [user, setUser] = useState({});
	function handleLogout() {
		setUser({});
	}
	return (
		<div className='app'>
			<Router>
				<Navbar user={user.id} logout={handleLogout} />
				<Routes>
					<Route path='/' element={<Login setUser={setUser} user={user} />} />
					<Route path='/register' element={<Register />} />
					<Route path='/user/*' element={<ProtectedRoute user={user} redirectPath='/'><UserProfile user={user}/></ProtectedRoute>} />
					<Route
						path='/cars'
						element={
							<ProtectedRoute user={user} redirectPath='/'>
								<CarList user={user} />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
