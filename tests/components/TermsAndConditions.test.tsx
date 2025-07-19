import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("Terms and Conditions", () => {
  const renderComponent = () => {
    render(<TermsAndConditions />);
    return {
      button: screen.getByRole("button"),
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
    };
  };
  it("should return text and  unchecked and inactive btn", () => {
    const { heading, button, checkbox } = renderComponent();

    expect(heading).toBeInTheDocument();

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    expect(button).toBeInTheDocument();
    expect(button).not.toBeEnabled();
  });

  it("should return enable button when checkbox is checked", async () => {
    const { button, checkbox } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(button).toBeEnabled();
  });
});
