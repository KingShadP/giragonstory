import {Link} from 'react-router';

export const meta = () => {
  return [{title: 'GIRAGON | Vision'}];
};

export default function Vision() {
  return (
    <div className="vision giragon-page theme-monolith">
      <section className="vision-hero">
        <p className="section-code">Monolith Luxury</p>
        <h1>Quality control is the atmosphere.</h1>
        <p>
          GIRAGON is built to feel intentional before a product is ever touched:
          clean categories, controlled materials, sharp presentation, and no
          cheap noise around the work.
        </p>
      </section>
      <section className="vision-grid" aria-label="Brand standards">
        <article>
          <span>01</span>
          <h2>Material First</h2>
          <p>
            The shop should make every piece feel inspected, edited, and placed
            with purpose.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Pure Commerce</h2>
          <p>
            No accounts, no newsletter wall, no distractions. The site exists
            for the product and the brand point of view.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>KINGSHADP Standard</h2>
          <p>
            The watermark sits in the background as a signature, not a gimmick:
            quiet, present, and unmistakable.
          </p>
        </article>
      </section>
      <section className="vision-cta">
        <span>Return to the first product room</span>
        <Link prefetch="intent" to="/collections/giragon">
          Giragon Collection
        </Link>
      </section>
    </div>
  );
}
