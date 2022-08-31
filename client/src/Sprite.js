import React from "react";

export default function Sprite({ spriteSrc, pokeName }) {
	return <img src={`${spriteSrc}`} className="img-fluid" alt={pokeName}></img>;
}
