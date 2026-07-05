import {Link} from 'react-router';

export const meta = () => {
  return [{title: 'KingShadP LLC | Campaign Standard'}];
};

export default function Vision() {
  return (
    <div className="vision giragon-page theme-monolith vision-campaign">
      <section className="vision-hero">
        <p className="section-code">KingShadP LLC</p>
        <h1>Official campaign standard.</h1>
        <p>
          Clean luxury lifestyle energy, realistic apparel, restrained symbols,
          and one cohesive scene at a time. No collage, no fake excess, no
          distorted wordmarks.
        </p>
        <div className="vision-hero-proof" aria-label="Campaign constraints">
          <span>Void black</span>
          <span>Oxblood</span>
          <span>Rose gold</span>
          <span>Platinum</span>
        </div>
      </section>

      <section
        className="vision-campaign-stage"
        aria-label="Campaign image direction"
      >
        <div>
          <span>One finished image</span>
          <h2>Luxury photography, not a layout trick.</h2>
        </div>
        <p>
          KingShadP campaign assets should feel like real editorial fashion:
          believable model posture, natural shadows, tactile fabric, clean
          framing, and negative space strong enough for a Shopify hero,
          lookbook, or launch post.
        </p>
      </section>

      <section
        className="vision-grid vision-symbol-grid"
        aria-label="Locked symbol system"
      >
        {SYMBOLS.map((symbol) => (
          <article key={symbol.code}>
            <span>{symbol.code}</span>
            <h2>{symbol.title}</h2>
            <p>{symbol.copy}</p>
          </article>
        ))}
      </section>

      <section
        className="vision-environments"
        aria-label="Preferred campaign environments"
      >
        <div>
          <span>Environment</span>
          <h2>Believable luxury settings only.</h2>
        </div>
        <ul>
          {ENVIRONMENTS.map((environment) => (
            <li key={environment}>{environment}</li>
          ))}
        </ul>
      </section>

      <section
        className="vision-grid vision-direction-grid"
        aria-label="Photography standards"
      >
        {DIRECTIONS.map((direction) => (
          <article key={direction.code}>
            <span>{direction.code}</span>
            <h2>{direction.title}</h2>
            <p>{direction.copy}</p>
          </article>
        ))}
      </section>

      <section className="vision-cta">
        <span>Return to the active collection</span>
        <Link prefetch="intent" to="/collections/giragon">
          Giragon Collection
        </Link>
      </section>
    </div>
  );
}

const SYMBOLS = [
  {
    code: '01',
    title: 'Giragon Guardian',
    copy: 'A refined giraffe-dragon guardian with an elegant long neck, wings, curved tail, filigree detail, metallic finish, and a restrained halo crown.',
  },
  {
    code: '02',
    title: 'SP Crest',
    copy: 'A readable shield crest with intertwined S and P letters under a crown. No random letters, no clutter, no cheap oversized badge treatment.',
  },
  {
    code: '03',
    title: 'KingShadP Wordmark',
    copy: 'Exact spelling, controlled scale, and premium placement as embroidery, print, tag, zipper pull, pendant, or quiet signature detail.',
  },
];

const ENVIRONMENTS = [
  'Modern luxury hotel terrace',
  'Ocean-view balcony',
  'Minimal marble lobby',
  'Black stone gallery',
  'Rain-slick city entrance',
  'Quiet luxury lounge',
];

const DIRECTIONS = [
  {
    code: 'Lens',
    title: 'Editorial realism',
    copy: '35mm, 50mm, or 85mm fashion framing with realistic proportions, believable hands, natural skin texture, and commercial-grade clothing detail.',
  },
  {
    code: 'Wardrobe',
    title: 'Wearable branding',
    copy: 'Small embroidered Giragon marks, SP crest badges, and KingShadP signature details that follow fabric perspective instead of looking pasted on.',
  },
  {
    code: 'Finish',
    title: 'No AI tells',
    copy: 'No collage layout, melted logos, distorted limbs, fake mansions, cartoon crowns, overdone fantasy, or over-luxury gold noise.',
  },
];
