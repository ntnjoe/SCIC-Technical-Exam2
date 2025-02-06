import React, { useEffect, useState } from "react";
import useFetchUserClient from "../useFetchUserClient";
import { createClient } from "@/utils/supabase/client";
import useStorage from "@/hooks/useStorage";

export default function useReviews() {
	const { uploadPhoto, deletePhoto } = useStorage();
	const supabase = createClient();
	const [reviews, setReviews] = useState([]);
	const [sortBy, setSortBy] = useState("created_at");
	const { user } = useFetchUserClient();
	const [loading, setLoading] = useState(true);

	const updateReview = async (reviewId, newImage, newReviewText) => {
		let photoPath;
		let publicUrl;
		if (newImage) {
			({ photoPath, publicUrl, photoName } = await uploadPhoto("food-reviews", newImage, user.id));
		}
		const { error } = await supabase
			.from("reviews")
			.update({
				review_text: newReviewText,
				photo_url: publicUrl,
				photo_path: photoPath,
				photo_name: photoName,
			})
			.eq("id", reviewId);
		if (error) {
			console.error("Error updating review:", error);
		}
		setReviews((prevReviews) =>
			prevReviews.map((review) =>
				review.id === reviewId
					? {
							...review,
							review_text: newReviewText || review.review_text,
							photo_url: publicUrl || review.photo_url,
							photo_path: photoPath || review.photo_path,
							photo_name: photoName || review.photo_path,
					  }
					: review
			)
		);
	};

	const fetchReviews = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("reviews").select(`
			id,
			review_text, 
			photo_url,
			photo_path,
			photo_name, 
			user_id,
			created_at,
			profiles(first_name, last_name, username)
		`);

		if (error) {
			console.error("Error fetching reviews:", error);
			return;
		}
		sortReviews(data);
		setLoading(false);
	};

	const sortReviews = (data) => {
		if (!data) return;

		let sorted = [...data];

		if (sortBy === "photo_name") {
			sorted.sort((a, b) => {
				return a.photo_name.localeCompare(b.photo_name);
			});
		} else if (sortBy === "created_at") {
			sorted.sort((a, b) => {
				return new Date(b.created_at) - new Date(a.created_at);
			});
		}

		setReviews(sorted);
	};

	const addReview = async (reviewText, reviewPhoto) => {
		if (!reviewPhoto) return;

		const result = await uploadPhoto("food-reviews", reviewPhoto, user.id);

		const { data: insertedData, error: insertError } = await supabase.from("reviews").insert([
			{
				user_id: user.id,
				photo_url: result.publicUrl,
				review_text: reviewText,
				photo_path: result.photoPath,
				photo_name: result.photoName,
			},
		]).select(`
			id,
			review_text, 
			photo_url,
			photo_path,
			photo_name, 
			user_id,
			created_at,
			profiles(first_name, last_name, username)
		`);

		if (insertError) {
			console.error("Error inserting review:", insertError);
			return;
		}

		alert("Review submitted");

		setReviews((prevState) => [insertedData[0], ...prevState]);
	};

	const deleteReview = async (reviewId, photoPath) => {
		const { error: delReview } = await supabase.from("reviews").delete().eq("id", reviewId);

		if (delReview) {
			console.error("Error deleting the review:", delReview);
			return;
		}

		await deletePhoto("food-reviews", photoPath);

		setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
	};

	useEffect(() => {
		fetchReviews();
	}, []);
	useEffect(() => {
		sortReviews([...reviews]);
	}, [sortBy]);

	return {
		reviews,
		loading,
		sortBy,
		addReview,
		deleteReview,
		fetchReviews,
		updateReview,
		sortReviews,
		setSortBy,
	};
}
