import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
const Navbar = props => {
	const navigate = useNavigate(); 
	function goToLogin() {
		navigate('/login');
	}
	function goToRegister() {
		navigate('/register');
	}
	function goToProfile() {
		navigate('/user/rentals');
	}
	function goToCars() {
		navigate('/cars');
	}
	function logout() {
		props.logout()
		navigate('/login')
	}
	return (
		<nav className='navbar'>
			<div className="navbar-main">
				<button onClick={goToCars} className='navbar-brand'>CAR RENTAL</button>
				<div className='navbar-nav'>
					{!props.user ? (
						<>
							<button className='btn btn-blue' type='submit' onClick={goToLogin}>
								Logowanie
							</button>
							<button className='btn btn-red' type='submit' onClick={goToRegister}>
								Rejestracja
							</button>
						</>
					) : (
						<>
						<button
							className='btn btn-blue'
							type='submit'
							onClick={goToProfile}>
							Twoje konto
						</button>
						<button
							className='btn btn-blue'
							type='submit'
							onClick={logout}>
							WYLOGUJ
						</button></>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
