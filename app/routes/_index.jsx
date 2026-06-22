import {Link} from 'react-router';

export const meta = () => {
  return [{title: 'GIRAGON | Shopify Hydrogen'}];
};

export default function Homepage() {
  return (
    <div className="home giragon-page theme-home">
      <section className="home-hero">
        <div>
          <p className="section-code">Hydrogen storefront</p>
          <h1>GIRAGON</h1>
        </div>
        <p>
          A quiet home for the uniform: tops, bottoms, accessories, and the
          KINGSHADP vision held in one controlled atmosphere.
        </p>
      </section>
      <section className="category-panels" aria-label="Shop categories">
        {CATEGORIES.map((category) => (
          <Link
            className={`category-panel ${category.className}`}
            key={category.to}
            prefetch="intent"
            to={category.to}
          >
            <span>{category.mode}</span>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

const CATEGORIES = [
  {
    title: 'Tops',
    mode: 'Platinum Atelier',
    description: 'Primary layers in an airy platinum showroom.',
    to: '/collections/tops',
    className: 'panel-atelier',
  },
  {
    title: 'Bottoms',
    mode: 'Precision Retail',
    description: 'A clean comparison grid for silhouettes and proportion.',
    to: '/collections/bottoms',
    className: 'panel-precision',
  },
  {
    title: 'Accessories',
    mode: 'Gallery Commerce',
    description: 'Finishing objects treated like a curated exhibit.',
    to: '/collections/accessories',
    className: 'panel-gallery',
  },
  {
    title: 'Vision',
    mode: 'Monolith Luxury',
    description: 'The standard, quality control, and creative direction.',
    to: '/vision',
    className: 'panel-monolith',
  },
];
