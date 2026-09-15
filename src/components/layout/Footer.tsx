"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Container } from "@/components/ui/Container";
import { ArrowIcon } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { useGSAP } from "@/lib/gsap";
import { fadeUpOnScroll } from "@/lib/motion";
import type { BrandContent, FooterContent, LinkItem } from "@/content/types";
import styles from "./Footer.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FooterLink({ item, className, children }: { item: LinkItem; className?: string; children?: ReactNode }) {
  const content = children ?? item.label;
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  );
}

/** Site footer: newsletter + contacts, quick links + socials, wordmark, legal row. */
export function Footer({ brand, data }: { brand: BrandContent; data: FooterContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  useGSAP(
    () => {
      if (innerRef.current) fadeUpOnScroll(innerRef.current, { trigger: rootRef.current ?? innerRef.current });
    },
    { scope: rootRef },
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <footer className={styles.root} data-theme="dark" ref={rootRef}>
      <Container>
        <div className={styles.inner} data-reveal ref={innerRef}>
          <div className={styles.topRow}>
            <div className={styles.leftCol}>
              <div className={styles.newsletter}>
                <h3 className={styles.newsletterTitle}>{data.newsletter.title}</h3>
                {status === "success" ? (
                  <p className={styles.successText}>{data.newsletter.successText}</p>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={clsx(styles.inputWrap, status === "error" && styles.inputError)}>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder={data.newsletter.placeholder}
                        aria-label={data.newsletter.placeholder}
                        className={styles.input}
                      />
                      <button type="submit" aria-label={data.newsletter.submitLabel} className={styles.submitBtn}>
                        <ArrowIcon />
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className={styles.contacts}>
                <div className={styles.contact}>
                  <span className={styles.contactLabel}>{data.contact.officeLabel}</span>
                  <div className={styles.contactValue}>
                    {data.contact.office.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                </div>
                <div className={clsx(styles.contact, styles.contactEmail)}>
                  <span className={styles.contactLabel}>{data.contact.emailLabel}</span>
                  <a className={styles.contactValue} href={`mailto:${data.contact.email}`}>
                    {data.contact.email}
                  </a>
                </div>
                <div className={styles.contact}>
                  <span className={styles.contactLabel}>{data.contact.phoneLabel}</span>
                  <a className={styles.contactValue} href={`tel:${data.contact.phone.replace(/[^\d+]/g, "")}`}>
                    {data.contact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.rightCol}>
              <nav className={styles.quickLinks} aria-label="Quick links">
                {data.quickLinks.map((item) => (
                  <FooterLink key={item.label} item={item} className={styles.navLink}>
                    <span data-text={item.label}>{item.label}</span>
                  </FooterLink>
                ))}
              </nav>
              <div className={styles.socials}>
                {data.socials.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.logoRow}>
            <Wordmark title={brand.name} className={styles.logo} />
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.legalWrap}>
              {data.legal.map((item) => (
                <FooterLink key={item.label} item={item} className={styles.legalLink} />
              ))}
              {data.notices.map((notice) => (
                <span key={notice}>{notice}</span>
              ))}
            </div>
            <div className={styles.metaWrap}>
              <span>{brand.legalName}</span>
              <span>{data.copyright}</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
