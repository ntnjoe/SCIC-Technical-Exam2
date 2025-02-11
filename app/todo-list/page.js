"use client";
import React, { useEffect, useState } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import { createClient } from "@/utils/supabase/client";

export default function TodoList() {
	const supabase = createClient();
	const [tasks, setTasks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user.id;
	};

	const editTask = async (taskId, newTitle, newPriority) => {
		const { error } = await supabase
			.from("tasks")
			.update({ title: newTitle, priority: newPriority })
			.eq("id", taskId);

		if (error) return console.log("Error updating task:", error);

		setTasks((prevTasks) =>
			prevTasks.map((task) => (task.id === taskId ? { ...task, title: newTitle, priority: newPriority } : task))
		);
	};

	const deleteTask = async (taskId) => {
		const { error } = await supabase.from("tasks").delete().eq("id", taskId);

		if (error) return console.log("Error deleting task:", error);

		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
	};

	const addTask = async (task, priority) => {
		if (!task.trim()) return;

		const userId = await fetchUser();
		const { data, error } = await supabase
			.from("tasks")
			.insert([
				{
					user_id: userId,
					title: task,
					completed: false,
					priority: priority,
				},
			])
			.select()
			.single();
		if (error) {
			console.log("Error inserting task:", error);
			return;
		}
		setTasks((prevTasks) => [...prevTasks, data]);
	};

	const fetchTasks = async () => {
		setIsLoading(true);
		const userId = await fetchUser();
		const { data, error } = await supabase
			.from("tasks")
			.select("title, id, completed, priority")
			.eq("user_id", userId);

		if (error) {
			console.log(error);
		} else {
			setTasks(data);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="w-full max-w-md p-6 bg-gray-800 rounded-2xl shadow-lg text-zinc-300">
			<h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
			<AddTask addTask={addTask} />

			<TaskList tasks={tasks} isLoading={isLoading} deleteTask={deleteTask} editTask={editTask} />

			<div className="mt-4 flex justify-between text-gray-400 text-sm">
				<span>{tasks.length} tasks remaining</span>
			</div>
		</div>
	);
}
