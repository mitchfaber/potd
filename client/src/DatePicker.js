import React, { useState, useEffect } from "react";

export default function DatePicker({ setSpotDate }) {
	const [maxDate, setMaxDate] = useState("");
	const [minDate, setMinDate] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetch(`http://localhost:8080/dateLimits/`)
			.then((res) => res.json())
			.then((result) => {
				console.log(result[0]);
				setMaxDate(formatDate(result[0].max));
				setMinDate(formatDate(result[0].min));
			});
	}, []);

	useEffect(() => {
		console.log(minDate);
		console.log(maxDate);
		setLoading(false);
	}, [minDate, maxDate]);

	function formatDate(dateToFormat) {
		let formattedDate = new Date(Date.parse(dateToFormat));
		formattedDate = new Date(formattedDate);
		let dd = String(formattedDate.getUTCDate()).padStart(2, "0");
		let mm = String(formattedDate.getUTCMonth() + 1).padStart(2, "0"); //January is 0!
		let yyyy = formattedDate.getFullYear();
		formattedDate = yyyy + "-" + mm + "-" + dd;
		return formattedDate;
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="row justify-content-center">
				<input
					type="date"
					min={minDate}
					className="col-6 col-sm-4 col-md-2"
					max={maxDate}
					onInput={(e) => {
						setSpotDate(e.target.value);
					}}></input>
			</div>
		);
	}
}
