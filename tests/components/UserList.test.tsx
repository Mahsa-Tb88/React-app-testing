import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {

  it("should return a message if user list is provided", () => {
    const users: User[] = [];
    render(<UserList users={users} />);
    expect(screen.getByText(/no user/i)).toBeInTheDocument();
  });

  it("should return a list of user if user list is provided", () => {
    const users: User[] = [
      { id: 1, name: "Mahsa" },
      { id: 2, name: "Hossein" },
    ];

    render(<UserList users={users} />);
    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});

