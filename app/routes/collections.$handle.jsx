import {Link, redirect, useLoaderData} from 'react-router';
import {Analytics, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

export const meta = ({data}) => {
  return [{title: `GIRAGON | ${data?.collection.title ?? 'Collection'}`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 8});

  if (!handle) {
    throw redirect('/collections/tops');
  }

  const profile = CATEGORY_PROFILES[handle] || CATEGORY_PROFILES.default;
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (collection) {
    redirectIfHandleIsLocalized(request, {handle, data: collection});
  }

  if (!collection && !CATEGORY_PROFILES[handle]) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  const fallbackProducts = collection
    ? null
    : await storefront.query(FALLBACK_PRODUCTS_QUERY, {
        variables: paginationVariables,
      });

  return {
    collection: collection || {
      id: `giragon-${handle}`,
      handle,
      title: profile.title,
      description: profile.description,
      products: fallbackProducts.products,
    },
    profile,
  };
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {collection, profile} = useLoaderData();

  return (
    <div className={`collection giragon-page ${profile.theme}`}>
      <section className="collection-hero">
        <div>
          <p className="section-code">{profile.code}</p>
          <h1>{profile.title}</h1>
        </div>
        <p className="collection-description">{profile.description}</p>
      </section>
      <section className="collection-toolbar" aria-label="Collection controls">
        <span>{profile.layout}</span>
        <span>{collection.products.nodes.length} pieces shown</span>
      </section>
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName={`products-grid ${profile.gridClass}`}
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <section className="category-transition">
        <span>{profile.nextLabel}</span>
        <Link prefetch="intent" to={profile.nextUrl}>
          Continue
        </Link>
      </section>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
    images(first: 2) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

const FALLBACK_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query FallbackProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: UPDATED_AT
      reverse: true
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`;

const CATEGORY_PROFILES = {
  tops: {
    title: 'Tops',
    code: 'Platinum Atelier',
    description:
      'A clean atelier page for the primary pieces: tees, knits, hoodies, jackets, and sharp layers.',
    layout: 'Centered platinum grid',
    theme: 'theme-atelier',
    gridClass: 'grid-atelier',
    nextLabel: 'Next category: Bottoms',
    nextUrl: '/collections/bottoms',
  },
  bottoms: {
    title: 'Bottoms',
    code: 'Precision Retail',
    description:
      'A tighter retail layout for comparing pants, cargos, denim, shorts, and proportions fast.',
    layout: 'Precision filter rhythm',
    theme: 'theme-precision',
    gridClass: 'grid-precision',
    nextLabel: 'Next category: Accessories',
    nextUrl: '/collections/accessories',
  },
  accessories: {
    title: 'Accessories',
    code: 'Gallery Commerce',
    description:
      'A gallery treatment for objects that finish the uniform: hats, bags, jewelry, and details.',
    layout: 'Gallery object spacing',
    theme: 'theme-gallery',
    gridClass: 'grid-gallery',
    nextLabel: 'Brand page: Vision',
    nextUrl: '/vision',
  },
  default: {
    title: 'Collection',
    code: 'GIRAGON',
    description:
      'A focused product edit with high-end atmosphere and restrained detail.',
    layout: 'Premium product grid',
    theme: 'theme-atelier',
    gridClass: 'grid-atelier',
    nextLabel: 'Return to Tops',
    nextUrl: '/collections/tops',
  },
};

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
