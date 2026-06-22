import { Suspense } from 'react';
import { Await, Link, NavLink, useAsyncValue } from 'react-router';
import { useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';

export function Header({ cart }) {
  return (
    <header className="site-header">
      <Link className="brand-mark" prefetch="intent" to="/">
        <span className="brand-emblem" aria-hidden="true">
          G
        </span>
        <span>GIRAGON</span>
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            className="primary-nav-link"
            end
            key={item.to}
            prefetch="intent"
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <nav className="header-actions" aria-label="Shop actions">
        <HeaderMenuMobileToggle />
        <SearchToggle />
        <CartToggle cart={cart} />
      </nav>
    </header>
  );
}

export function HeaderMenu({ viewport }) {
  const { close } = useAside();
  const className = `header-menu-${viewport}`;

  return (
    <nav className={className} role="navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          className="header-menu-item"
          end
          key={item.to}
          onClick={close}
          prefetch="intent"
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="icon-button header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      type="button"
      aria-label="Open menu"
    >
      <span aria-hidden="true">MENU</span>
    </button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <button
      className="text-button reset"
      onClick={() => open('search')}
      type="button"
    >
      Search
    </button>
  );
}

function CartBadge({ count }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a
      className="cart-link"
      href="/cart"
      onClick={(event) => {
        event.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      Cart <span aria-label={`items: ${count}`}>{count}</span>
    </a>
  );
}

function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const NAV_ITEMS = [
  { label: 'Giragon Collection', to: '/collections/Giragon' },
  { label: 'KingShadP Collection', to: '/collections/KingShadP' },
  { label: 'Accessories', to: '/collections/accessories' },
  { label: 'KingShadP LLC', to: '/vision' },
];

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
