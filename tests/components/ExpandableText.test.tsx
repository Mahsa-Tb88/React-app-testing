import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("Expandable text", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const shortText = longText.substring(0, limit) + "...";

  it("should return text if length is less than limit", () => {
    const text = "short text";

    render(<ExpandableText text={text} />);
    const texting = screen.getByText(text);
    expect(texting).toBeInTheDocument();
  });

  it("should return short text if length is more than limit", () => {
    render(<ExpandableText text={longText} />);

    const texting = screen.getByText(shortText);
    expect(texting).toBeInTheDocument();

    const button = screen.getByRole("button");
    // expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/ more/i);
  });

  it("should return whole text if show more is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    const texting = screen.getByText(longText);
    expect(texting).toBeInTheDocument();

    expect(button).toHaveTextContent(/show less/i);
  });

  it("should return truncated text if show less is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const user = userEvent.setup();
    // const button = screen.getByRole("button");
    // await user.click(button);

    const showMoreButton = screen.getByRole("button", { name: /more/i });
    await user.click(showMoreButton);

    // await user.click(button);
    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    const texting = screen.getByText(shortText);
    expect(texting).toBeInTheDocument();
    expect(showLessButton).toHaveTextContent(/ more/i);
  });
});

