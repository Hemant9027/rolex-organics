import { Hero } from "../components/home/Hero";
import {
  BrandIntro,
  Categories,
  Marquee,
  Newsletter,
  WhyChoose,
} from "../components/home/Sections";
import {
  BestSellers,
  InteractiveShowcase,
  Story,
  Testimonials,
} from "../components/home/Showcase";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <BrandIntro />
      <Categories />
      <BestSellers />
      <InteractiveShowcase />
      <WhyChoose />
      <Story />
      <Testimonials />
      <Newsletter />
    </>
  );
}
