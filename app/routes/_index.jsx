import {Link, useLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
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
  const leadProduct = featuredProducts[0];
  const crownProducts = featuredProducts.slice(1, 4);
  const spotlightProduct = featuredProducts[3] || leadProduct;

  return (
    <div className="home giragon-page theme-home theme-shopify-copy">
      <section className="shopify-split-slideshow" aria-label="Split slideshow">
        <video
          aria-hidden="true"
          className="shopify-split-slideshow__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/media/giragon-loop-background.mp4" type="video/mp4" />
        </video>
        <SplitSlide
          align="right"
          eyebrow="You made it! Royalty has arrived!"
          heading="[Crown Heavy. Vibes Heavier.]"
          copy="CONFIDENCE: Wearing KINGSHADP means carrying yourself with undeniable authority. ELEGANCE WITH EDGE: Clean, minimal design fused with street-born boldness. EXCLUSIVITY: Every drop is limited, crafted to be rare and unforgettable."
          cta="Shop the Drop"
          to={leadProduct ? `/products/${leadProduct.handle}` : '/collections/giragon'}
          product={leadProduct}
        />
        <SplitSlide
          align="left"
          eyebrow="FEEL GOD. LOOK LIKE A GOD. BECOME GOD."
          heading="[This is KINGSHADP]"
          copy="We design clean, weighty pieces that read from across the room and hold up in the wash. GIRAGON carries the uniform while KINGSHADP sharpens the signature."
          cta="Shop now"
          to="/collections/giragon"
          product={featuredProducts[1] || leadProduct}
          dark
        />
      </section>

      <FeaturedRail
        eyebrow="Featured collection"
        heading="[The Luxuries of KingShadP]"
        copy="Better and Bold."
        cta="Buy"
        to="/collections/giragon"
        products={featuredProducts}
      />

      <section
        className="shopify-animated-slideshow"
        aria-label="Animated slideshow"
      >
        <VisualPanel product={featuredProducts[2] || leadProduct} />
        <div className="shopify-animated-slideshow__copy">
          <span>originality is the new royalty.</span>
          <h2>The Look, The Statement, The Legacy</h2>
          <p>
            Because clothes are not just clothes. They are a language. KingShadP
            is fluent in confidence, and Giragon gives that confidence a uniform
            room to live in.
          </p>
          <Link prefetch="intent" to="/collections/giragon">
            Shop now
          </Link>
        </div>
        <VisualPanel product={featuredProducts[3] || leadProduct} dark />
      </section>

      <FeaturedRail
        compact
        eyebrow="Featured collection"
        heading="Choose Your Crown"
        copy="Wear Something That’s Rare."
        cta="Cap Here"
        to="/collections/giragon"
        products={crownProducts.length ? crownProducts : featuredProducts}
      />

      <section className="shopify-featured-product" aria-label="Featured product">
        <div className="shopify-featured-product__media">
          {spotlightProduct?.featuredImage ? (
            <Image
              alt={spotlightProduct.featuredImage.altText || spotlightProduct.title}
              data={spotlightProduct.featuredImage}
              loading="lazy"
              sizes="(min-width: 900px) 48vw, 90vw"
            />
          ) : null}
        </div>
        <div className="shopify-featured-product__content">
          <span>Featured product</span>
          <h2>REGAL. IRRESISTIBLE. CONFIDENTLY</h2>
          {spotlightProduct ? (
            <>
              <h3>{spotlightProduct.title}</h3>
              <p>{formatProductPrice(spotlightProduct)}</p>
              <Link prefetch="intent" to={`/products/${spotlightProduct.handle}`}>
                View product
              </Link>
            </>
          ) : null}
        </div>
        <div className="shopify-featured-product__highlights">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductMini key={product.id} product={product} />
          ))}
        </div>
      </section>

      <MediaGrid
        eyebrow="Media grid"
        heading="Fashion x Music"
        copy="Because clothes are not just clothes. They are a language. Giragon keeps the product in frame and the energy controlled."
        product={featuredProducts[4] || leadProduct}
      />

      <section className="shopify-collection-table" aria-label="Collection table">
        <div>
          <span>Collection table</span>
          <h2>KingShadP x Adidas</h2>
          <p>Adidas with a KingShadP flare.</p>
        </div>
        <div className="shopify-collection-table__rows">
          {featuredProducts.slice(0, 5).map((product, index) => (
            <CollectionTableRow
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </section>

      <Marquee lines={['KINGSHADP', 'REGAL. RARE. ROYALTY']} />

      <section className="shopify-collection-tabs" aria-label="Collection tabs">
        <div className="shopify-collection-tabs__tabs">
          <span>KingShadP Royal Giraffagon Mascot</span>
          <span>KingShadP Brand Logo</span>
          <span>KingShadP feat Adidas</span>
        </div>
        <div className="shopify-collection-tabs__grid">
          {featuredProducts.slice(0, 4).map((product) => (
            <HomeProductTile key={product.id} product={product} />
          ))}
        </div>
      </section>

      <MediaGrid
        large
        eyebrow="Champions Becomes Luxury."
        heading="KingShadP x Champion"
        copy="KingShadP is not a brand. It is a force. Each piece is a symbol of energy, elegance, and exclusivity."
        product={featuredProducts[5] || leadProduct}
      />

      <Marquee quiet lines={['EFFORTLESSLY PERFECT']} />
    </div>
  );
}

function SplitSlide({align, eyebrow, heading, copy, cta, to, product, dark}) {
  return (
    <article
      className={`shopify-split-slide shopify-split-slide--${align}${
        dark ? ' shopify-split-slide--dark' : ''
      }`}
    >
      <div className="shopify-split-slide__image">
        {product?.featuredImage ? (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading="eager"
            sizes="(min-width: 900px) 50vw, 100vw"
          />
        ) : null}
      </div>
      <div className="shopify-split-slide__copy">
        <span>{eyebrow}</span>
        <h1>{heading}</h1>
        <p>{copy}</p>
        <Link prefetch="intent" to={to}>
          {cta}
        </Link>
      </div>
    </article>
  );
}

function FeaturedRail({eyebrow, heading, copy, cta, to, products, compact}) {
  return (
    <section
      className={`shopify-featured-rail${
        compact ? ' shopify-featured-rail--compact' : ''
      }`}
      aria-label={heading}
    >
      <div className="shopify-section-heading">
        <span>{eyebrow}</span>
        <h2>{heading}</h2>
        <p>{copy}</p>
        <Link prefetch="intent" to={to}>
          {cta}
        </Link>
      </div>
      <div className="shopify-featured-rail__products">
        {products.slice(0, compact ? 3 : 8).map((product) => (
          <HomeProductTile key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function VisualPanel({product, dark}) {
  return (
    <div className={`shopify-visual-panel${dark ? ' shopify-visual-panel--dark' : ''}`}>
      {product?.featuredImage ? (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading="lazy"
          sizes="(min-width: 900px) 30vw, 90vw"
        />
      ) : null}
    </div>
  );
}

function MediaGrid({eyebrow, heading, copy, product, large}) {
  return (
    <section
      className={`shopify-media-grid${large ? ' shopify-media-grid--large' : ''}`}
      aria-label={heading}
    >
      <div className="shopify-media-grid__visual">
        {product?.featuredImage ? (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading="lazy"
            sizes="(min-width: 900px) 66vw, 100vw"
          />
        ) : (
          <video autoPlay loop muted playsInline preload="metadata">
            <source src="/media/giragon-loop-background.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="shopify-media-grid__copy">
        <span>{eyebrow}</span>
        <h2>{heading}</h2>
        <p>{copy}</p>
      </div>
    </section>
  );
}

function Marquee({lines, quiet}) {
  return (
    <section
      className={`shopify-marquee${quiet ? ' shopify-marquee--quiet' : ''}`}
      aria-label="Marquee text"
    >
      {lines.map((line) => (
        <div key={line}>
          <span>{line}</span>
          <span>{line}</span>
          <span>{line}</span>
        </div>
      ))}
    </section>
  );
}

function HomeProductTile({product}) {
  const productUrl = useVariantUrl(product.handle);

  return (
    <Link className="home-product-tile" prefetch="intent" to={productUrl}>
      <span className="home-product-tile-media">
        {product.featuredImage ? (
          <Image
            alt={product.featuredImage.altText || product.title}
            data={product.featuredImage}
            loading="lazy"
            sizes="(min-width: 900px) 280px, 70vw"
          />
        ) : null}
      </span>
      <span className="home-product-tile-meta">
        <strong>{product.title}</strong>
        <small>{formatProductPrice(product)}</small>
      </span>
    </Link>
  );
}

function ProductMini({product}) {
  return (
    <Link className="shopify-product-mini" prefetch="intent" to={useVariantUrl(product.handle)}>
      {product.featuredImage ? (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading="lazy"
          sizes="160px"
        />
      ) : null}
      <span>{product.title}</span>
    </Link>
  );
}

function CollectionTableRow({product, index}) {
  const productUrl = useVariantUrl(product.handle);

  return (
    <Link className="shopify-collection-row" prefetch="intent" to={productUrl}>
      <span>{String(index + 1).padStart(2, '0')}</span>
      <strong>{product.title}</strong>
      <small>{formatProductPrice(product)}</small>
    </Link>
  );
}

function formatProductPrice(product) {
  const price = product?.priceRange?.minVariantPrice;
  if (!price) return '';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(Number(price.amount));
}

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
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
