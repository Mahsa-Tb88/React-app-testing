import { render, screen } from "@testing-library/react";

import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";

describe("OrderStatusSelector", () => {
  it("should return selector with default value new", () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );
  });
});
