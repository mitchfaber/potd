import React from "react";

export default function DatePicker({ setSpotDate, today }) {
	return (
		<div className="row justify-content-center">
			<input
				type="date"
				min="2022-06-13"
				className="col-6 col-sm-4 col-md-2"
				max={today}
				onInput={(e) => {
					setSpotDate(e.target.value);
				}}></input>
		</div>
	);
}
