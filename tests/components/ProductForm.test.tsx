import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import ErrorMessage from "../../src/components/ErrorMessage";

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
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        return {
          nameInput: screen.getByPlaceholderText(/name/i),
          priceInput: screen.getByPlaceholderText(/price/i),
          categoryInput: screen.getByRole("combobox", { name: /category/i }),
          submitButton: screen.getByRole("button"),
        };
      },
    };
  };

  it("should render form", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { priceInput, nameInput, categoryInput } = await waitForFormToLoad();
    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editig a product", async () => {
    const product: Product = {
      id: 1,
      name: "book",
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad } = renderComponent(product);
    const { priceInput, nameInput, categoryInput } = await waitForFormToLoad();
    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);
  });

  it("should focus on the name input", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });

  it.each([
    {
      scenario: "missing",
      ErrorMessage: /required/i,
    },
    {
      scenario: "longer than 256 characters",
      name: "a".repeat(256),
      ErrorMessage: /255/i,
    },
  ])("should display en error is name is $missing", async ({ name, ErrorMessage }) => {
    const { waitForFormToLoad } = renderComponent();
    const { nameInput, priceInput, categoryInput, submitButton } = await waitForFormToLoad();

    const user = userEvent.setup();
    if (name != undefined) {
      await user.type(nameInput, name);
    }
    await user.type(priceInput, "10");
    await user.click(categoryInput);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(submitButton);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(ErrorMessage);
  });
});
