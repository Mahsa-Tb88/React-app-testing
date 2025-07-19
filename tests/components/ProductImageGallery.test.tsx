import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGalllery", () => {
  it("should return nothing when image list is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should return image list when image list is provided", () => {
    const imageUrls = ["usrl1", "userl2"];
    render(<ProductImageGallery imageUrls={imageUrls} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    
    // imageUrls.forEach((url, index) =>
    //   expect(images[index]).toHaveAttribute("src", url)
    // );

    images.forEach((img, index) => {
      expect(img).toHaveAttribute("src", imageUrls[index]);
    });
  });
});

