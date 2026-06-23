import {Link, useLoaderData} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

export const meta = () => {
  return [{title: 'GIRAGON | KingShadP Collection'}];
};

export async function loader({context}) {
  const {products} = await context.storefront.query(HOMEPAGE_PRODUCTS_QUERY);
  return {products};
}

export default function Homepage() {
  const {products} = useLoaderData();
  const featuredProducts = products?.nodes ?? [];

  return (
    <div className="home giragon-page theme-home theme-remaster">
      <section className="home-hero home-hero-editorial">
        <div className="home-hero-copy">
          <h1>Not a menu. A product atmosphere.</h1>
          <p>
            GIRAGON carries the uniform. KINGSHADP sharpens the signature. The
            store opens as a controlled fashion room with product, texture, and
            intent in the first frame.
          </p>
          <div className="home-actions" aria-label="Primary collection links">
            <Link prefetch="intent" to="/collections/giragon">
              Enter Giragon
            </Link>
            <Link prefetch="intent" to="/collections/kingshadp">
              Enter KingShadP
            </Link>
          </div>
        </div>
        <div className="home-product-stage">
          <div className="stage-frame stage-frame-primary">
            {featuredProducts[0]?.featuredImage ? (
              <Image
                alt={
                  featuredProducts[0].featuredImage.altText ||
                  featuredProducts[0].title
                }
                data={featuredProducts[0].featuredImage}
                loading="eager"
                sizes="(min-width: 900px) 520px, 80vw"
              />
            ) : null}
            <span>The Uniform Room</span>
          </div>
          <div className="stage-frame stage-frame-secondary">
            {featuredProducts[1]?.featuredImage ? (
              <Image
                alt={
                  featuredProducts[1].featuredImage.altText ||
                  featuredProducts[1].title
                }
                data={featuredProducts[1].featuredImage}
                loading="eager"
                sizes="(min-width: 900px) 340px, 56vw"
              />
            ) : null}
            <span>The Signature Room</span>
          </div>
          <div className="stage-index">01 / 02</div>
        </div>
      </section>

      <section className="home-statement" aria-label="Brand statement">
        <p>GIRAGON / KINGSHADP</p>
        <h2>
          Premium retail rhythm, sharpened contrast, and product rooms that make
          every piece feel placed, inspected, and ready.
        </h2>
      </section>

      <section className="home-collection-split" aria-label="Featured rooms">
        <Link
          className="collection-room collection-room-giragon"
          prefetch="intent"
          to="/collections/giragon"
        >
          <span>THE UNIFORM ROOM</span>
          <h2>Giragon Collection</h2>
          <p>
            Clean essentials, platinum surfaces, and everyday silhouettes with
            luxury spacing.
          </p>
        </Link>
        <Link
          className="collection-room collection-room-kingshadp"
          prefetch="intent"
          to="/collections/kingshadp"
        >
          <span>THE SIGNATURE ROOM</span>
          <h2>KingShadP Collection</h2>
          <p>
            Darker contrast, sharper presence, and the house mark pushed to the
            front.
          </p>
        </Link>
      </section>

      <section className="home-product-edit" aria-label="Latest edit">
        <div>
          <p>Latest product edit</p>
          <h2>Objects in the room, not boxes on a page.</h2>
        </div>
        <div className="home-product-rail">
          {featuredProducts.slice(0, 4).map((product, index) => (
            <HomeProductTile key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <section className="home-proof" aria-label="Storefront standards">
        {STORE_STANDARDS.map((standard) => (
          <article key={standard.code}>
            <span>{standard.code}</span>
            <p>{standard.copy}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

function HomeProductTile({product, index}) {
  const productUrl = useVariantUrl(product.handle);

  return (
    <Link
      className={`home-product-tile home-product-tile-${index + 1}`}
      prefetch="intent"
      to={productUrl}
    >
      <span className="home-product-tile-media">
        {product.featuredImage ? (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading={index < 2 ? 'eager' : 'lazy'}
            sizes="(min-width: 900px) 280px, 70vw"
          />
        ) : null}
      </span>
      <span className="home-product-tile-meta">
        <strong>{product.title}</strong>
        <small>
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </span>
    </Link>
  );
}

const STORE_STANDARDS = [
  {
    code: '01',
    copy: 'Collection-first navigation, no generic clothing buckets.',
  },
  {
    code: '02',
    copy: 'Editorial scale, product depth, and premium contrast across the shop.',
  },
  {
    code: '03',
    copy: 'Mobile keeps the luxury rhythm without clipped type or overflow.',
  },
];

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        featuredImage {
          id
          altText
          url
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
