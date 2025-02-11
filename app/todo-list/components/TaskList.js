import React, { useState } from "react";

export default function TaskList({ tasks, isLoading, deleteTask, editTask }) {
	const [editingTask, setEditingTask] = useState(null);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedPriority, setEditedPriority] = useState("");

	const handleEditClick = (task) => {
		setEditingTask(task);
		setEditedTitle(task.title);
		setEditedPriority(task.priority);
	};

	const handleSaveClick = async (taskId) => {
		await editTask(taskId, editedTitle, editedPriority);
		setEditingTask(null);
		setEditedTitle("");
		setEditedPriority("");
	};

	const handleCancelClick = () => {
		setEditingTask(null);
		setEditedTitle("");
		setEditedPriority("");
	};

	if (isLoading) {
		return <h1>Loading...</h1>;
	}

	return (
		<ul className="space-y-3">
			{tasks.map((task, index) => (
				<li key={task.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
					<div className="flex items-center gap-2">
						{editingTask?.id === task.id ? (
							<div className="flex flex-row">
								<input
									type="text"
									value={editedTitle}
									onChange={(e) => setEditedTitle(e.target.value)}
									className="text-lg bg-transparent border-b border-gray-500 focus:outline-none w-1/2"
								/>
								<select
									name="editPriority"
									id="editPriority"
									className="px-2 rounded-md text-gray-800"
									onChange={(e) => setEditedPriority(e.target.value)}
									value={editedPriority}>
									<option value="low">LOW</option>
									<option value="medium">MEDIUM</option>
									<option value="high">HIGH</option>
								</select>
							</div>
						) : (
							<div className="flex gap-4 items-center">
								<span className="text-sm">{task.priority}</span>
								<span className="text-lg">{task.title}</span>
							</div>
						)}
					</div>
					<div className="flex gap-2">
						{editingTask?.id === task.id ? (
							<>
								<button
									className="text-green-500 hover:text-green-400"
									onClick={() => handleSaveClick(task.id)}>
									Save
								</button>
								<button className="text-gray-500 hover:text-gray-400" onClick={handleCancelClick}>
									Cancel
								</button>
							</>
						) : (
							<button
								className="text-yellow-500 hover:text-yellow-400"
								onClick={() => handleEditClick(task)}>
								✏️
							</button>
						)}
						<button
							data-testid={`delete-button-${task.id}`}
							className="text-red-500 hover:text-red-400"
							onClick={() => deleteTask(task.id)}>
							✖
						</button>
					</div>
				</li>
			))}
		</ul>
	);
}
