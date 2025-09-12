import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";

describe("productFrom", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    render(<ProductForm product={product} onSubmit={vi.fn()} />, { wrapper: AllProvider });

    return {
      waitForFormToLoad: () => screen.findByRole("form"),
    };
  };

  it("should render form", async () => {
    const { waitForFormToLoad } = renderComponent();

    await waitForFormToLoad();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /category/i })).toBeInTheDocument();
  });

  it("should populate form fields when editig a product", async () => {
    const product: Product = {
      id: 1,
      name: "book",
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad } = renderComponent(product);
    await waitForFormToLoad();
    expect(screen.getByPlaceholderText(/name/i)).toHaveValue(product.name);
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(product.price.toString());
    expect(screen.getByRole("combobox", { name: /category/i })).toHaveTextContent(category.name);
  });
});
