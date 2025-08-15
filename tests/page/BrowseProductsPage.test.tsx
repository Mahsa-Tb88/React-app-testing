import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";

import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );
    return {
      getProductsSkeleton: () => screen.queryByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: screen.queryByRole("progressbar", { name: /categories/i }),
    };
  };

  it("should show loading skeleton when fetching categories", () => {
    simulateDelay("/categories");
    const { getCategoriesSkeleton } = renderComponent();

    expect(getCategoriesSkeleton).toBeInTheDocument();
  });

  it("should hide loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should show loading skeleton when fetching products", () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should hide loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories is not fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: /category/i })).not.toBeInTheDocument();
  });

  it("should render an error if products can no be fetched", async () => {
    simulateError("/products");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    renderComponent();
    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();

    categories.forEach((c) => {
      expect(screen.getByRole("option", { name: c.name })).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    // products.forEach((product) => {
    //   expect(screen.getByText(product.name)).toBeInTheDocument();
    // });

    // or , if you want to use findby text

    for (const product of products) {
      expect(await screen.findByText(product.name)).toBeInTheDocument();
    }
  });

  it("should filter product  by category", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    //Arrange
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(combobox);

    //Act
    const selectedCategory = categories[0];
    const option = screen.getByRole("option", { name: selectedCategory.name });
    await user.click(option);

    //Assert
    const products = db.product.findMany({
      where: {
        categoryId: { equals: selectedCategory.id },
      },
    });
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should render all products  by selecting All ", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    //Arrange
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(combobox);

    //Act
    const option = screen.getByRole("option", { name: /all/i });
    await user.click(option);

    //Assert
    const products = db.product.getAll();

    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
