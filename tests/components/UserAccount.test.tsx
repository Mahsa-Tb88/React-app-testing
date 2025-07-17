import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("User account", () => {
  it("should return hedaer", () => {
    const user: User = { id: 1, name: "Mahsa" };

    render(<UserAccount user={user} />);
    const header = screen.getByRole("heading");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/user profile/i);
  });

  it("should render and return username", () => {
    const user: User = { id: 1, name: "Mahsa" };

    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render and return edit button wehn user is admin", () => {
    const user: User = { id: 1, name: "Mahsa", isAdmin: true };
    render(<UserAccount user={user} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should render and not return button when  user is not admin", () => {
    const user: User = { id: 1, name: "Mahsa" };
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
