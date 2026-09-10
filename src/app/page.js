import Hero from '@/components/home/Hero';
import CategoryTiles from '@/components/home/CategoryTiles';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AboutSection from '@/components/home/AboutSection';
import ContactCTA from '@/components/home/ContactCTA';
import { getFeaturedProducts } from '@/lib/db/queries.js';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <>
      <Hero />
      <CategoryTiles />
      <FeaturedProducts products={featuredProducts} />
      <AboutSection />
      <ContactCTA />
    </>
  );
}
