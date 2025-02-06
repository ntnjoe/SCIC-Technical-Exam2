import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "../useUser";

export default function useMarkdown() {
	const [notes, setNotes] = useState([]);
	const [selectedNote, setSelectedNote] = useState(null);
	const [content, setContent] = useState("");
	const supabase = createClient();
	const { user } = useUser();

	const fetchNotes = async () => {
		const { data, error } = await supabase.from("notes").select().eq("user_id", user.id);
		if (error) return console.error("Error fetching notes", error);
		setNotes(data);
	};

	const addNote = async () => {
		if (selectedNote) return updateNote();
		const { error } = await supabase.from("notes").insert({ content, user_id: user.id });
		if (error) return console.error("Error adding note", error);
		setContent("");
		await fetchNotes();
	};

	const updateNote = async () => {
		const { error } = await supabase.from("notes").update({ content }).eq("id", selectedNote.id);
		if (error) return console.error("Error updating note", error);
		setContent("");
		setSelectedNote(null);
		await fetchNotes();
	};

	const deleteNote = async (id) => {
		const { error } = await supabase.from("notes").delete().eq("id", id);
		if (error) return console.error("Error deleting note", error);
		fetchNotes();
	};

	useEffect(() => {
		if (user) fetchNotes();
	}, [user]);

	return { notes, fetchNotes, selectedNote, setSelectedNote, addNote, deleteNote, content, setContent };
}
