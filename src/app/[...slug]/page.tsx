import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

/**
 * Catch-all placeholder so every nav/footer link resolves in the prototype.
 * Replace with real routes (e.g. src/app/search/page.tsx) as pages get built.
 *
 * For the static export every internal link found in the content file is pre-rendered here,
 * so the hosted preview has a page behind each menu item.
 */

/** Walk the content object and collect every internal route ("/about", "/join/miami", …). */
function collectInternalRoutes(value: unknown, found = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    const isRoute = value.startsWith("/") && !value.startsWith("//") && value !== "/" && !/\.[a-z0-9]{2,5}$/i.test(value);
    if (isRoute) found.add(value.replace(/\/+$/, ""));
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectInternalRoutes(v, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectInternalRoutes(v, found));
  }
  return found;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return [...collectInternalRoutes(site)].map((route) => ({ slug: route.split("/").filter(Boolean) }));
}

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const title = slug.map((s) => decodeURIComponent(s).replace(/-/g, " ")).join(" / ");

  return (
    <main style={{ minHeight: "70vh", padding: "24rem 0 16rem" }}>
      <Container>
        <p className="t-label" style={{ color: "var(--color-muted)" }}>Placeholder page</p>
        <h1 className="t-h-md" style={{ textTransform: "capitalize", margin: "2rem 0 3rem" }}>{title}</h1>
        <p className="t-lead" style={{ maxWidth: "72rem", marginBottom: "4rem" }}>
          This route exists so navigation works end to end. Swap this file for real content when the page is ready.
        </p>
        <Link href="/" className="t-body" style={{ textDecoration: "underline" }}>
          ← Back to home
        </Link>
      </Container>
    </main>
  );
}
