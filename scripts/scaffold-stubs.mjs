// One-off scaffold: writes compiling placeholder components so the page renders end-to-end
// before the section agents replace each file. Never overwrites an existing file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const write = (rel, content) => {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) { console.log("skip (exists)", rel); return; }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log("wrote", rel);
};

const section = (name, contentKey, title) => `"use client";

import { Container } from "@/components/ui/Container";
import type { ${title}Content${name === "Hero" ? ", BrandContent" : ""} } from "@/content/types";

/** STUB — replaced by the ${name} section agent. */
export function ${name}({ data${name === "Hero" ? ", brand" : ""} }: { data: ${title}Content${name === "Hero" ? "; brand: BrandContent" : ""} }) {${name === "Hero" ? "\n  void brand;" : ""}
  return (
    <section style={{ padding: "10rem 0" }} data-section="${contentKey}">
      <Container>
        <p style={{ fontSize: "1.3rem", opacity: 0.5 }}>${name} section (stub)</p>
        <pre style={{ fontSize: "1.2rem", whiteSpace: "pre-wrap" }}>{JSON.stringify(data, null, 1).slice(0, 400)}</pre>
      </Container>
    </section>
  );
}
`;

const sections = [
  ["Hero", "hero", "Hero"],
  ["WhyUs", "why", "Why"],
  ["Arrows", "arrows", "Arrows"],
  ["Rewired", "rewired", "Rewired"],
  ["ForAgents", "forAgents", "ForAgents"],
  ["Testimonials", "testimonials", "Testimonials"],
  ["Services", "services", "Services"],
  ["Features", "features", "Features"],
  ["LatestPosts", "posts", "Posts"],
  ["Outro", "outro", "Outro"],
];
for (const [name, key, title] of sections) write(`src/components/sections/${name}/${name}.tsx`, section(name, key, title));

write(
  "src/components/layout/Header.tsx",
  `"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { BrandContent, NavItem } from "@/content/types";

/** STUB — replaced by the header/nav agent. */
export function Header({ brand, nav }: { brand: BrandContent; nav: NavItem[] }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, height: "var(--header-height)", display: "flex", alignItems: "center" }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Link href="/" style={{ fontWeight: 700, letterSpacing: "-0.04em", fontSize: "2.4rem" }}>{brand.name}</Link>
        <nav style={{ display: "flex", gap: "3rem", fontSize: "1.3rem", fontWeight: 500 }}>
          {nav.map((item) => (item.href ? <Link key={item.label} href={item.href}>{item.label}</Link> : <span key={item.label}>{item.label} ▾</span>))}
        </nav>
        <Button label={brand.signIn.label} action={brand.signIn.action} />
      </Container>
    </header>
  );
}
`,
);

write(
  "src/components/layout/Footer.tsx",
  `import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { BrandContent, FooterContent } from "@/content/types";

/** STUB — replaced by the footer agent. */
export function Footer({ brand, data }: { brand: BrandContent; data: FooterContent }) {
  return (
    <footer style={{ background: "var(--color-dark)", color: "#fff", padding: "8rem 0" }}>
      <Container>
        <div style={{ fontWeight: 700, fontSize: "2.4rem", marginBottom: "3rem" }}>{brand.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem", fontSize: "1.3rem" }}>
          {data.columns.map((col) => (
            <div key={col.title}>
              <div style={{ opacity: 0.5, marginBottom: "1.5rem" }}>{col.title}</div>
              {col.links.map((l) => (
                <div key={l.label}><Link href={l.href}>{l.label}</Link></div>
              ))}
            </div>
          ))}
        </div>
        <p style={{ marginTop: "4rem", fontSize: "1.2rem", opacity: 0.5 }}>{data.copyright}</p>
      </Container>
    </footer>
  );
}
`,
);

const modal = (name, key, extraProps = "", extraType = "") => `"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { site } from "@/content/site";${extraType}

/** STUB — replaced by the modals agent (Radix Dialog + form styled like the design). */
export function ${name}({ open, onOpenChange${extraProps} }: { open: boolean; onOpenChange: (open: boolean) => void${extraProps ? "; dealType?: DealType" : ""} }) {
  const content = site.modals.${key};
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 100 }} />
        <Dialog.Content data-lenis-prevent style={{ position: "fixed", zIndex: 101, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", color: "#000", padding: "4rem", borderRadius: "2rem", width: "min(90vw, 64rem)" }}>
          <Dialog.Title style={{ fontSize: "2.4rem", fontWeight: 500 }}>{content.title}</Dialog.Title>
          <Dialog.Description style={{ opacity: 0.6, fontSize: "1.4rem" }}>{content.description}</Dialog.Description>
          <Dialog.Close asChild>
            <button style={{ marginTop: "2rem", fontSize: "1.3rem" }}>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
`;
write("src/components/modals/FindPropertiesModal.tsx", modal("FindPropertiesModal", "findProperties", ", dealType", `\nimport type { DealType } from "@/content/types";`));
write("src/components/modals/ContactModal.tsx", modal("ContactModal", "contact"));
write("src/components/modals/AgentJoinModal.tsx", modal("AgentJoinModal", "agentJoin"));

console.log("done");
