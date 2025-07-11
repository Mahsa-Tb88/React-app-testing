import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should return nothing if array of imgage is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("should return images if array of imgage is not empty", () => {

    const imageUrls: Array<string> = ["photo1", "photo2"];

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole("img");

    expect(images).toHaveLength(2);
    
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
