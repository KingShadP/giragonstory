import {useEffect, useState} from 'react';

export const WISHLIST_STORAGE_KEY = 'giragon:wishlist';
export const WISHLIST_UPDATED_EVENT = 'giragon:wishlist-updated';

export function WishlistButton({product, selectedVariant, className = ''}) {
  const wishlistItem = getWishlistItem(product, selectedVariant);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const syncWishlistState = () => {
      setIsWishlisted(
        readWishlist().some((item) => item.id === wishlistItem.id),
      );
    };

    syncWishlistState();
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlistState);
    window.addEventListener('storage', syncWishlistState);

    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlistState);
      window.removeEventListener('storage', syncWishlistState);
    };
  }, [wishlistItem.id]);

  const toggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const wishlist = readWishlist();
    const nextWishlist = isWishlisted
      ? wishlist.filter((item) => item.id !== wishlistItem.id)
      : [
          wishlistItem,
          ...wishlist.filter((item) => item.id !== wishlistItem.id),
        ];

    writeWishlist(nextWishlist);
    setIsWishlisted(!isWishlisted);
  };

  return (
    <button
      aria-pressed={isWishlisted}
      className={`wishlist-button ${isWishlisted ? 'is-wishlisted' : ''} ${className}`.trim()}
      onClick={toggleWishlist}
      type="button"
    >
      <span aria-hidden="true">{isWishlisted ? 'Saved' : 'Save'}</span>
      <strong>
        {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      </strong>
    </button>
  );
}

export function readWishlist() {
  if (typeof window === 'undefined') return [];

  try {
    const savedWishlist = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch {
    return [];
  }
}

export function writeWishlist(wishlist) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
}

function getWishlistItem(product, selectedVariant) {
  const price =
    selectedVariant?.price ||
    product.priceRange?.minVariantPrice ||
    product.selectedOrFirstAvailableVariant?.price;
  const image =
    selectedVariant?.image ||
    product.featuredImage ||
    product.images?.nodes?.[0];

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    image: image
      ? {
          altText: image.altText || product.title,
          url: image.url,
        }
      : null,
    price: price
      ? {
          amount: price.amount,
          currencyCode: price.currencyCode,
        }
      : null,
    savedAt: new Date().toISOString(),
  };
}
