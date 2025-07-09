import { render, screen } from "@testing-library/react";
import { User } from "../../src/entities";
import UserAccount from "../../src/components/UserAccount";

describe("i", () => {
  it("should render and return username", () => {
    const user: User = { id: 1, name: "Mahsa88" };
    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render and return edit button wehn user is admin", () => {
    const user: User = { id: 1, name: "Mahsa88", isAdmin: true };
    render(<UserAccount user={user} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should render and not return button when  user is not admin", () => {
    const user: User = { id: 1, name: "Mahsa88" };
    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
