import React from "react";
import "./UserProfile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Link,
	useLocation,
} from "react-router-dom";
import UserSettings from "./UserSettings/UserSettings";
import ProtectedRouteAdmin from "../ProtectedRoute/ProtectedRouteAdmin";
import ManageCars from "./ManageCars/ManageCars";

function Rental(props) {
	const { id, car, user, rentalDate, returnDate, cost } = props;
	useEffect(() => {
		props.fetchRentals();
	}, []);
	return (
		<div className='rental'>
			<div className='rental-info'>
				{props.current ? (
					<p className='rental-info--state rental-info--state-on'>Trwające</p>
				) : (
					<p className='rental-info--state rental-info--state-off'>
						Zakończone
					</p>
				)}
				<p className='rental-info--rentalID'>Nr zamówienia: {id}</p>
				<p className='rental-info--price'>Cena łączna: {cost} PLN</p>
				<p className='rental-info--date'>Data wypożyczenia: {rentalDate}</p>
				<p className='rental-info--date'>Data zwrotu: {returnDate}</p>
			</div>
			<div className='rental-details'>
				<img className='rental-details--img' src={car.photo} />
				<div className='rental-details--info'>
					<strong>
						{car.brand} {car.model}
					</strong>
					<p>Rok produkcji: {car.yearOfProduction}</p>
					<p>Rodzaj paliwa: {car.fuelType}</p>
					<p>Pojemność silnika: {car.engineCapacity}</p>
					<p>Liczba drzwi: {car.numberOfDoors}</p>
				</div>
			</div>
		</div>
	);
}

function UserProfile(props) {
	const [rentals, setRentals] = useState();
	const location = useLocation().pathname;
	async function fetchRentalsData() {
		try {
			const res = await axios.get(
				`https://grzegorz2115.alwaysdata.net/api/rentals/user/${props.user.id}`
			);
			setRentals(res.data);
		} catch (err) {}
	}

	useEffect(() => {
		fetchRentalsData();
	}, []);

	return (
		<div className='user-container'>
			<div className='user-profile'>
				<div className='user-profile--dashboard'>
					<h2 className='header'>Cześć, {props.user.firstName}!</h2>
					{props.user.admin ? (
						<div>
							<Link
								to='rentals'
								className={
									location === "/user/rentals"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Aktualne wypożyczenia
							</Link>
							<Link
								to='history'
								className={
									location === "/user/history"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Historia wypożyczeń
							</Link>
							<Link
								to='manage'
								className={
									location === "/user/manage"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Zarządzanie samochodami
							</Link>
							<Link
								to='settings'
								className={
									location === "/user/settings"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Ustawienia konta
							</Link>
						</div>
					) : (
						<div>
							<Link
								to='rentals'
								className={
									location === "/user/rentals"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Aktualne wypożyczenia
							</Link>
							<Link
								to='history'
								className={
									location === "/user/history"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Historia wypożyczeń
							</Link>
							<Link
								to='settings'
								className={
									location === "/user/settings"
										? "btn btn-dashboard btn-white "
										: "btn btn-dashboard btn-blue"
								}>
								Ustawienia konta
							</Link>
						</div>
					)}
				</div>
				<Routes>
					<Route
						path='rentals'
						element={
							<div className='user-profile--main'>
								<h2 className='header'>Twoje wypożyczenia:</h2>
								<div className='rentals'>
									{rentals ? (
										<>
											{rentals.map(function(rental, index) {
												const date = new Date().getTime();
												const returnDate = new Date(rental.returnDate);
												if (returnDate.getTime() + 86400000 > date && !rental.car.availability) {
													return (
														<Rental
															key={index}
															{...rental}
															fetchRentals={fetchRentalsData}
															current={true}
														/>
													);
												}
											})}
										</>
									) : null}
								</div>
							</div>
						}
					/>
					<Route
						path='history'
						element={
							<div className='user-profile--main'>
								<h2 className='header'>Historia wypożyczeń:</h2>
								<div className='rentals'>
									{rentals ? (
										<>
											{rentals.map(function(rental, index) {
												const date = new Date().getTime();
												const returnDate = new Date(rental.returnDate);
												if (
													returnDate.getTime() + 86400000 > date &&
													!rental.car.availability
												) {
													return (
														<Rental
															key={index}
															{...rental}
															fetchRentals={fetchRentalsData}
															current={true}
														/>
													);
												} else {
													return (
														<Rental
															key={index}
															{...rental}
															fetchRentals={fetchRentalsData}
															current={false}
														/>
													);
												}
											})}
										</>
									) : null}
								</div>
							</div>
						}
					/>
					<Route
						path='settings'
						element={
							<div className='user-profile--main'>
								<h2 className='header'>Ustawienia konta:</h2>
								<UserSettings {...props.user} />
							</div>
						}
					/>

					<Route
						path='manage'
						element={
							<ProtectedRouteAdmin user={props.user} redirectPath='/'>
								<div className='user-profile--main'>
									<h2 className='header'>Zarządzanie samochodami:</h2>
									<ManageCars />
								</div>
							</ProtectedRouteAdmin>
						}
					/>
				</Routes>
			</div>
		</div>
	);
}

export default UserProfile;
