import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";

describe("ProductForm", () => {
  it("should render form fields", async () => {
    render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProvider });
    expect(await  screen.findByRole("textbox", { name: /name/i })).toBeInTheDocument();
  });
});
