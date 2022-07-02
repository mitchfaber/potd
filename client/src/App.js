import { useEffect, useState } from "react";
import Pokemon from "./Pokemon";
import DatePicker from "./DatePicker";

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
		setLoading(true);
		setSpotlightDate(newDate);
		setLoading(false);
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="container mt-2">
				<DatePicker setSpotDate={setSpotDate}></DatePicker>
				<Pokemon spotlightDate={spotlightDate} today={today}></Pokemon>
			</div>
		);
	}
}

export default App;
