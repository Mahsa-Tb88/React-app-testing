import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
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
    const onSubmit = vi.fn();
    render(<ProductForm product={product} onSubmit={onSubmit} />, { wrapper: AllProvider });
    const nameInput = screen.findByPlaceholderText(/name/i);
    const priceInput = screen.findByPlaceholderText(/price/i);
    const categoryInput = screen.findByRole("combobox", { name: /category/i });
    const submitButton = screen.findByRole("button");
    type FormData = {
      [K in keyof Product]: any;
    };
    const validData: FormData = {
      id: 1,
      name: "a",
      price: 1,
      categoryId: 1,
    };

    const fillForm = async (product: FormData) => {
      const user = userEvent.setup();

      if (product.name !== undefined) {
        await user.type(await nameInput, product.name);
      }

      if (product.price !== undefined) {
        await user.type(await priceInput, product.price.toString());
      }

      await user.click(await categoryInput);

      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      await user.click(await submitButton);
    };
    return {
      waitForFormToLoad: () => screen.findByRole("form"),
      fillForm,
      onSubmit,
      validData,
      getInput: () => {
        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
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

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "longer than 255",
      name: "a".repeat(256),
      errorMessage: /255/,
    },
  ])("should render error if name is $scenario ", async ({ name, errorMessage }) => {
    const { waitForFormToLoad, fillForm, validData } = renderComponent();
    await waitForFormToLoad();

    await fillForm({ ...validData, name });

    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
  });

  it.each([
    {
      scenario: "missing",
      errorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      errorMessage: /1/,
    },
    {
      scenario: "negative",
      price: -1,
      errorMessage: /1/,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      errorMessage: /1000/,
    },
    {
      scenario: " not a number",
      price: "a",
      errorMessage: /required/i,
    },
  ])("should render error if price is $scenario ", async ({ price, errorMessage }) => {
    const { waitForFormToLoad, fillForm, validData } = renderComponent();

    await waitForFormToLoad();
    await fillForm({ ...validData, price });
    const error = screen.getByRole("alert");
    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(errorMessage);
  });

  it("should call onSubmit with the correct data", async () => {
    // const { waitForFormToLoad, onSubmit } = renderComponent();
    // const form = await waitForFormToLoad();
    // await form.fill(form.validData);
    // expect(onSubmit).toHaveBeenCalledWith(form.validData);
  });
});
