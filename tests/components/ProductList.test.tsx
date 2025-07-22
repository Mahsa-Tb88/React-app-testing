import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";

describe("Product List", () => {
  it("should render the list of products", async () => {
    render(<ProductList />);
    const produstList = await screen.findAllByRole("listitem");
    expect(produstList.length).toBeGreaterThan(0);
  });

  it("should render no products available   if the list of products is empty", async () => {
    server.use(
      http.get("/products", () => {
        HttpResponse.json([]);
      })
    );

    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });
});
