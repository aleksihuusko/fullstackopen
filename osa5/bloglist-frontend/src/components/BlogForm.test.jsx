import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { vi } from "vitest";

test("BlogForm calls the event handler with right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("title:");
  const authorInput = screen.getByLabelText("author:");
  const urlInput = screen.getByLabelText("url:");
  const createButton = screen.getByText("create");

  await user.type(titleInput, "Test Blog Title");
  await user.type(authorInput, "Test Author");
  await user.type(urlInput, "http://testurl.com");
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Test Blog Title",
    author: "Test Author",
    url: "http://testurl.com",
  });
});
