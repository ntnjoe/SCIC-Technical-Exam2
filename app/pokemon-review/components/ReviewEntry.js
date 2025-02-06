import React from "react";
import useFetchUserClient from "@/hooks/useFetchUserClient";

export default function ReviewEntry({ pokemon, setSelectedPokemon }) {
	const { user } = useFetchUserClient();

	return (
		<div
			key={pokemon.pokemon_id}
			className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-2 hover:bg-gray-700"
			onClick={() => setSelectedPokemon(pokemon.pokemon_name)}>
			<div className="  w-full flex justify-between items-center">
				<h3 className="text-base font-semibold uppercase">{pokemon.pokemon_name}</h3>
				<span className="text-sm font-normal text-green-400 p-1 rounded">
					{pokemon.reviews.find((review) => review.user_id === user.id) ? "REVIEWED" : ""}
				</span>
			</div>

			<img
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`}
				alt={pokemon.pokemon_name}
				className="w-30 h-30 object-contain "
			/>

			<div className=" text-xs text-gray-500 flex justify-between  w-full">
				<span>{pokemon.reviews.length} reviews</span>
				<span>
					{new Date(pokemon.pokemon_updated_at)
						.toLocaleString("en-US", {
							month: "short",
							day: "numeric",

							hour: "numeric",
							minute: "2-digit",
							hour12: false,
						})
						.replace(",", " ")
						.replace(" ", "/")}
				</span>
			</div>
		</div>
	);
}
