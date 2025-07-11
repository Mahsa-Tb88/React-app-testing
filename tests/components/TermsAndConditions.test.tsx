import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      button: screen.getByRole("button"),
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
    };
  };

  it("should return text and  unchecked and inactive btn", () => {
    const { button, heading, checkbox } = renderComponent();

    expect(heading).toHaveTextContent(/Terms & Conditions/i);

    expect(checkbox).not.toBeChecked();

    expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it("should return enable button when checkbox is checked", async () => {
    render(<TermsAndConditions />);

    const checkbox = screen.getByRole("checkbox");
    const user = userEvent.setup();
    await user.click(checkbox);

    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });
});
