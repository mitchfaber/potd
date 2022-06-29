import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Pokemon({ spotlightDate, today }) {
	const [pokemon, setPokemon] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(today);
		setLoading(true);
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
			<div className="container">
				<div className="row mt-3 align-items-center justify-content-center">
					<div className="alert alert-dark justify-content-center">
						<h1>{capitalize(pokemon.name)}</h1>
						<hr />
						<div className="card-text">
							{pokemon.types.map((element) => {
								return (
									<span key={uuidv4()} className={element.type.name}>
										{capitalize(element.type.name)}
									</span>
								);
							})}
						</div>
						<img
							src={`${pokemon.sprites.other["official-artwork"].front_default}`}
							className="img-fluid"
							alt={pokemon.name}></img>
					</div>
				</div>
			</div>
		);
	}
}
