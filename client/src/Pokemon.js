import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import FlavorText from "./FlavorText";

export default function Pokemon({ spotlightDate, today }) {
	const [pokemon, setPokemon] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetch(`http://localhost:8080/spotlight/${spotlightDate}`)
			.then((res) => res.json())
			.then((result) => {
				setPokemon(result);
				setLoading(false);
			});
	}, [spotlightDate]);

	function capitalize(inputToCap) {
		return inputToCap.charAt(0).toUpperCase() + inputToCap.slice(1);
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		if (pokemon.message !== undefined) {
			return <div>No Pokemon found...</div>;
		} else {
			return (
				<div className="row justify-content-center">
					<div className="alert alert-dark col-10 col-md-6 mt-3">
						<div className="row">
							<h2>{capitalize(pokemon.general.name)}</h2>
						</div>
						<hr />
						<div className="row justify-content-start">
							{pokemon.general.types.map((element) => {
								return (
									<div key={uuidv4()} className="col-4 col-sm-2 pb-2">
										<span className={element.type.name}>{capitalize(element.type.name)}</span>
									</div>
								);
							})}
						</div>
						<div className="row justify-content-center align-items-center">
							<img
								src={`${pokemon.general.sprites.other["official-artwork"].front_default}`}
								className="img-fluid"
								alt={pokemon.general.name}></img>
						</div>
						<hr />
						<div className="row justify-content-start">
							<FlavorText pokemon={pokemon} capitalize={capitalize} />
						</div>
					</div>
				</div>
			);
		}
	}
}
