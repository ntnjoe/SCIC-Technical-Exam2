import React, { useState } from "react";

export default function AddTask({ addTask }) {
	const [task, setTask] = useState("");
	const [priority, setPriority] = useState("low");
	return (
		<div className="flex gap-2 mb-4">
			<input
				type="text"
				placeholder="Add a new task..."
				className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={task}
				onChange={(e) => setTask(e.target.value)}
			/>
			<select
				name="priority"
				id="priority"
				onChange={(e) => setPriority(e.target.value)}
				value={priority}
				className="px-2 rounded-md text-gray-800">
				<option value="low">LOW</option>
				<option value="medium">MEDIUM</option>
				<option value="high">HIGH</option>
			</select>
			<button
				data-testid="add-task-button"
				onClick={() => {
					addTask(task, priority);
					setTask("");
				}}
				className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg">
				Add
			</button>
		</div>
	);
}
