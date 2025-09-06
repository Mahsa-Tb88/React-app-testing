import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";

describe("Label", () => {
  describe("give the current lamguage is En", () => {
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

  describe("give the current lamguage is ES", () => {
    it.each([
      { labelId: "welcome", text: "Bienvenidos" },
      { labelId: "new_product", text: "Nuevo Producto" },
      { labelId: "edit_product", text: "Editar Producto" },
    ])("should render ${text} for labelId", ({ labelId, text }) => {
      render(
        <LanguageProvider language="es">
          <Label labelId={labelId} />
        </LanguageProvider>
      );
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });
});
