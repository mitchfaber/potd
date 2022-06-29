import React, { useState, useEffect } from "react";

export default function DatePicker({ setSpotDate, today, loading }) {
	return (
		<div>
			<input
				type="date"
				min="2022-06-13"
				max={today}
				disabled={loading}
				onInput={(e) => {
					setSpotDate(e.target.value);
				}}></input>
		</div>
	);
}
