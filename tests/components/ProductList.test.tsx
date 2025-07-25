import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

describe("Product List", () => {
  const productsId: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productsId.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productsId } } });
  });

  it("should render the list of products", async () => {
    render(<ProductList />);
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if the list of products is empty", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it("should return an error message when there is an error", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
