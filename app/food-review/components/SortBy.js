"use client";
import React, { useState } from "react";

export default function SortBy({ setSortBy }) {
	return (
		<select
			onChange={(e) => setSortBy(e.target.value)}
			className=" p-2 bg-gray-800 border border-gray-700 rounded-md text-white z-10">
			<option value="created_at">Sort by Upload Date</option>
			<option value="photo_name">Sort by Name</option>
		</select>
	);
}
