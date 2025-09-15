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
      getQunatity: () => screen.getByRole("status"),
      getDecrementBtn: () => screen.getByRole("button", { name: "-" }),
      getIncrementBtn: () => screen.getByRole("button", { name: "+" }),
    };
  };

  it("should render the add to cat button", () => {
    const { addtoCartButton } = renderComponent();
    expect(addtoCartButton).toBeInTheDocument();
  });
  it("should add the product to the cart", async () => {
    const { addtoCartButton, user, getQunatity, getDecrementBtn, getIncrementBtn } =
      renderComponent();

    await user.click(addtoCartButton);

    expect(getQunatity()).toHaveTextContent("1");

    expect(getDecrementBtn()).toBeInTheDocument();

    expect(getIncrementBtn()).toBeInTheDocument();

    expect(addtoCartButton).not.toBeInTheDocument();
  });

  it("should increment  the quantity", async () => {
    const { addtoCartButton, user, getQunatity, getIncrementBtn } = renderComponent();

    await user.click(addtoCartButton);
    await user.click(getIncrementBtn());
    expect(getQunatity()).toHaveTextContent("2");
  });
});
