import HeroSection from '../components/landing/HeroSection';
import ServiceCards from '../components/landing/ServiceCards';
import MentorShowcase from '../components/landing/MentorShowcase';
import StatsSection from '../components/landing/StatsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import SEOHead from '../components/SEOHead';

export default function HomePage() {
  return (
    <>
      <SEOHead title="Career Development | 커리어 개발 플랫폼" description="멘토링, 코스, 가이드를 통한 체계적인 커리어 개발 플랫폼" />
      <HeroSection />
      <ServiceCards />
      <MentorShowcase />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
