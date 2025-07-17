import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  it("should return header with the name when name is provided", () => {
    const name = "hello";
    render(<Greet name={name} />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello/i);
  });
  it("should return button when name is not provided", () => {
    const name = "";
    render(<Greet name={name} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
