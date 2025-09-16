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
      getQunatity: () => screen.queryByRole("status"),
      getDecrementBtn: () => screen.queryByRole("button", { name: "-" }),
      getIncrementBtn: () => screen.queryByRole("button", { name: "+" }),
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
    await user.click(getIncrementBtn()!);
    expect(getQunatity()).toHaveTextContent("2");
  });

  it("should decremment the quantity when quatity is larger than 1", async () => {
    const { addtoCartButton, user, getQunatity, getIncrementBtn, getDecrementBtn } =
      renderComponent();

    await user.click(addtoCartButton);
    await user.click(getIncrementBtn()!);
    await user.click(getDecrementBtn()!);

    expect(getQunatity()).toHaveTextContent("1");
  });
  it("should remove the quantity when click on decrement btn and quatity is  1", async () => {
    const { addtoCartButton, user, getQunatity, getIncrementBtn, getDecrementBtn } =
      renderComponent();

    await user.click(addtoCartButton);
    await user.click(getDecrementBtn()!);

    expect(getQunatity()).not.toBeInTheDocument();
    expect(getIncrementBtn()).not.toBeInTheDocument();
    expect(getDecrementBtn()).not.toBeInTheDocument();
    // expect(addtoCartButton).toBeInTheDocument();
  });
});
