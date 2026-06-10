import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type ProductMasonryProps = {
  products: Product[];
};

export function ProductMasonry({ products }: ProductMasonryProps) {
  return (
    <div className="masonry-grid">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
