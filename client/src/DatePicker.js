import React, { useState, useEffect } from "react";

export default function DatePicker({ setSpotDate }) {
	const [maxDate, setMaxDate] = useState();
	const [minDate, setMinDate] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetch(`http://localhost:8080/dateLimits/`)
			.then((res) => res.json())
			.then((result) => {
				setMaxDate(result[0].max);
				setMinDate(result[0].min);
			});
	}, []);

	useEffect(() => {
		setLoading(false);
	}, [minDate, maxDate]);

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
