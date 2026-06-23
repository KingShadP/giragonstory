import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
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
    throw redirect('/collections/giragon');
  }

  const normalizedHandle = handle.toLowerCase();
  const legacyRedirect = LEGACY_COLLECTION_REDIRECTS[normalizedHandle];

  if (legacyRedirect) {
    throw redirect(`/collections/${legacyRedirect}`);
  }

  if (handle !== normalizedHandle && CATEGORY_PROFILES[normalizedHandle]) {
    throw redirect(`/collections/${normalizedHandle}`);
  }

  const profile =
    CATEGORY_PROFILES[normalizedHandle] || CATEGORY_PROFILES.default;

  if (profile.launchOnly) {
    return {
      collection: {
        id: `giragon-${normalizedHandle}-launch`,
        handle: normalizedHandle,
        title: profile.title,
        description: profile.description,
        products: {
          nodes: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
          },
        },
      },
      profile,
    };
  }

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle: normalizedHandle, ...paginationVariables},
  });

  if (collection) {
    redirectIfHandleIsLocalized(request, {
      handle: normalizedHandle,
      data: collection,
    });
  }

  if (!collection && !CATEGORY_PROFILES[normalizedHandle]) {
    throw new Response(`Collection ${normalizedHandle} not found`, {
      status: 404,
    });
  }

  const fallbackProducts = collection
    ? null
    : await storefront.query(FALLBACK_PRODUCTS_QUERY, {
        variables: paginationVariables,
      });

  return {
    collection: collection || {
      id: `giragon-${normalizedHandle}`,
      handle: normalizedHandle,
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
  const isGiragonCollection = collection.handle === 'giragon';
  const bootloaderVideoRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [showGiragonBootloader, setShowGiragonBootloader] =
    useState(isGiragonCollection);
  const countdown = useCountdown(profile.launchDate);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isGiragonCollection) {
      setShowGiragonBootloader(false);
      return;
    }

    setShowGiragonBootloader(true);
    const bootloaderTimer = window.setTimeout(() => {
      setShowGiragonBootloader(false);
    }, 4600);

    return () => window.clearTimeout(bootloaderTimer);
  }, [collection.handle, isGiragonCollection]);

  useEffect(() => {
    if (!hasMounted || !isGiragonCollection || !showGiragonBootloader) return;

    let attempts = 0;
    const playBootloader = () => {
      const video = bootloaderVideoRef.current;
      if (!video) return;

      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => {});
    };

    playBootloader();
    const playAttempt = window.setInterval(() => {
      attempts += 1;
      playBootloader();

      if (attempts >= 8) {
        window.clearInterval(playAttempt);
      }
    }, 350);

    return () => window.clearInterval(playAttempt);
  }, [hasMounted, isGiragonCollection, showGiragonBootloader]);

  return (
    <div className={`collection giragon-page ${profile.theme}`}>
      {hasMounted && isGiragonCollection && showGiragonBootloader
        ? createPortal(
            <section
              className="giragon-bootloader"
              aria-label="Entering Giragon"
              onAnimationEnd={() => setShowGiragonBootloader(false)}
            >
              <video
                ref={bootloaderVideoRef}
                src="/media/giragon-collection-bootloader.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                onCanPlay={(event) => {
                  event.currentTarget.muted = true;
                  void event.currentTarget.play().catch(() => {});
                }}
                onLoadedData={(event) => {
                  event.currentTarget.muted = true;
                  void event.currentTarget.play().catch(() => {});
                }}
              />
              <div className="giragon-bootloader-mark">
                <span>GIRAGON</span>
                <strong>Collection loading</strong>
              </div>
            </section>,
            document.body,
          )
        : null}
      <section className="collection-hero">
        <div>
          <p className="section-code">{profile.code}</p>
          <h1>{profile.title}</h1>
        </div>
        <p className="collection-description">{profile.description}</p>
      </section>
      <section className="collection-toolbar" aria-label="Collection controls">
        <span>{profile.layout}</span>
        <span>
          {profile.launchOnly
            ? 'Sealed until July 18'
            : `${collection.products.nodes.length} pieces shown`}
        </span>
      </section>
      {profile.launchOnly ? (
        <LaunchCountdown profile={profile} countdown={countdown} />
      ) : (
        <>
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
        </>
      )}
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

function LaunchCountdown({profile, countdown}) {
  return (
    <section
      className="launch-countdown"
      aria-label="KingShadP launch countdown"
    >
      <div>
        <p>{profile.launchLabel}</p>
        <h2>{countdown.isLaunched ? 'The room is opening.' : 'July 18th'}</h2>
        <span>{profile.launchCopy}</span>
      </div>
      <div className="countdown-grid">
        {countdown.units.map((unit) => (
          <article key={unit.label}>
            <strong>{unit.value}</strong>
            <span>{unit.label}</span>
          </article>
        ))}
      </div>
      <Link prefetch="intent" to="/collections/giragon">
        Return to Giragon while the room is sealed
      </Link>
    </section>
  );
}

function useCountdown(launchDate) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!launchDate) return;

    setNow(Date.now());
    const countdownTimer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [launchDate]);

  if (!launchDate) {
    return {
      isLaunched: false,
      units: [],
    };
  }

  if (now === null) {
    return {
      isLaunched: false,
      units: [
        {label: 'Days', value: '--'},
        {label: 'Hours', value: '--'},
        {label: 'Minutes', value: '--'},
        {label: 'Seconds', value: '--'},
      ],
    };
  }

  const targetTime = new Date(launchDate).getTime();
  const remainingMs = Math.max(0, targetTime - now);
  const seconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  return {
    isLaunched: remainingMs === 0,
    units: [
      {label: 'Days', value: String(days).padStart(2, '0')},
      {label: 'Hours', value: String(hours).padStart(2, '0')},
      {label: 'Minutes', value: String(minutes).padStart(2, '0')},
      {label: 'Seconds', value: String(secondsLeft).padStart(2, '0')},
    ],
  };
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
  giragon: {
    title: 'Giragon Collection',
    code: 'Platinum Uniform Room',
    description:
      'A clean product room for the core GIRAGON uniform: essentials, layers, and everyday pieces with controlled spacing.',
    layout: 'Centered platinum grid',
    theme: 'theme-atelier',
    gridClass: 'grid-atelier',
    nextLabel: 'Next room: KingShadP Collection',
    nextUrl: '/collections/kingshadp',
  },
  kingshadp: {
    title: 'KingShadP Collection',
    code: 'Signature House Room',
    description:
      'The Signature Room is sealed until the first KingShadP collection is ready.',
    layout: 'Launch countdown',
    theme: 'theme-precision',
    gridClass: 'grid-precision',
    launchCopy:
      'No repeated placeholders. No borrowed Giragon pieces. The KingShadP room opens with its own drop.',
    launchDate: '2026-07-18T00:00:00-10:00',
    launchLabel: 'KingShadP Collection unlock',
    launchOnly: true,
    nextLabel: 'Return room: Giragon Collection',
    nextUrl: '/collections/giragon',
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
    nextLabel: 'Return to Giragon Collection',
    nextUrl: '/collections/giragon',
  },
};

const LEGACY_COLLECTION_REDIRECTS = {
  tops: 'giragon',
  bottoms: 'kingshadp',
};

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
