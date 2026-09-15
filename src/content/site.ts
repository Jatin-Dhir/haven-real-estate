import type { SiteContent } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to change any copy, link, image or video.
 *
 *  • All text is dummy placeholder copy. Replace freely.
 *  • Images are royalty-free Unsplash photos (Unsplash License). Swap any `src`
 *    for your own file placed in /public (e.g. "/media/my-house.png").
 *  • THE BUILDING in the hero is `hero.house`. A transparent PNG cutout of a
 *    building gives the best result; a normal photo is soft-masked into the sky.
 *  • Buttons use `action`: either a link, or a modal ("find-properties",
 *    "contact", "agent-join").
 * ─────────────────────────────────────────────────────────────────────────────
 */

const unsplash = (id: string, w = 1920, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const site: SiteContent = {
  meta: {
    title: "HAVEN Real Estate | Buy, Rent or Sell Residential and Commercial Property",
    description: "Trusted advisors. Honest numbers. A straight line to the place that fits.",
  },

  brand: {
    name: "HAVEN",
    legalName: "Haven Real Estate LLC",
    tagline: "Own your next chapter.",
    signIn: { label: "Sign In", action: { type: "link", href: "/sign-in" } },
  },

  nav: [
    { label: "Search", href: "/search" },
    { label: "Agents", href: "/agents" },
    {
      label: "Join",
      children: [
        { label: "New York City", href: "/join/new-york-city" },
        { label: "Jersey City", href: "/join/jersey-city" },
        { label: "Philadelphia", href: "/join/philadelphia" },
        { label: "Miami", href: "/join/miami" },
        { label: "Austin", href: "/join/austin" },
        { label: "Chicago (coming soon)", href: "/join/chicago" },
      ],
    },
    {
      label: "Paperwork",
      children: [
        { label: "Submit an Application", href: "/paperwork/apply" },
        { label: "Make a Payment", href: "/paperwork/payments" },
        { label: "Online Forms", href: "/paperwork/forms" },
      ],
    },
    {
      label: "Resources",
      children: [
        { label: "Partner Network", href: "/resources/partners" },
        { label: "Commercial", href: "/resources/commercial" },
        { label: "Standard Procedures", href: "/resources/procedures" },
        { label: "Rent vs. Buy Calculator", href: "/resources/rent-vs-buy" },
      ],
    },
    {
      label: "About",
      children: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
      ],
    },
  ],

  hero: {
    title: "Own Your Next Chapter",
    subtitle: "Trusted advisors. Honest numbers.",
    subtitleEm: "A straight line to the place that fits.",
    cta: { label: "Browse Properties", action: { type: "modal", modal: "find-properties" } },
    background: {
      src: unsplash("1499346030926-9a72daac6c63", 2400),
      alt: "Blue sky above a soft bank of white clouds",
      width: 2400,
      height: 1600,
    },
    // ← THE BUILDING. Replace with your own cutout PNG for a floating-house look.
    house: {
      // Transparent PNG cutout (public/media/hero-building.png; source photo: Pexels, free license,
      // background removed with rembg). Swap for your own cutout and keep houseIsCutout: true;
      // for a plain rectangular photo set houseIsCutout: false.
      src: "/media/hero-building.png",
      alt: "Modern apartment tower with glass balconies",
      width: 1588,
      height: 1236,
    },
    houseIsCutout: true,
  },

  why: {
    label: "Why HAVEN",
    text: "Life keeps moving. Don't just change your address — change your trajectory.",
    textEm: "We pair you with an advisor who listens first, then moves fast, so the next step feels obvious.",
    video: {
      src: "",
      poster: {
        src: unsplash("1600607687939-ce8a6c25118c", 1920),
        alt: "Sunlit living room with large windows",
        width: 1920,
        height: 1280,
      },
    },
  },

  arrows: {
    title: "This isn't just",
    titleEm: "about property.",
    images: [
      { src: unsplash("1502672260266-1c1ef2d93688", 800), alt: "Bright apartment interior", width: 800, height: 1000 },
      { src: unsplash("1484154218962-a197022b5858", 800), alt: "Kitchen with morning light", width: 800, height: 1000 },
      { src: unsplash("1522708323590-d24dbb6b0267", 800), alt: "Living room with plants", width: 800, height: 1000 },
      { src: unsplash("1493809842364-78817add7ffb", 800), alt: "Cozy reading corner", width: 800, height: 1000 },
    ],
    text: "It's about momentum. Belonging. Room to grow. You're not just looking for square footage.",
    textEm: "You're looking for the place your life clicks into gear. That's what we help you find.",
  },

  rewired: {
    headlineLine1: "Property,",
    headlineLine2: "Reimagined.",
    cta: { label: "Start Your Search", action: { type: "modal", modal: "find-properties" } },
    stepsLabel: "How it works:",
    steps: [
      { title: "Talk to a Real Person.", text: "You're matched with one advisor who actually listens and stays with you end to end." },
      { title: "Get the Full Picture.", text: "We map what you truly need, not just what happens to be listed this week." },
      { title: "Make the Move.", text: "We find the fit, negotiate hard, and handle the paperwork until the keys are yours." },
    ],
  },

  forAgents: {
    label: "For Advisors",
    title: "Don't Rent Your Career.",
    titleEm: "Own It.",
    smallImage: {
      src: unsplash("1521737604893-d14cc237f11d", 1200),
      alt: "Team reviewing plans around a table",
      width: 1200,
      height: 800,
    },
    image: {
      src: unsplash("1560250097-0b93528c311a", 1400),
      alt: "Advisor in a tailored jacket looking ahead",
      width: 1400,
      height: 1750,
    },
    text: "At HAVEN, advisors hold real equity in the company they build. Top performers share in the upside, so the person guiding your deal is invested in the outcome, not just the commission.",
    textEm:
      "Every advisor is certified, coached, and backed by in-house legal, mortgage, and marketing teams. If you're an agent, this is where a job becomes a career, and a career becomes ownership.",
    cta: { label: "Join The Team", action: { type: "modal", modal: "agent-join" } },
  },

  testimonials: {
    title: "Don't Take",
    titleEm: "Our Word for It.",
    items: [
      {
        quote:
          "Priya was relentless in the best way. She toured eleven places with us over two weekends, never rushed a decision, and negotiated a closing credit we didn't think was possible.",
        author: "Daniel & Marcus R.",
        rating: 5,
      },
      {
        quote:
          "As a first-time buyer I was drowning in paperwork. Jonah explained every line, flagged two issues in the inspection, and kept the deal moving. We love the apartment.",
        author: "Alexis M.",
        rating: 5,
      },
      {
        quote:
          "We had thirty days to relocate for work. Our advisor had a shortlist by Monday and a signed lease by Friday, in a neighborhood we would never have found on our own.",
        author: "The Okafor Family",
        rating: 5,
      },
      {
        quote:
          "Selling my mother's house was emotional. Renata handled the staging, the pricing, and the open houses with real care, and it went for well over asking.",
        author: "Caroline T.",
        rating: 5,
      },
      {
        quote:
          "Third transaction with this team in six years. Same calm, same honesty, same results. There's a reason we keep coming back.",
        author: "Samuel K.",
        rating: 5,
      },
    ],
    image: {
      src: unsplash("1600585154340-be6161a56a0c", 1600),
      alt: "Family walking up to a brick townhouse",
      width: 1600,
      height: 1067,
    },
  },

  services: {
    caption: "Services",
    title: "How HAVEN",
    titleEm: "Can Help You",
    items: [
      {
        dealType: "buy",
        label: "Buy",
        text: "Buy with confidence. Your advisor is backed by mortgage, legal, and appraisal specialists who know exactly where the leverage is, so you close on the right home at the right number.",
        image: { src: unsplash("1564013799919-ab600027ffc6", 1920), alt: "House with a wide front lawn", width: 1920, height: 1280 },
      },
      {
        dealType: "sell",
        label: "Sell",
        text: "Sell fast and sell well. Professional staging, data-driven pricing, and open houses every weekend until the right buyer signs on the line.",
        image: { src: unsplash("1512917774080-9991f1c4c750", 1920), alt: "Contemporary house with a pool at sunset", width: 1920, height: 1280 },
      },
      {
        dealType: "rent",
        label: "Rent",
        text: "See rentals before they hit the portals. Our advisors know the landlords, the buildings, and the quiet openings, which means better apartments and fewer bidding wars.",
        image: { src: unsplash("1545324418-cc1a3fa10c00", 1920), alt: "Apartment building facade with balconies", width: 1920, height: 1280 },
      },
    ],
    brief: "Certified advisors guide you through every stage of the process",
    briefEm: "with sharp local knowledge and steady, reliable support.",
    cta: { label: "Get Started with HAVEN", action: { type: "modal", modal: "find-properties" } },
  },

  features: {
    title: "Support",
    titleEm: "Beyond Buying and Selling",
    text: "The market never stands still, and neither do we.",
    textEm: "Our specialists stay with you after the closing, helping your investment work harder year after year.",
    cta: { label: "Discover Our Services", action: { type: "link", href: "/services" } },
    items: [
      {
        title: "Mortgage Advisory",
        text: "Flexible financing options matched to your timeline and goals.",
        image: { src: unsplash("1554224155-6726b3ff858f", 1400), alt: "Desk with calculator and documents", width: 1400, height: 1000 },
        cta: { label: "Learn More", action: { type: "link", href: "/services/mortgage" } },
      },
      {
        title: "Property Management",
        text: "We handle tenants, maintenance, and the details so you enjoy the returns.",
        image: { src: unsplash("1460317442991-0ec209397118", 1400), alt: "Row of apartment buildings", width: 1400, height: 1000 },
        cta: { label: "Learn More", action: { type: "link", href: "/services/management" } },
      },
      {
        title: "Development & Construction",
        text: "From zoning to ribbon-cutting, expert guidance for building and developing property.",
        image: { src: unsplash("1541888946425-d81bb19240f5", 1400), alt: "Construction site with cranes at dawn", width: 1400, height: 1000 },
        cta: { label: "Learn More", action: { type: "link", href: "/services/development" } },
      },
    ],
  },

  posts: {
    title: "Blog &",
    titleEm: "Resources",
    text: "Market reads, neighborhood guides, and lessons from a few thousand closings.",
    cta: { label: "Visit Our Blog", action: { type: "link", href: "/blog" } },
    items: [
      {
        date: "2026-08-28",
        title: "Q3 2026 Market Snapshot: Where Prices Held and Where They Moved",
        excerpt: "Inventory tightened downtown while the outer neighborhoods saw the first meaningful price cuts in two years. Here's what it means for fall.",
        image: { src: unsplash("1496442226666-8d4d0e62e6e9", 1400), alt: "City skyline at golden hour", width: 1400, height: 1000 },
        href: "/blog/q3-2026-market-snapshot",
        readMoreLabel: "Read More",
      },
      {
        date: "2026-07-15",
        title: "Rent or Buy in 2026? A Straightforward Way to Run the Numbers",
        excerpt: "Forget the rules of thumb. A five-minute framework that accounts for rates, time horizon, and how long you actually plan to stay.",
        image: { src: unsplash("1560518883-ce09059eeffa", 1400), alt: "Keys handed over in front of a new home", width: 1400, height: 1000 },
        href: "/blog/rent-or-buy-2026",
        readMoreLabel: "Read More",
      },
      {
        date: "2026-06-02",
        title: "Five Questions to Ask Before You Renovate a Pre-War Apartment",
        excerpt: "Board approvals, wet-over-dry rules, and the one line item that blows most budgets. What to know before the first wall comes down.",
        image: { src: unsplash("1600210492486-724fe5c67fb0", 1400), alt: "Renovated apartment with exposed brick", width: 1400, height: 1000 },
        href: "/blog/pre-war-renovation-questions",
        readMoreLabel: "Read More",
      },
    ],
  },

  outro: {
    title: "Your Move.",
    titleEm: "We'll Make Sure It Lands.",
    cta: { label: "Let's Get Started", action: { type: "modal", modal: "contact" } },
    background: {
      src: unsplash("1477959858617-67f85cf4f1df", 2400),
      alt: "City lights at night from above",
      width: 2400,
      height: 1400,
    },
  },

  footer: {
    newsletter: {
      title: "Subscribe to our Newsletter!",
      placeholder: "Enter address",
      submitLabel: "Subscribe",
      successText: "You're on the list.",
    },
    quickLinks: [
      { label: "Search", href: "/search" },
      { label: "Agents", href: "/agents" },
      { label: "Join", href: "/join" },
      { label: "About Us", href: "/about" },
      { label: "Advisor Portal", href: "/sign-in" },
    ],
    socials: [
      { label: "Facebook", href: "https://facebook.com", external: true },
      { label: "Instagram", href: "https://instagram.com", external: true },
      { label: "YouTube", href: "https://youtube.com", external: true },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
    ],
    contact: {
      officeLabel: "Head Office",
      office: ["120 Example Avenue, 9th Floor,", "New York, NY 10001"],
      emailLabel: "Email Us",
      email: "hello@haven.example",
      phoneLabel: "Call Us",
      phone: "+1 212 555 0148",
    },
    legal: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Fair Housing Notice", href: "/legal/fair-housing" },
      { label: "Reasonable Accommodation Notice", href: "/legal/accommodation" },
      { label: "Standard Operating Procedures", href: "/legal/procedures" },
      { label: "Press", href: "/press" },
    ],
    notices: ["Housing Choice Vouchers Welcome", "Equal Housing Opportunity"],
    copyright: "Copyright © 2026",
  },

  modals: {
    findProperties: {
      title: "Find properties",
      description: "Tell us what you're looking for. An advisor will reach out within one business day.",
      dealTypes: [
        { value: "buy", label: "Buy" },
        { value: "rent", label: "Rent" },
        { value: "sell", label: "Sell" },
      ],
      fields: [
        { name: "name", label: "Full Name", placeholder: "Your name", type: "text", required: true, colSpan: 6 },
        { name: "email", label: "Email Address", placeholder: "Enter your email", type: "email", required: true, colSpan: 6 },
        { name: "phone", label: "Phone Number", placeholder: "+1 (000) 000-0000", type: "tel", required: true, colSpan: 6 },
        { name: "location", label: "Neighborhood or City", placeholder: "Where are you looking?", type: "text", required: true, colSpan: 6 },
        { name: "budget", label: "Budget", placeholder: "Select a range", type: "select", options: ["Under $500k", "$500k – $1M", "$1M – $2M", "$2M – $5M", "$5M+", "Renting: under $3k/mo", "Renting: $3k – $6k/mo", "Renting: $6k+/mo"], colSpan: 12 },
        { name: "message", label: "Anything else?", placeholder: "Bedrooms, timing, must-haves…", type: "textarea", colSpan: 12 },
      ],
      submitLabel: "Send request",
      successTitle: "Request received.",
      successText: "An advisor will be in touch within one business day.",
    },
    contact: {
      title: "Contact Us",
      description: "Questions, ideas, or just want to talk it through? We're here.",
      fields: [
        { name: "email", label: "Email Address", placeholder: "Enter your email", type: "email", required: true, colSpan: 6 },
        { name: "phone", label: "Phone Number", placeholder: "+1 (000) 000-0000", type: "tel", required: true, colSpan: 6 },
        { name: "message", label: "Message", placeholder: "Write your message", type: "textarea", required: true, colSpan: 12 },
      ],
      submitLabel: "Send",
      successTitle: "Message sent.",
      successText: "Thanks for reaching out. We'll reply shortly.",
    },
    agentJoin: {
      title: "Join the Team",
      description: "Tell us a little about yourself and we'll set up a conversation.",
      fields: [
        { name: "name", label: "Full Name", placeholder: "Your name", type: "text", required: true, colSpan: 6 },
        { name: "email", label: "Email Address", placeholder: "Enter your email", type: "email", required: true, colSpan: 6 },
        { name: "phone", label: "Phone Number", placeholder: "+1 (000) 000-0000", type: "tel", required: true, colSpan: 6 },
        { name: "market", label: "Market", placeholder: "Select a market", type: "select", options: ["New York City", "Jersey City", "Philadelphia", "Miami", "Austin", "Other"], colSpan: 6 },
        { name: "experience", label: "Experience", placeholder: "Select", type: "select", options: ["New to real estate", "1–3 years", "3–7 years", "7+ years"], colSpan: 12 },
        { name: "message", label: "Anything else?", placeholder: "Tell us about your goals", type: "textarea", colSpan: 12 },
      ],
      submitLabel: "Apply",
      successTitle: "Application received.",
      successText: "A team lead will reach out to schedule a conversation.",
    },
  },
};

export default site;
