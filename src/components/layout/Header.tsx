"use client";

/**
 * Sticky site header.
 *
 * States (all driven by a rAF-throttled window scroll listener — Lenis drives native
 * scrolling, so plain scroll events are the cheapest source of truth):
 *   • transparent while the page sits at the top of a full-bleed hero
 *   • opaque white once scrolled ("fixed")
 *   • translated out of view while scrolling down, back in while scrolling up ("hidden")
 *   • an open dropdown / burger cancels "hidden" and forces the opaque background
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import type { BrandContent, NavItem } from "@/content/types";
import { BurgerButton } from "./BurgerButton";
import { BurgerMenu } from "./BurgerMenu";
import { DropMenu } from "./DropMenu";
import navStyles from "./nav.module.css";
import styles from "./Header.module.css";

/** Below this the bar always stays put — it must not flick away on the first nudge. */
const HIDE_AFTER = 160;
/** Ignore scroll jitter smaller than this so the bar does not stutter. */
const MIN_DELTA = 4;

const MENU_ID = "site-menu";

export function Header({ brand, nav }: { brand: BrandContent; nav: NavItem[] }) {
  const pathname = usePathname();
  /** Only the home page puts a full-bleed hero behind the header. */
  const overHero = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  const anyOpen = menuOpen || openDrop !== null;

  useEffect(() => {
    let frame = 0;
    let last = window.scrollY;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - last;
      if (Math.abs(delta) >= MIN_DELTA) {
        setHidden(delta > 0 && y > HIDE_AFTER);
        last = y;
      }
      if (y <= HIDE_AFTER) setHidden(false);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Never leave a panel stranded across the breakpoint. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => (mq.matches ? setMenuOpen(false) : setOpenDrop(null));
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={clsx(
        styles.wrapper,
        overHero && styles.transparent,
        scrolled && styles.fixed,
        hidden && !anyOpen && styles.hidden,
        anyOpen && styles.opened,
      )}
    >
      <Container>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link href="/" onClick={closeMenu}>
              <Wordmark title={brand.name} />
            </Link>
          </div>

          <nav className={styles.nav} aria-label={`${brand.name} primary`}>
            <ul className={styles.navList}>
              {nav.map((item) => (
                <li key={item.label}>
                  {item.children?.length ? (
                    <DropMenu
                      item={item}
                      open={openDrop === item.label}
                      onOpenChange={(next) =>
                        setOpenDrop((current) => (next ? item.label : current === item.label ? null : current))
                      }
                    />
                  ) : (
                    <Link className={navStyles.item} href={item.href ?? "#"}>
                      <span className={navStyles.label}>
                        <span data-text={item.label}>{item.label}</span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button label={brand.signIn.label} action={brand.signIn.action} />
          </div>

          <BurgerButton
            className={styles.burgerControl}
            controls={MENU_ID}
            open={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </Container>

      <BurgerMenu id={MENU_ID} brand={brand} nav={nav} open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
