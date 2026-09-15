/**
 * Content schema for the site.
 * Everything a non-developer might want to change (copy, links, images, video)
 * lives in `site.ts` and is typed here. Components never hard-code copy.
 */

export type ImageAsset = {
  /** Absolute URL or a path under /public (e.g. "/media/house.png"). */
  src: string;
  alt: string;
  /** Optional intrinsic size, used for aspect ratio + layout stability. */
  width?: number;
  height?: number;
};

export type VideoAsset = {
  /** mp4/webm URL. Leave empty ("") to show the poster image only. */
  src: string;
  poster: ImageAsset;
};

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  /** Direct link (no dropdown) */
  href?: string;
  /** Dropdown children. If present the item renders as a menu trigger. */
  children?: LinkItem[];
};

export type DealType = "buy" | "rent" | "sell";

/** Actions a button can perform. Modal buttons open the corresponding modal. */
export type Action =
  | { type: "link"; href: string; external?: boolean }
  | { type: "modal"; modal: "find-properties"; dealType?: DealType }
  | { type: "modal"; modal: "contact" }
  | { type: "modal"; modal: "agent-join" };

export type Cta = {
  label: string;
  action: Action;
};

export type BrandContent = {
  /** Short brand name used for the header wordmark and the hero logo mask. Keep it 3-6 letters for the wordmark to compose well. */
  name: string;
  legalName: string;
  tagline: string;
  /** Sign-in / portal link shown in the header. */
  signIn: Cta;
};

export type HeroContent = {
  /** Rendered as one word per line-mask; keep 3-5 words so it fits on one line on desktop. */
  title: string;
  subtitle: string;
  /** Second, muted half of the subtitle (rendered with the .em style). */
  subtitleEm: string;
  cta: Cta;
  /** Sky / backdrop photo, fills the viewport. */
  background: ImageAsset;
  /**
   * THE BUILDING. Swap this for any house/building image.
   * Best result: a transparent PNG cutout of a building (like the original site).
   * A regular photo also works: the component soft-masks its edges into the sky.
   */
  house: ImageAsset;
  /**
   * true when `house` is a transparent PNG cutout: the component then drops the soft edge mask
   * and horizon haze and shows the building crisp. false for an ordinary rectangular photo.
   */
  houseIsCutout: boolean;
  /** Optional cloud/smoke PNGs with transparency. When omitted the component renders procedural clouds. */
  cloud?: ImageAsset;
  smoke?: ImageAsset;
};

export type WhyContent = {
  label: string;
  text: string;
  textEm: string;
  video: VideoAsset;
};

export type ArrowsContent = {
  title: string;
  titleEm: string;
  /** Exactly 4 images work best (they form the arrow row). */
  images: ImageAsset[];
  text: string;
  textEm: string;
};

export type RewiredContent = {
  /** Two lines rendered as a very large display heading. */
  headlineLine1: string;
  headlineLine2: string;
  cta: Cta;
  stepsLabel: string;
  steps: { title: string; text: string }[];
};

export type ForAgentsContent = {
  label: string;
  title: string;
  titleEm: string;
  smallImage: ImageAsset;
  image: ImageAsset;
  /** Lead-in sentences, rendered in black */
  text: string;
  /** Optional remainder, rendered muted (.em) */
  textEm?: string;
  cta: Cta;
};

export type Testimonial = {
  quote: string;
  author: string;
  /** 1-5 */
  rating: number;
};

export type TestimonialsContent = {
  title: string;
  titleEm: string;
  items: Testimonial[];
  image: ImageAsset;
};

export type ServiceItem = {
  dealType: DealType;
  /** Huge word shown on the right ("Buy" / "Sell" / "Rent"). */
  label: string;
  text: string;
  image: ImageAsset;
};

export type ServicesContent = {
  caption: string;
  title: string;
  titleEm: string;
  items: ServiceItem[];
  brief: string;
  briefEm: string;
  cta: Cta;
};

export type FeatureItem = {
  title: string;
  text: string;
  image: ImageAsset;
  cta: Cta;
};

export type FeaturesContent = {
  title: string;
  titleEm: string;
  text: string;
  textEm: string;
  cta: Cta;
  items: FeatureItem[];
};

export type Post = {
  /** ISO date, e.g. "2026-09-02" */
  date: string;
  title: string;
  excerpt: string;
  image: ImageAsset;
  href: string;
  readMoreLabel: string;
};

export type PostsContent = {
  title: string;
  titleEm: string;
  text: string;
  cta: Cta;
  items: Post[];
};

export type OutroContent = {
  title: string;
  titleEm: string;
  cta: Cta;
  background: ImageAsset;
};

export type FooterContent = {
  newsletter: {
    title: string;
    placeholder: string;
    /** aria-label for the submit arrow */
    submitLabel: string;
    successText: string;
  };
  /** Large primary links (right column) */
  quickLinks: LinkItem[];
  socials: LinkItem[];
  contact: {
    officeLabel: string;
    office: string[];
    emailLabel: string;
    email: string;
    phoneLabel: string;
    phone: string;
  };
  /** Small legal / compliance links in the bottom row */
  legal: LinkItem[];
  /** Non-link notices shown inline with the legal row */
  notices: string[];
  copyright: string;
};

export type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  /** 6 = half width, 12 = full width */
  colSpan?: 6 | 12;
};

export type ModalContent = {
  title: string;
  description: string;
  fields: FormField[];
  submitLabel: string;
  successTitle: string;
  successText: string;
};

export type FindPropertiesModalContent = ModalContent & {
  dealTypes: { value: DealType; label: string }[];
};

export type SiteContent = {
  meta: { title: string; description: string };
  brand: BrandContent;
  nav: NavItem[];
  hero: HeroContent;
  why: WhyContent;
  arrows: ArrowsContent;
  rewired: RewiredContent;
  forAgents: ForAgentsContent;
  testimonials: TestimonialsContent;
  services: ServicesContent;
  features: FeaturesContent;
  posts: PostsContent;
  outro: OutroContent;
  footer: FooterContent;
  modals: {
    findProperties: FindPropertiesModalContent;
    contact: ModalContent;
    agentJoin: ModalContent;
  };
};
