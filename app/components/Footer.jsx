import {Link} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer() {
  return (
    <footer className="footer">
      <Link className="footer-brand" prefetch="intent" to="/">
        GIRAGON
      </Link>
      <nav className="footer-menu" aria-label="Footer navigation">
        <Link prefetch="intent" to="/collections/tops">Tops</Link>
        <Link prefetch="intent" to="/collections/bottoms">Bottoms</Link>
        <Link prefetch="intent" to="/collections/accessories">Accessories</Link>
        <Link prefetch="intent" to="/vision">Vision</Link>
      </nav>
      <p>Quality control. High-end atmosphere. Built for KINGSHADP.</p>
    </footer>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
