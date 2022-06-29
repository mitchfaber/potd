import { useEffect, useState } from "react";
import Pokemon from "./Pokemon";
import PokemonList from "./DatePicker";

function App() {
	const [loading, setLoading] = useState(true);
	const [spotlightDate, setSpotlightDate] = useState();

	let today = new Date();
	let dd = String(today.getDate()).padStart(2, "0");
	let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	let yyyy = today.getFullYear();
	today = yyyy + "-" + mm + "-" + dd;

	useEffect(() => {
		setSpotlightDate(today);
		setLoading(false);
	}, []);

	function setSpotDate(newDate) {
		console.log(newDate);
		setLoading(true);
		setSpotlightDate(newDate);
		setLoading(false);
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="container">
				<Pokemon spotlightDate={spotlightDate} today={today}></Pokemon>
				<PokemonList setSpotDate={setSpotDate} today={today}></PokemonList>
			</div>
		);
	}
}

export default App;
