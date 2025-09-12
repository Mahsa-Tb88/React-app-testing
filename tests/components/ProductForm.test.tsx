import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";

describe("productFrom", () => {
  it("should render form", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProvider });

    await screen.findByRole("form");
    expect(screen.getByPlaceholderText(/name/i));
    expect(screen.getByPlaceholderText(/price/i));
    expect(screen.getByRole("combobox", { name: /category/i })).toBeInTheDocument();
  });
});
