import React from "react";

export default function AddReviewButton({ onClick }) {
	return (
		<button
			onClick={onClick}
			className="p-2 bg-slate-200 rounded-md text-stone-900 z-10">
			Add Review
		</button>
	);
}
