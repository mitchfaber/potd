import React, { useState, useEffect } from "react";

export default function Pokemon({ spotlightDate, today }) {
	const [pokemon, setPokemon] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(today);
		if (spotlightDate === today) {
			fetch(`http://localhost:8080/spotlight/`)
				.then((res) => res.json())
				.then((result) => {
					console.log(result);
					setPokemon(result);
					setLoading(false);
				});
		} else {
			fetch(`http://localhost:8080/spotlight/${spotlightDate}`)
				.then((res) => res.json())
				.then((result) => {
					console.log(result);
					setPokemon(result);
					setLoading(false);
				});
		}
	}, [spotlightDate]);

	function capitalize(inputToCap) {
		return inputToCap.charAt(0).toUpperCase() + inputToCap.slice(1);
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div>
				{capitalize(pokemon.name)}
				{pokemon.types.map((element) => {
					return <div className={element.type.name}>{capitalize(element.type.name)}</div>;
				})}
				<img src={`${pokemon.sprites.front_default}`} alt={pokemon.name}></img>
			</div>
		);
	}
}
