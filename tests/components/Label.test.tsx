import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";

describe("group", () => {
  const renderComponent = () => {
    render(
      <LanguageProvider language="en">
        <Label labelId="Welcome" />
      </LanguageProvider>
    );
  };

  it("should render  text in  the given language", () => {
    renderComponent();
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });
});
