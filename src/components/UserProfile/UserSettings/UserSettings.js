import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function UserSettings(props) {
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [firstName, setFirstName] = useState(props.firstName);
	const [lastName, setLastName] = useState(props.lastName);
	const [address, setAddress] = useState(props.address);
	const [phone, setPhone] = useState(props.phone);
	const [errorMessage, setErrorMessage] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
    
	async function changeSettings(e) {
		e.preventDefault();
		if (password === password2) {
			const res = await axios
				.put(`https://grzegorz2115.alwaysdata.net/api/user/${props.id}`, {
					login: props.login,
					password: password,
					firstName: firstName,
					lastName: lastName,
					address: address,
					phone: phone,
                    admin: true
				})
				.then(function(response) {
                    console.log(response)
					if (response.status === 200) {
						setErrorMessage("");
						setMessage("Dane pomyślnie zmienione");
						setPassword("");
						setPassword2("");
					} else {
						setMessage("");
						setErrorMessage("Zmiana danych zakończona niepowodzeniem");
					}
				});
		} else {
			setMessage("");
			setErrorMessage("Podane hasła różnią się od siebie");
			setPassword("");
			setPassword2("");
		}
	}

	return (
		<div className='settings-container'>
			<form className='settings-form' onSubmit={changeSettings}>
				<div className='settings-form-group'>
					<label htmlFor='username'>Imię:</label>
					<input
						type='text'
						placeholder='Imię'
						className='settings-form-control'
						id='firstName'
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className='settings-form-group'>
					<label htmlFor='username'>Nazwisko:</label>
					<input
						type='text'
						placeholder='Nazwisko'
						className='settings-form-control'
						id='lastName'
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						required
					/>
				</div>
				<div className='settings-form-group'>
					<label htmlFor='username'>Adres zamieszkania:</label>
					<input
						type='text'
						placeholder='Adres zamieszkania'
						className='settings-form-control'
						id='address'
						value={address}
						onChange={e => setAddress(e.target.value)}
						required
					/>
				</div>
				<div className='settings-form-group'>
					<label htmlFor='username'>Telefon:</label>
					<input
						type='tel'
						placeholder='Telefon'
						className='settings-form-control'
						id='phone'
						value={phone}
						onChange={e => setPhone(e.target.value)}
						required
					/>
				</div>
				<div className='settings-form-group'>
					<label htmlFor='password'>Hasło:</label>
					<input
						type='password'
						placeholder='Hasło'
						className='settings-form-control'
						id='password'
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className='settings-form-group'>
					<label htmlFor='password'>Potwierdzenie hasła:</label>
					<input
						type='password'
						placeholder='Hasło'
						className='settings-form-control'
						id='password2'
						value={password2}
						onChange={e => setPassword2(e.target.value)}
						required
					/>
				</div>
				<button type='submit' className='btn btn-settings'>
					Zmień dane
				</button>
				<p className='errorMessage'>{errorMessage}</p>
				<p className='message'>{message}</p>
			</form>
		</div>
	);
}

export default UserSettings;
