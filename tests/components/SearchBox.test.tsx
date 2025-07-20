import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("Search box", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      onChange,
      user: userEvent.setup(),
      input: screen.getByPlaceholderText(/search/i),
    };
  };

  it("should return an input field with search", () => {
    const { input } = renderSearchBox();
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when enter key is pressed", async () => {
    const { input, user, onChange } = renderSearchBox();

    const searchTerm = "Search Term";
    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should not call onChange when enter key is pressed and searchTerm is empty", async () => {
    const { input, user, onChange } = renderSearchBox();
    await user.type(input, "{enter}");
    expect(onChange).not.toHaveBeenCalledWith();
  });
});

