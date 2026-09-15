# QA checklist (integration pass)

Reference screenshots: `<scratchpad>/ref/shots/` · Local captures: `<scratchpad>/agent-shots/local/`
(produced by `<scratchpad>/pw/shots-local-all.mjs`, same file names as the reference set → compare pairs).

## Build health
- [ ] `npx tsc --noEmit` clean
- [ ] `npx next build` succeeds (run only when no other agent is editing; the dev server may keep running)
- [ ] No console errors / failed requests on `/` (helper output), desktop and mobile
- [ ] No hydration warnings; no "Dialog requires Title" Radix warnings

## Motion system
- [ ] Exactly one Lenis instance; ScrollTrigger updates on Lenis scroll; `ScrollTrigger.refresh()` after images/fonts
- [ ] Hero: pinned for 500vh; intro plays once; scrubbed states at scroll 0 / 600 / 1200 / 1800 / 2400 / 3000 match reference frames (`d-hero-*.png`); next section never overlapped; no jump when the pin releases
- [ ] Every section reveals once when entering the viewport (`start: top 85%`); nothing stays invisible after scrolling past quickly (progressive scroll test)
- [ ] `prefers-reduced-motion: reduce` → all content visible, no smooth scroll, no pinned scrub (emulate with Playwright `reducedMotion: 'reduce'`)
- [ ] Hover states: buttons roll label + scaleX; nav rolling labels; services row photo reveal; features/posts image zoom
- [ ] No layout properties animated on scroll; no per-frame allocations; `will-change` only while animating

## Layout vs reference (desktop 1440 + mobile 390)
- [ ] Header: transparent at top → white after scroll → hides on scroll down/shows on scroll up; dropdowns; burger menu open/close + accordion
- [ ] Each section's type sizes, spacing, and column order match the reference shots within a few px
- [ ] Sections are in the right order with the right backgrounds (white / #f1f1f1 / #151717)
- [ ] Footer: newsletter, contacts, quick links, socials, giant wordmark, legal row
- [ ] Modals open from every CTA (hero, rewired, services rows, services CTA, for-agents, outro, header Sign In is a link); Buy/Rent/Sell preselected from services rows; forms validate; success state; Escape/overlay close; scroll locked while open

## Content & IP
- [ ] All copy comes from `src/content/site.ts`; no text, image, logo, or CSS copied from the reference site (grep for "FIND", "findrealestate", "Michael", "Shirin")
- [ ] Changing `brand.name` + `npm run wordmark` updates header, footer, and hero mask
- [ ] Swapping `hero.house.src` for another image works (masking class still applied)
- [ ] All nav/footer links resolve (catch-all placeholder page renders)

## Accessibility
- [ ] Split headings keep an `aria-label`; decorative images have empty alt where appropriate
- [ ] Keyboard: tab order sane, visible focus, dropdowns/burger/modals operable, Escape closes
- [ ] Color contrast: muted text (#b3b3b3 on white, white/40 on dark) used only for secondary emphasis
