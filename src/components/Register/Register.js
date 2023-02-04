import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import UserSettings from '../UserProfile/UserSettings/UserSettings';
function Register(props) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [admin, setAdmin] = useState(false);
    console.log(admin)
    const navigate = useNavigate()
    function handleRegister(e) {
        e.preventDefault();
        axios.post("https://grzegorz2115.alwaysdata.net/api/user/register", {
				login: login,
				password: password,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phone: phone,
                admin: admin
                
			}).then(function(response) {
				if (response.status === 200) {
                    setErrorMessage('Rejestracja przebiegła pomyślnie!')
                    setTimeout(() => navigate("/"), 1000)
					
				}
                else {
                    setErrorMessage('Rejestracja zakończona niepowodzeniem');
                };
			})
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleRegister}>
                <h2 className="login-title">Rejestracja</h2>
                <div className="form-group">
                    <label htmlFor="username">Login:</label>
                    <input type="text" placeholder="Login" className="form-control" id="login" value={login} onChange={(e) => setLogin(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło:</label>
                    <input type="password" placeholder="Hasło" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Imię:</label>
                    <input type="text" placeholder="Imię" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Nazwisko:</label>
                    <input type="text" placeholder="Nazwisko" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Adres zamieszkania:</label>
                    <input type="text" placeholder="Adres zamieszkania" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Telefon:</label>
                    <input type="text" placeholder="Telefon" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-login">Zarejestruj</button>
                <p>Admin:</p><input
						type='checkbox'
						name='checkbox'
						className='filter-control--checkbox'
						onClick={e => setAdmin(e.target.checked)}
					/>
                <p className='errorMessage'>{errorMessage}</p>
            </form>
        </div>
    )
}

export default Register;
