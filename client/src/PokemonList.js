import React, { useState, useEffect } from "react";

export default function PokemonList({ setSpotDate, today }) {
	const [curPokemon, setCurPokemon] = useState();
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	setSpotDate(today);
	// }, []);
	return (
		<div>
			<input
				type="date"
				min="2022-06-13"
				max={today}
				onInput={(e) => {
					setSpotDate(e.target.value);
				}}></input>
		</div>
	);
}
