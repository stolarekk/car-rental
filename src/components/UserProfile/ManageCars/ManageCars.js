import React from "react";
import { useState, useEffect } from "react";
import "./ManageCars.css";
import { HiXMark, HiCheck } from "react-icons/hi2";
import axios from "axios";

function AddCarForm(props) {
	const [brand, setBrand] = useState("");
	const [model, setModel] = useState("");
	const [yearOfProduction, setYearOfProduction] = useState('');
	const [fuelType, setFuelType] = useState("");
	const [engineCapacity, setEngineCapacity] = useState('');
	const [numberOfDoors, setNumberOfDoors] = useState('');
	const [photo, setPhoto] = useState("");
	const [pricePerDay, setPricePerDay] = useState('');
	const [addSuccess, setAddSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	function addCar(e) {
		e.preventDefault();
		axios
			.post("https://grzegorz2115.alwaysdata.net/api/cars", {
				brand: brand,
				model: model,
				yearOfProduction: yearOfProduction,
				fuelType: fuelType,
				engineCapacity: engineCapacity,
				numberOfDoors: numberOfDoors,
				photo: photo,
				pricePerDay: pricePerDay,
				availability: true
			})
			.then(function(response) {
				if (response.status === 200) {
					setAddSuccess(true);
				} else {
					setErrorMessage(
						"Wypożyczenie zakończone niepowodzeniem. Spróbuj ponownie."
					);
				}
			});
	}

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					{addSuccess ? (
						<div className='form-success'>
							<HiCheck className='form-successIcon' />
							<p>Wypożyczenie zakończone sukcesem!</p>
						</div>
					) : (
						<>
							<button className='form-btnClose' onClick={props.closeForm}>
								<HiXMark className='form-btnIcon' />
							</button>
							<form className='login-form' onSubmit={addCar}>
								<h2 className='login-title'>Uzupełnij dane nowego samochodu</h2>
								<div className='form-group'>
									<label htmlFor='brand'>Marka:</label>
									<input
										type='text'
										className='form-control'
										placeholder="Seat"
										id='brand'
										value={brand}
										onChange={e => setBrand(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label for='model'>Model:</label>
									<input
										type='text'
										className='form-control'
										placeholder="Leon"
										id='model'
										value={model}
										onChange={e => setModel(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='yearOfProduction'>Rok produkcji:</label>
									<input
										type='number'
										min={2000}
										max={2023}
										className='form-control'
										placeholder='2021'
										id='yearOfProduction'
										value={yearOfProduction}
										onChange={e => setYearOfProduction(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='fuelType'>Rodzaj paliwa:</label>
									<input
										type='text'
										className='form-control'
										placeholder='diesel'
										id='fuelType'
										value={fuelType}
										onChange={e => setFuelType(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='engineCapacity'>Pojemność silnika:</label>
									<input
										type='number'
										min={0.8}
										max={10.0}
										step={0.1}
										className='form-control'
										placeholder='1.9'
										id='engineCapacity'
										value={engineCapacity}
										onChange={e => setEngineCapacity(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='numberOfDoors'>Liczba drzwi:</label>
									<input
										type='number'
										min={1}
										max={6}
										className='form-control'
										placeholder='5'
										id='numberOfDoors'
										value={numberOfDoors}
										onChange={e => setNumberOfDoors(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='price'>Cena za dzień:</label>
									<input
										type='number'
										className='form-control'
										placeholder='400'
										min={200}
										max={2000}
										step={50}
										id='price'
										value={pricePerDay}
										onChange={e => setPricePerDay(e.target.value)}
										required
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='photo'>Link do zdjęcia:</label>
									<input
										type='text'
										className='form-control'
										placeholder='https://www.seat.pl/leon.png'
										id='photo'
										value={photo}
										onChange={e => setPhoto(e.target.value)}
										required
									/>
								</div>
								<button type='submit' className='btn btn-login'>
									Dodaj nowy samochód {props.brand} {props.model}
								</button>
								<p className='errorMessage'>{errorMessage}</p>
							</form>
						</>
					)}
				</div>
			</div>
			<div className='form-background' onClick={props.closeForm}></div>
		</>
	);
}

function Car(props) {
	const {
		id,
		brand,
		model,
		yearOfProduction,
		fuelType,
		engineCapacity,
		numberOfDoors,
		photo,
		pricePerDay,
		availability,
	} = props;
	const [confirm, setConfirm] = useState(false);
	function updateCarAvailability(e) {
		e.preventDefault();
		axios
			.put(
				`https://grzegorz2115.alwaysdata.net/api/cars/availability/${id}/${!availability}`
			)
			.then(function(response) {
				if (response.status === 200) {
					console.log(response);
					props.fetchCars();
					// setRentSuccess(true);
				}
			});
	}
	function deleteCar(e) {
		e.preventDefault();
		axios
			.delete(`https://grzegorz2115.alwaysdata.net/api/cars/${id}`)
			.then(function(response) {
				if (response.status === 200) {
					props.fetchCars();
					setConfirm(false);
				}
			});
	}

	return (
		<div className='manage-car'>
			<div className='manage-info'>
				<strong>ID: {id}</strong>
				<strong>
					{brand} {model}
				</strong>
				<p>Rok produkcji: {yearOfProduction}</p>
				<p>Rodzaj paliwa: {fuelType}</p>
				<p>Pojemność silnika: {engineCapacity}</p>
				<p>Liczba drzwi: {numberOfDoors}</p>
			</div>
			<div className='manage-details'>
				<img className='manage-details--img' src={photo} />
				{availability ? (
					<p className='rental-info--state rental-info--state-on'>Dostępne</p>
				) : (
					<p className='rental-info--state rental-info--state-off'>
						Wypożyczone
					</p>
				)}
				<div className='manage-details--info'>
					<button
						className='btn btn-blue btn-manage'
						onClick={updateCarAvailability}>
						Zmień dostępność
					</button>
					{confirm ? (
						<>
							<p className='confirm-text'>Czy na pewno?</p>
							<div className='confirm'>
								<button className='btn btn-red btn-manage' onClick={deleteCar}>
									TAK
								</button>
								<button
									className='btn btn-red btn-manage'
									onClick={() => setConfirm(false)}>
									NIE
								</button>
							</div>
						</>
					) : (
						<button
							className='btn btn-red btn-manage'
							onClick={() => setConfirm(true)}>
							Usuń samochód
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

function ManageCars() {
	const [cars, setCars] = useState();
	const [showForm, setShowForm] = useState(false);
	async function fetchCarsData() {
		try {
			const res = await axios.get(
				"https://grzegorz2115.alwaysdata.net/api/cars"
			);
			setCars(res.data);
		} catch (err) {}
	}
	useEffect(() => {
		fetchCarsData();
	}, []);

	return (
		<div className='manage-container'>
			<button
				className='btn btn-blue btn-manage'
				onClick={() => setShowForm(true)}>
				Dodaj nowy samochód
			</button>
			{showForm ? <AddCarForm closeForm={() => setShowForm(false)} /> : null}
			{cars
				? cars.map((car, index) => (
						<Car key={index} {...car} fetchCars={fetchCarsData} />
				  ))
				: null}
		</div>
	);
}

export default ManageCars;
