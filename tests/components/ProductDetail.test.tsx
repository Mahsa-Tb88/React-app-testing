import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { products } from "../mocks/data";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

describe("Product Detail", () => {
  let productId: number;
  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product detail", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />);
    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();

    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
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

  it("should return error message if there is error", async () => {
    server.use(
      http.get("products/1", () => {
        return HttpResponse.error();
      })
    );

    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
