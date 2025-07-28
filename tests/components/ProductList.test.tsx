import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductList from "../../src/components/ProductList";
import AllProvider from "../AllProvider";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

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
    render(<ProductList />, { wrapper: AllProvider });
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products available if the list of products is empty", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProvider });
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it("should return an error message when there is an error", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProvider });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />, { wrapper: AllProvider });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading when data is fetched", () => {
    render(<ProductList />, { wrapper: AllProvider });
    waitForElementToBeRemoved(screen.queryByText(/loading/i));
  });
  it("should remove loading when fetching get failed", () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />, { wrapper: AllProvider });
    waitForElementToBeRemoved(screen.queryByText(/loading/i));
  });
});
