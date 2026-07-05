import {Link} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-signature">
        <Link className="footer-brand" prefetch="intent" to="/">
          GIRAGON
        </Link>
        <p>Premium uniform rooms by KINGSHADP LLC.</p>
      </div>
      <nav className="footer-menu" aria-label="Footer navigation">
        <div>
          <span>Collections</span>
          <Link prefetch="intent" to="/collections/giragon">
            Giragon Collection
          </Link>
          <Link prefetch="intent" to="/collections/kingshadp">
            KingShadP Collection
          </Link>
        </div>
        <div>
          <span>House</span>
          <Link prefetch="intent" to="/vision">
            KingShadP LLC
          </Link>
        </div>
      </nav>
      <p className="footer-mark">KINGSHADP</p>
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
