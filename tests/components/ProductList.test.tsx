import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";
import { QueryClient, QueryClientProvider } from "react-query";

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

  const renderComponents = () => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <ProductList />
      </QueryClientProvider>
    );
  };

  it("should render the list of products", async () => {
    renderComponents();
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
 
  it("should render no products available if the list of products is empty", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    renderComponents();
    expect(await screen.findByText(/no products/i)).toBeInTheDocument();
  });

  it("should return an error message when there is an error", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    renderComponents();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading indicator when fetching data", async () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );
    renderComponents();
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove loading when data is fetched", () => {
    renderComponents();
    waitForElementToBeRemoved(screen.queryByText(/loading/i));
  });
  it("should remove loading when fetching get failed", () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    renderComponents();
    waitForElementToBeRemoved(screen.queryByText(/loading/i));
  });
});
