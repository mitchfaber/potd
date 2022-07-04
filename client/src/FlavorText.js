import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function FlavorText({ pokemon, capitalize }) {
	return (
		<table className="table">
			<tbody>
				<tr>
					<th>Version</th>
					<th>Pokedex Entry</th>
				</tr>
				{pokemon.flavorTexts.map((element) => {
					return (
						<tr key={uuidv4()}>
							<td>{capitalize(element.version)}</td>
							<td>{element.text}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
