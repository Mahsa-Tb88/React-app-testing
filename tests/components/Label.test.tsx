import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";

describe("Label", () => {
  it.each([
    { labelId: "welcome", text: "Welcome" },
    { labelId: "new_product", text: "New Product" },
    { labelId: "edit_product", text: "Edit Product" },
  ])("should render ${text} for labelId", ({ labelId, text }) => {
    render(
      <LanguageProvider language="en">
        <Label labelId={labelId} />
      </LanguageProvider>
    );
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
