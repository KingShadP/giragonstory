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
        <video
          aria-hidden="true"
          className="hero-loop-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/media/giragon-loop-background.mp4" type="video/mp4" />
        </video>
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

      <section className="room-index" aria-label="Room Index">
        <p>Room Index</p>
        {ROOMS.map((room) => (
          <Link key={room.to} prefetch="intent" to={room.to}>
            <span>{room.code}</span>
            <strong>{room.title}</strong>
            <small>{room.copy}</small>
          </Link>
        ))}
      </section>

      <section className="product-wall" aria-label="Latest Product Edit">
        <div>
          <p>Latest Product Edit</p>
          <h2>Product wall, not product grid.</h2>
          <small>
            A tighter shop-floor rhythm with larger lead pieces, compressed
            detail tiles, and direct routes into each garment.
          </small>
        </div>
        <div className="product-wall-grid">
          {featuredProducts.slice(0, 6).map((product, index) => (
            <HomeProductTile
              key={product.id}
              product={product}
              index={index}
              variant={index === 0 ? 'lead' : index === 3 ? 'wide' : 'standard'}
            />
          ))}
        </div>
      </section>

      <section className="collection-runway" aria-label="Collection runway">
        <RunwayPanel
          title="Giragon Collection"
          label="THE UNIFORM ROOM"
          copy="Clean essentials, platinum surfaces, and everyday silhouettes with luxury spacing."
          to="/collections/giragon"
          product={featuredProducts[2] || featuredProducts[0]}
        />
        <RunwayPanel
          title="KingShadP Collection"
          label="THE SIGNATURE ROOM"
          copy="Darker contrast, sharper presence, and the house mark pushed to the front."
          to="/collections/kingshadp"
          product={featuredProducts[3] || featuredProducts[1]}
          dark
        />
      </section>

      <section
        className="material-story"
        aria-label="Material presence purpose"
      >
        <div>
          <h2>Material / Presence / Purpose</h2>
          <p>
            The structure should feel like a retail installation: rooms first,
            product second, detail always close enough to inspect.
          </p>
        </div>
        <div className="material-story-list">
          {STORE_STANDARDS.map((standard) => (
            <article key={standard.code}>
              <span>{standard.code}</span>
              <p>{standard.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeProductTile({product, index, variant = 'standard'}) {
  const productUrl = useVariantUrl(product.handle);

  return (
    <Link
      className={`home-product-tile home-product-tile-${index + 1} tile-${variant}`}
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

function RunwayPanel({title, label, copy, to, product, dark = false}) {
  return (
    <Link
      className={`runway-panel${dark ? ' runway-panel-dark' : ''}`}
      prefetch="intent"
      to={to}
    >
      <span>{label}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
      {product?.featuredImage ? (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading="lazy"
          sizes="(min-width: 900px) 44vw, 90vw"
        />
      ) : null}
      <strong>Enter room</strong>
    </Link>
  );
}

const ROOMS = [
  {
    code: '01',
    title: 'Giragon Collection',
    copy: 'Clean uniform essentials',
    to: '/collections/giragon',
  },
  {
    code: '02',
    title: 'KingShadP Collection',
    copy: 'Signature house pieces',
    to: '/collections/kingshadp',
  },
  {
    code: '03',
    title: 'Accessories',
    copy: 'Finishing objects',
    to: '/collections/accessories',
  },
  {
    code: '04',
    title: 'KingShadP LLC',
    copy: 'Creative standard',
    to: '/vision',
  },
];

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
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
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
