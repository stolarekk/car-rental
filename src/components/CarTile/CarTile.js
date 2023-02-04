import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiXMark, HiCheck } from "react-icons/hi2";
import "./CarTile.css";

function Form(props) {
	const date = new Date().toISOString().split("T")[0];
	const [rentalDate, setRentalDate] = useState(date);
	const [returnDate, setReturnDate] = useState(date);
	const [rentalCost, setRentalCost] = useState("0");
	const [rentBlocked, setRentBlocked] = useState(false);
	const [rentSuccess, setRentSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (rentalDate && returnDate) {
			const date1 = new Date(rentalDate);
			const date2 = new Date(returnDate);
			const dateDifference = (date2.getTime() - date1.getTime()) / 86400000 + 1;
			if (dateDifference < 1) {
				setErrorMessage("Data zwrotu musi być większa niż data wypożyczenia!");
				setRentBlocked(true);
				setRentalCost(0);
			} else {
				setErrorMessage("");
				setRentBlocked(false);
				setRentalCost(dateDifference * props.price);
			}
		} else {
			setErrorMessage("Niepoprawna data!");
			setRentBlocked(true);
		}
	}, [rentalDate, returnDate]);

	function rentCar(e) {
		e.preventDefault();
		if (!rentBlocked) {
			axios
				.post("https://grzegorz2115.alwaysdata.net/api/rentals", {
					idCar: props.carID,
					idUser: props.userID,
					rentalDate: rentalDate,
					returnDate: returnDate,
					cost: rentalCost,
				})
				.then(function(response) {
					if (response.status === 201) {
						setRentSuccess(true);
						props.fetchCars();
					} else {
						setErrorMessage(
							"Wypożyczenie zakończone niepowodzeniem. Spróbuj ponownie."
						);
					}
				});
		} else {
			setErrorMessage("Niepoprawne dane");
		}
	}

	return (
		<>
			<div className='form-container'>
				<div className='form'>
					{rentSuccess ? (
						<div className='form-success'>
							<HiCheck className='form-successIcon' />
							<p>Wypożyczenie zakończone sukcesem!</p>
						</div>
					) : (
						<>
							<button className='form-btnClose' onClick={props.closeForm}>
								<HiXMark className='form-btnIcon' />
							</button>
							<form className='login-form' onSubmit={rentCar}>
								<h2 className='login-title'>Wypełnij formularz wypożyczenia</h2>
								<div className='form-group'>
									<label htmlFor='rentalDate'>Data wypożyczenia:</label>
									<input
										type='date'
										className='form-control'
										id='rentalDate'
										value={rentalDate}
										onChange={e => setRentalDate(e.target.value)}
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='returnDate'>Data zwrotu:</label>
									<input
										type='date'
										className='form-control'
										id='returnDate'
										value={returnDate}
										onChange={e => setReturnDate(e.target.value)}
									/>
								</div>
								<div className='form-group'>
									<label htmlFor='returnDate'>Koszt całkowity [PLN]:</label>
									<input
										type='text'
										className='form-control'
										placeholder={rentalCost}
										id='returnDate'
										value={rentalCost}
										onChange={e => setRentalCost(e.target.value)}
										readOnly
									/>
								</div>
								<button type='submit' className='btn btn-login'>
									Wypożycz {props.brand} {props.model}
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

function CarTile(props, user) {
	const [showForm, setShowForm] = useState(false);
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

	function rentCar() {
		document.body.style.position = "static";
		document.body.style.overflow = "hidden";
		document.body.style.marginRight = "17px";
		setShowForm(true);
	}
	function closeForm() {
		document.body.style.overflow = "auto";
		document.body.style.marginRight = "0px";
		setShowForm(false);
	}

	return (
		<div className='card'>
			<img src={photo} className='card-img-top' alt={`${brand} ${model}`} />
			<div className='card-body'>
				<h4 className='card-title'>
					{brand} {model}
				</h4>
				<p className='card-text'>
					<strong>Rok produkcji:</strong> {yearOfProduction} <br />
					<strong>Pojemność silnika:</strong>{" "}
					{fuelType === "elektryczny" ? `nie dotyczy` : `${engineCapacity}L`}
					<br />
					<strong>Rodzaj paliwa:</strong> {fuelType} <br />
					<strong>Liczba drzwi:</strong> {numberOfDoors} <br />
					<strong>Cena/dzień:</strong> {pricePerDay} zł
				</p>
				<div className='card-bottom'>
					{availability ? (
						<button className='btn btn-red btn-card' onClick={rentCar}>
							Rent
						</button>
					) : (
						<p className='reserved-text'>Reserved</p>
					)}
				</div>
			</div>
			{showForm ? (
				<Form
					closeForm={closeForm}
					brand={brand}
					model={model}
					price={pricePerDay}
					carID={id}
					userID={props.user}
					fetchCars={props.fetchCars}
				/>
			) : null}
		</div>
	);
}

function CarList(props) {
	const [cars, setCars] = useState([]);
	const [filteredCars, setFilteredCars] = useState([]);
	const [minYearOfProduction, setMinYearOfProduction] = useState(2000);
	const [maxYearOfProduction, setMaxYearOfProduction] = useState(2023);
	const [fuelType, setFuelType] = useState("benzyna");
	const [doors, setDoors] = useState("4");
	const [minPrice, setMinPrice] = useState(200);
	const [maxPrice, setMaxPrice] = useState(2000);
	const [filterState, setFilterState] = useState(false);
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

	function carFilter(car) {
		if (
			car.yearOfProduction >= minYearOfProduction &&
			car.yearOfProduction <= maxYearOfProduction &&
			car.fuelType === fuelType &&
			car.numberOfDoors.toString() === doors &&
			car.pricePerDay >= minPrice &&
			car.pricePerDay <= maxPrice
		) {
			return car;
		}
	}

	useEffect(() => {
		const filteredCars = cars.filter(carFilter);
		setFilteredCars(filteredCars);
	}, [
		cars,
		minYearOfProduction,
		maxYearOfProduction,
		minPrice,
		maxPrice,
		doors,
		fuelType,
		filterState,
	]);

	function showCars(cars) {
		const filteredCars = cars.filter(carFilter);
		console.log(filteredCars);
		return <div></div>;
		// cars.map((car, index) => (
		// 	<CarTile
		// 		key={index}
		// 		{...car}
		// 		user={props.user.id}
		// 		fetchCars={fetchCarsData}
		// 	/>
		// ))
	}
	return (
		<div className='car-list-container'>
			<form className='filter'>
				<div className='filter-input-container--checkbox'>
					<label htmlFor='checkbox' className="checkbox-label">Włącz filtrowanie:</label>
					<input
						type='checkbox'
						name='checkbox'
						className='filter-control--checkbox'
						onClick={e => setFilterState(e.target.checked)}
					/>
				</div>
				<div className='filter-input-container'>
					<label htmlFor='minYearOfProduction'>Rok produkcji od:</label>
					<input
						type='number'
						min={2000}
						max={2023}
						className='filter-control'
						placeholder='2015'
						id='minYearOfProduction'
						value={minYearOfProduction}
						onChange={e => setMinYearOfProduction(e.target.value)}
						required
					/>
				</div>
				<div className='filter-input-container'>
					<label htmlFor='maxYearOfProduction'>Rok produkcji do:</label>
					<input
						type='number'
						min={2000}
						max={2023}
						className='filter-control'
						placeholder='2023'
						id='maxYearOfProduction'
						value={maxYearOfProduction}
						onChange={e => setMaxYearOfProduction(e.target.value)}
						required
					/>
				</div>
				<div className='filter-input-container'>
					<label htmlFor='fuelType'>Rodzaj paliwa:</label>
					<select
						className='filter-control'
						name='fuelType'
						id='fuel-type'
						onChange={e => setFuelType(e.target.value)}>
						<option value='benzyna'>benzyna</option>
						<option value='diesel'>diesel</option>
					</select>
				</div>
				<div className='filter-input-container'>
					<label htmlFor='numberOfDoors'>Liczba drzwi:</label>
					<select
						className='filter-control'
						name='numberOfDoors'
						id='doors'
						onChange={e => setDoors(e.target.value)}>
						<option value={1}>Ilość drzwi: 1</option>
						<option value={2}>Ilość drzwi: 2</option>
						<option value={3}>Ilość drzwi: 3</option>
						<option value={4} selected='selected'>
							Ilość drzwi: 4
						</option>
						<option value={5}>Ilość drzwi: 5</option>
					</select>
				</div>
				<div className='filter-input-container'>
					<label htmlFor='minPrice'>Cena minimalna [PLN]:</label>
					<input
						type='number'
						min={200}
						max={2000}
						className='filter-control'
						placeholder='Cena od'
						id='minPrice'
						value={minPrice}
						onChange={e => setMinPrice(e.target.value)}
						required
					/>
				</div>
				<div className='filter-input-container'>
				<label htmlFor='maxPrice'>Cena maksymalna [PLN]:</label>
				<input
					type='number'
					min={200}
					max={2000}
					className='filter-control'
					placeholder='Cena do'
					id='maxPrice'
					value={maxPrice}
					onChange={e => setMaxPrice(e.target.value)}
					required
				/></div>
			</form>
			<h2 className='car-list-header'>Dostępne samochody: </h2>
			{cars ? (
				<div className='car-list'>
					{filterState ? (
						<>
							{filteredCars.map((car, index) => (
								<CarTile
									key={index}
									{...car}
									user={props.user.id}
									fetchCars={fetchCarsData}
								/>
							))}
						</>
					) : (
						<>
							{cars.map((car, index) => (
								<CarTile
									key={index}
									{...car}
									user={props.user.id}
									fetchCars={fetchCarsData}
								/>
							))}
						</>
					)}
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default CarList;
