"use client";
import React, { useState } from "react";

export default function Modal({ onClose, addReview }) {
	const [reviewText, setReviewText] = useState("");
	const [photo, setPhoto] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleReviewChange = (e) => setReviewText(e.target.value);
	const handleFileChange = (e) => setPhoto(e.target.files[0]);

	const handlePostReview = async () => {
		setLoading(true);
		await addReview(reviewText, photo);
		onClose();
		setLoading(false);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-900 text-white p-6 rounded-lg ">
				<h2 className="text-xl font-semibold mb-4">
					Food Review
				</h2>

				<textarea
					type="text"
					rows={5}
					value={reviewText}
					onChange={handleReviewChange}
					className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 resize-none"
					placeholder="Enter your review..."
				/>

				<input
					type="file"
					onChange={handleFileChange}
					className="w-full mb-4 p-3 bg-gray-800 text-white rounded-lg"
				/>

				<button
					onClick={handlePostReview}
					disabled={loading}
					className="w-full bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-slate-800 text-center">
					<span className="block">
						{loading ? "Uploading..." : "Upload"}{" "}
					</span>
				</button>

				<button
					onClick={onClose}
					className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg">
					Close
				</button>
			</div>
		</div>
	);
}
