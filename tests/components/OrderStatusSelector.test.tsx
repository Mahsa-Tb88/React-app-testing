import { render, screen } from "@testing-library/react";

import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    return {
      trigger: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
    };
  };

  it("should return new as a default value", () => {
    const { trigger } = renderComponent();
    expect(trigger).toHaveTextContent("New");
  });

  it("should return correct status", async () => {
    const { trigger, getOptions } = renderComponent();

    const user = userEvent.setup();
    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const lables = options.map((option) => option.textContent);
    expect(lables).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
