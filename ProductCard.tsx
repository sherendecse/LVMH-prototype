import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className={`product-image product-image-${product.category}`}>
        <div className="product-shape" />
        <span>{product.imageLabel}</span>
      </div>

      <div className="product-information">
        <h3>{product.name}</h3>

        <dl>
          <div>
            <dt>Shade family</dt>
            <dd>{product.shadeFamily}</dd>
          </div>
          <div>
            <dt>Product form</dt>
            <dd>{product.form}</dd>
          </div>
          <div>
            <dt>Usage</dt>
            <dd>{product.usage}</dd>
          </div>
          <div>
            <dt>Suitable skin type</dt>
            <dd>{product.skinTypes.join(", ")}</dd>
          </div>
        </dl>

        <div className="price-area">
          {product.regularPrice ? (
            <>
              <span className="regular-price">
                ${product.regularPrice.toFixed(2)}
              </span>
              <span className="sale-price">
                ${product.currentPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="current-price">
              ${product.currentPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="reason-box">
          <strong>Reason</strong>
          <p>{product.reason}</p>
        </div>
      </div>
    </article>
  );
}
