import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MarkdownNotes from "@/app/markdown-note/page";
import { useUser } from "@/hooks/useUser"; // Mock this hook
import useMarkdown from "@/hooks/markdown-note/useMarkdown"; // Mock this hook

jest.mock("@/hooks/useUser");
jest.mock("@/hooks/markdown-note/useMarkdown");

describe("MarkdownNotes", () => {
	beforeEach(() => {
		useUser.mockReturnValue({
			user: { id: "1" },
		});

		useMarkdown.mockReturnValue({
			notes: [
				{ id: "1", content: "First note" },
				{ id: "2", content: "Second note" },
			],
			content: "",
			addNote: jest.fn(),
			deleteNote: jest.fn(),
			setContent: jest.fn(),
			setSelectedNote: jest.fn(),
		});
	});

	it("renders the component", () => {
		render(<MarkdownNotes />);

		expect(screen.getByText(/Notes/i)).toBeInTheDocument();

		expect(screen.getByText(/First note/i)).toBeInTheDocument();
		expect(screen.getByText(/Second note/i)).toBeInTheDocument();
	});

	it("handles adding a note", async () => {
		render(<MarkdownNotes />);

		fireEvent.change(screen.getByPlaceholderText(/Write in Markdown/i), {
			target: { value: "New note content" },
		});

		fireEvent.click(screen.getByText(/Save Note/i));

		await waitFor(() => expect(useMarkdown().addNote).toHaveBeenCalled());
	});

	it("handles delete note", async () => {
		render(<MarkdownNotes />);

		fireEvent.click(screen.getAllByRole("button")[1]);

		await waitFor(() => expect(useMarkdown().deleteNote).toHaveBeenCalledWith("1"));
	});
});
