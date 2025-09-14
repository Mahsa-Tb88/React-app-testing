import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../src/providers/CartProvider";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("Quantity selector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 5,
      categoryId: 1,
    };

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      addtoCartButton: screen.getByRole("button", { name: /add to cart/i }),
      user: userEvent.setup(),
    };
  };

  it("should render the add to cat button", () => {
    const { addtoCartButton } = renderComponent();
    expect(addtoCartButton).toBeInTheDocument();
  });
  it("should add the product to the cart", async () => {
    const { addtoCartButton, user } = renderComponent();
    await user.click(addtoCartButton);

    const quantity = screen.getByRole("status");
    expect(quantity).toHaveTextContent("1");

    const decrementBtn = screen.getByRole("button", { name: "-" });
    expect(decrementBtn).toBeInTheDocument();

    const incrementBtn = screen.getByRole("button", { name: "+" });
    expect(incrementBtn).toBeInTheDocument();

    expect(addtoCartButton).not.toBeInTheDocument();
  });
});
