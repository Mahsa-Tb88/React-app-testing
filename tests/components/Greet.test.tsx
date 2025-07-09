import Greet from "../../src/components/Greet";
import { render, screen } from "@testing-library/react";

describe("Greet", () => {
  it("should render hello with the name when name is provided", () => {
    render(<Greet name={"Mahsa"} />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello/i);
  });
  it("should return button login if name is not with that ", () => {
    render(<Greet />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  });
});
