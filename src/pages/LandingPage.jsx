// Landing page rediseñada estilo Udemy con componentes ampliados visualmente

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FeaturedCoursesSlider from "../components/landing/FeaturedCoursesSlider";
import BenefitsSection from "../components/landing/BenefitsSection";
import CallToAction from "../components/landing/CallToAction";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  const { api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [api]);

  return (
    <div className="bg-white">
      <Navbar />
      <HeroSection />
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        <FeaturedCoursesSlider courses={courses} />
        <BenefitsSection />
        <TestimonialsSection />
        <CallToAction />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
