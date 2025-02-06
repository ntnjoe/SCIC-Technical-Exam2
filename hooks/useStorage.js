import React from "react";
import { createClient } from "@/utils/supabase/client";

export default function useStorage() {
	const supabase = createClient();

	const uploadPhoto = async (bucket, photo, userId) => {
		const fileExtension = photo.name.split(".").pop();
		const photoName = `${photo.name.split(".").slice(0, -1).join(".")}_${Date.now()}.${fileExtension}`;

		const photoPath = `${userId}/${photoName}`;
		const { data: uploadedPhoto, error: uploadError } = await supabase.storage
			.from(bucket)
			.upload(photoPath, photo);
		if (uploadError) {
			console.error("Error uploading photo:", uploadError);
			return;
		}

		const { data: urlData, error: urlError } = supabase.storage.from(bucket).getPublicUrl(uploadedPhoto.path);
		if (urlError) {
			console.error("Error getting Url Data:", urlError);
		}
		return {
			photoPath: uploadedPhoto.path,
			publicUrl: urlData.publicUrl,
			photoName,
		};
	};

	const deletePhoto = async (bucket, path) => {
		const { error } = await supabase.storage.from(bucket).remove([path]);
		if (error) {
			console.error("Error deleting image", error);
		}
	};

	return { uploadPhoto, deletePhoto };
}
