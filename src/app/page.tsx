import { site } from "@/content/site";
import { Hero } from "@/components/sections/Hero/Hero";
import { WhyUs } from "@/components/sections/WhyUs/WhyUs";
import { Arrows } from "@/components/sections/Arrows/Arrows";
import { Rewired } from "@/components/sections/Rewired/Rewired";
import { ForAgents } from "@/components/sections/ForAgents/ForAgents";
import { Testimonials } from "@/components/sections/Testimonials/Testimonials";
import { Services } from "@/components/sections/Services/Services";
import { Features } from "@/components/sections/Features/Features";
import { LatestPosts } from "@/components/sections/LatestPosts/LatestPosts";
import { Outro } from "@/components/sections/Outro/Outro";

export default function HomePage() {
  return (
    <main>
      <Hero data={site.hero} brand={site.brand} />
      <WhyUs data={site.why} />
      <Arrows data={site.arrows} />
      <Rewired data={site.rewired} />
      <ForAgents data={site.forAgents} />
      <Testimonials data={site.testimonials} />
      <Services data={site.services} />
      <Features data={site.features} />
      <LatestPosts data={site.posts} />
      <Outro data={site.outro} />
    </main>
  );
}
