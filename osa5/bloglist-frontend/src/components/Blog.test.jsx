import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Blog from "./Blog";

// Mock needs to be before any test cases
vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn().mockResolvedValue({
      id: "123",
      title: "Test Blog Title",
      author: "Test Author",
      url: "http://testurl.com",
      likes: 6,
      user: {
        id: "456",
        username: "testuser",
        name: "Test User",
      },
    }),
    remove: vi.fn(),
  },
}));

describe("<Blog />", () => {
  test("like button event handler is called twice when clicked twice", async () => {
    const blog = {
      id: "123",
      title: "Test Blog Title",
      author: "Test Author",
      url: "http://testurl.com",
      likes: 5,
      user: {
        id: "456",
        username: "testuser",
        name: "Test User",
      },
    };

    const user = {
      username: "testuser",
    };

    const mockSetBlogs = vi.fn();

    render(
      <Blog blog={blog} blogs={[blog]} setBlogs={mockSetBlogs} user={user} />
    );

    const userEventSetup = userEvent.setup();

    // First click the view button to show the like button
    const viewButton = screen.getByText("view");
    await userEventSetup.click(viewButton);

    // Then click the like button twice
    const likeButton = screen.getByText("like");
    await userEventSetup.click(likeButton);
    await userEventSetup.click(likeButton);

    // Verify that the update function was called twice
    const blogService = (await import("../services/blogs")).default;
    expect(blogService.update).toHaveBeenCalledTimes(2);
  });

  test("url, likes and user are shown when view button is clicked", async () => {
    const blog = {
      id: "123",
      title: "Test Blog Title",
      author: "Test Author",
      url: "http://testurl.com",
      likes: 5,
      user: {
        id: "456",
        username: "testuser",
        name: "Test User",
      },
    };

    const user = {
      username: "testuser",
    };

    render(<Blog blog={blog} blogs={[blog]} setBlogs={() => {}} user={user} />);

    // Initially these should not be visible
    expect(screen.queryByText("http://testurl.com")).toBeNull();
    expect(screen.queryByText("likes 5")).toBeNull();
    expect(screen.queryByText("Test User")).toBeNull();

    // Click the view button
    const user_event = userEvent.setup();
    const button = screen.getByText("view");
    await user_event.click(button);

    // After clicking, these elements should be visible
    expect(screen.getByText("http://testurl.com")).toBeDefined();
    expect(screen.getByText("likes 5")).toBeDefined();
    expect(screen.getByText("Test User")).toBeDefined();
  });

  test("renders title and author but not url or likes by default", () => {
    const blog = {
      id: "123",
      title: "Test Blog Title",
      author: "Test Author",
      url: "http://testurl.com",
      likes: 5,
      user: {
        id: "456",
        username: "testuser",
        name: "Test User",
      },
    };

    const user = {
      username: "testuser",
    };

    const { container } = render(
      <Blog blog={blog} blogs={[blog]} setBlogs={() => {}} user={user} />
    );

    // Get the div that contains the blog info
    const div = container.querySelector("div");

    // Verify title and author are rendered
    expect(div).toHaveTextContent("Test Blog Title");
    expect(div).toHaveTextContent("Test Author");

    // Verify url and likes are not rendered
    expect(screen.queryByText("http://testurl.com")).toBeNull();
    expect(screen.queryByText("likes 5")).toBeNull();
  });
});
