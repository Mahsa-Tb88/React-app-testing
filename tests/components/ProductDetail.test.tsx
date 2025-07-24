import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

describe("Product Detail", () => {
  const productsId: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productsId.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productsId  } } });
  });

  it("should render product detail", async () => {
    render(<ProductDetail productId={1} />);
    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument();

    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
    ).toBeInTheDocument();
  });

  it("should return message if the product not found! ", async () => {
    server.use(http.get("products/1", () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />);
    const msg = await screen.findByText(/not found/);
    expect(msg).toBeInTheDocument();
  });

  it("should render an error id product id is invalid! ", async () => {
    render(<ProductDetail productId={0} />);
    const msg = await screen.findByText(/invalid/i);
    expect(msg).toBeInTheDocument();
  });
});
