import { render, screen } from "@testing-library/react";

import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
      getOption: (lable: RegExp) =>
        screen.findByRole("option", { name: lable }),
      user: userEvent.setup(),
      onChange,
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

  it("should return correct status", async () => {
    const { trigger, getOptions, user } = renderComponent();

    await user.click(trigger);

    const options = await getOptions();
    expect(options).toHaveLength(3);

    const lables = options.map((option) => option.textContent);
    expect(lables).toEqual(["New", "Processed", "Fulfilled"]);
  });

  it.each([
    { lable: /processed/i, value: "processed" },
    { lable: /fulfilled/i, value: "fulfilled" },
  ])(
    `should call on Change $value when it is selected`,
    async ({ lable, value }) => {
      const { user, trigger, onChange, getOption } = renderComponent();
      await user.click(trigger);

      const option = await getOption(lable);
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange with new when new is not default and we slect new", async () => {
    const { user, trigger, onChange, getOption } = renderComponent();
    await user.click(trigger);

    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger);
    const newOption = await getOption(/new/i);
    await user.click(newOption);
    expect(onChange).toHaveBeenCalledWith("new");
  });
});
