import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {
  readWishlist,
  WISHLIST_UPDATED_EVENT,
  writeWishlist,
} from '~/components/WishlistButton';

export function AccountWishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const syncWishlist = () => setWishlist(readWishlist());

    syncWishlist();
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    window.addEventListener('storage', syncWishlist);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
      window.removeEventListener('storage', syncWishlist);
    };
  }, []);

  const removeFromWishlist = (productId) => {
    const nextWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(nextWishlist);
    writeWishlist(nextWishlist);
  };

  return (
    <section
      className="account-wishlist"
      id="account-wishlist"
      aria-label="Wishlist"
    >
      <div className="account-wishlist-header">
        <p>Personal Wishlist</p>
        <h2>Reserved objects of interest.</h2>
        <span>{wishlist.length} saved</span>
      </div>

      {wishlist.length ? (
        <div className="account-wishlist-grid">
          {wishlist.map((item) => (
            <article className="wishlist-item" key={item.id}>
              <Link prefetch="intent" to={`/products/${item.handle}`}>
                <span className="wishlist-item-media">
                  {item.image?.url ? (
                    <img
                      alt={item.image.altText || item.title}
                      src={item.image.url}
                    />
                  ) : null}
                </span>
                <strong>{item.title}</strong>
                {item.price ? <small>{formatMoney(item.price)}</small> : null}
              </Link>
              <button onClick={() => removeFromWishlist(item.id)} type="button">
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          <p>No saved pieces yet.</p>
          <Link prefetch="intent" to="/collections/giragon">
            Enter Giragon Collection
          </Link>
        </div>
      )}
    </section>
  );
}

function formatMoney(price) {
  const amount = Number(price.amount || 0);

  return new Intl.NumberFormat('en-US', {
    currency: price.currencyCode || 'USD',
    style: 'currency',
  }).format(amount);
}
