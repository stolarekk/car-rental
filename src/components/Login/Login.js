import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
function Login(props){
	const [login, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	async function getUserData(id) {
		const res = await axios
			.get(`https://grzegorz2115.alwaysdata.net/api/user/${id}`)
            props.setUser(res.data)
            navigate('/cars')
	}

	function handleLogin (e){
		e.preventDefault();
		axios.post("https://grzegorz2115.alwaysdata.net/api/user/login", {
				login: login,
				password: password,
			})
			.then(function(response) {
				if (response.status === 200) {
					getUserData(response.data.id);
				}
			})
			.catch(error => setErrorMessage('Incorrect username or password. Please try again.'));
	};

	return (
		<div className='login-container'>
			<form className='login-form' onSubmit={handleLogin}>
				<h2 className='login-title'>Logowanie</h2>
				<div className='form-group'>
					<label htmlFor='login'>Login:</label>
					<input
						type='text'
						placeholder='Login'
						className='form-control'
						id='login'
						value={login}
						onChange={e => setUsername(e.target.value)}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='password'>Hasło:</label>
					<input
						type='password'
						placeholder='Hasło'
						className='form-control'
						id='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<button type='submit' className='btn btn-login'>
					Zaloguj
				</button>
				<p className='errorMessage'>{errorMessage}</p>
			</form>
		</div>
	);
};

export default Login;
