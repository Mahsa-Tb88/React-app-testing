import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProvider from "../AllProvider";
import { Category, Product } from "../../src/entities";
import { db } from "../mocks/db";
import userEvent from "@testing-library/user-event";
import ErrorMessage from "../../src/components/ErrorMessage";
import { Toaster } from "react-hot-toast";

describe("productFrom", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderComponent = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      { wrapper: AllProvider }
    );

    type FormData = {
      [k in keyof Product]: any;
    };

    const validData: FormData = {
      id: 1,
      name: "a",
      price: 1,
      categoryId: category.id,
    };

    return {
      waitForFormToLoad: async () => {
        await screen.findByRole("form");
        const nameInput = screen.getByPlaceholderText(/name/i);
        const priceInput = screen.getByPlaceholderText(/price/i);
        const categoryInput = screen.getByRole("combobox", { name: /category/i });
        const submitButton = screen.getByRole("button");
        const fill = async (product: FormData) => {
          const user = userEvent.setup();
          if (product.name != undefined) {
            await user.type(nameInput, product.name);
          }
          if (product.price != undefined) {
            await user.type(priceInput, product.price.toString());
          }
          await user.click(categoryInput);
          const options = screen.getAllByRole("option");
          await user.click(options[0]);
          await user.click(submitButton);
        };
        return {
          nameInput,
          priceInput,
          categoryInput,
          submitButton,
          fill,
          validData,
          onSubmit,
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
    const { fill, validData } = await waitForFormToLoad();
    await fill({ ...validData, name });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(ErrorMessage);
  });

  it.each([
    {
      scenario: "missing",
      ErrorMessage: /required/i,
    },
    {
      scenario: "0",
      price: 0,
      ErrorMessage: /1/i,
    },
    {
      scenario: "negative",
      price: -1,
      ErrorMessage: /1/i,
    },
    {
      scenario: "greater than 1000",
      price: 1001,
      ErrorMessage: /1000/i,
    },
    {
      scenario: "not a number",
      price: "a",
      ErrorMessage: /required/i,
    },
  ])("should display an error if price is $scenario", async ({ price, ErrorMessage }) => {
    const { waitForFormToLoad } = renderComponent();
    const { fill, validData } = await waitForFormToLoad();
    await fill({ ...validData, price });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(ErrorMessage);
  });

  it("should call onSubmit  with the correct data", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { onSubmit, fill, validData } = await waitForFormToLoad();
    await fill(validData);
    const { id, ...formData } = validData;
    expect(onSubmit).toHaveBeenCalledWith(formData);
  });

  it("should display a toast if submission fails", async () => {
    const { waitForFormToLoad } = renderComponent();
    const { onSubmit, fill, validData } = await waitForFormToLoad();
    onSubmit.mockRejectedValue({});

    await fill(validData);

    const toast = await screen.findByRole("status");
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent(/error/i);
  }); 
});
