import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";


describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const truncatedText = longText.substring(0, 255) + "...";

  it("should return full text when text is shorter than limit", () => {
    const text = "short text";
    render(<ExpandableText text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("should return truncated text when text is more than limit", () => {
    render(<ExpandableText text={longText} />);
    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });

  it("should return full text when text is more than limit and click on more", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });
});
