import HeroSection from '../components/landing/HeroSection';
import ServiceCards from '../components/landing/ServiceCards';
import MentorShowcase from '../components/landing/MentorShowcase';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiceCards />
      <MentorShowcase />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
