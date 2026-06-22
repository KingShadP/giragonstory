import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const hoverImage = product.images?.nodes?.find(
    (candidate) => candidate?.url && candidate.url !== image?.url,
  );
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <span className="product-media">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            className="product-image-primary"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        {hoverImage && (
          <Image
            alt={hoverImage.altText || product.title}
            aspectRatio="1/1"
            className="product-image-hover"
            data={hoverImage}
            loading="lazy"
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
      </span>
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
