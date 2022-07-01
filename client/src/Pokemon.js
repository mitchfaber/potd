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
		console.log(pokemon.message);
		if (pokemon.message !== undefined) {
			return <div>No Pokemon found...</div>;
		} else {
			return (
				<div className="row justify-content-center">
					<div className="alert alert-dark col-10 col-md-6 mt-3">
						<div className="row">
							<h1>{capitalize(pokemon.name)}</h1>
						</div>
						<hr />
						<div className="row justify-content-start">
							{pokemon.types.map((element) => {
								return (
									<div className="col-4 col-sm-2 pb-2">
										<span key={uuidv4()} className={element.type.name}>
											{capitalize(element.type.name)}
										</span>
									</div>
								);
							})}
						</div>
						<div className="row justify-content-center align-items-center">
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
}
