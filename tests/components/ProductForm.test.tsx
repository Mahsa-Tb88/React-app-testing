import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { products } from "../mocks/data";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
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
      getInput: () => {
        return {
          nameInput: screen.findByPlaceholderText(/name/i),
          priceInput: screen.findByPlaceholderText(/price/i),
          categoryInput: screen.findByRole("combobox", { name: /category/i }),
          submitButton: screen.findByRole("button"),
        };
      },
    };
  };

  it("should render form fields", async () => {
    const { waitForFormToLoad, getInput } = renderComponent();
    // await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));
    const { nameInput, priceInput, categoryInput } = getInput();
    await waitForFormToLoad();
    expect(await nameInput).toBeInTheDocument();
    expect(await priceInput).toBeInTheDocument();
    expect(await categoryInput).toBeInTheDocument();
  });

  it("should populate form fields when editting a product", async () => {
    const product: Product = {
      id: 1,
      name: "Bread",
      price: 10,
      categoryId: category.id,
    };
    const { waitForFormToLoad, getInput } = renderComponent(product);
    await waitForFormToLoad();
    const { nameInput, priceInput, categoryInput } = getInput();

    // await screen.findByRole("form");
    // await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    expect(await nameInput).toHaveValue(product.name);
    expect(await priceInput).toHaveValue(product.price.toString());
    expect(await categoryInput).toHaveTextContent(category.name);
  });

  it("should focus on the name field", async () => {
    const { waitForFormToLoad, getInput } = renderComponent();
    await waitForFormToLoad();
    const { nameInput } = getInput();
    expect(await nameInput).toHaveFocus();
  });

  it("should render error if name is missing", async () => {
    const { waitForFormToLoad, getInput } = renderComponent();
    await waitForFormToLoad();
    const { priceInput, categoryInput, submitButton } = getInput();

    const user = userEvent.setup();
    await user.type(await priceInput, "10");
    await user.click(await categoryInput);

    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    await user.click(await submitButton);

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(/required/i);
  });
});
