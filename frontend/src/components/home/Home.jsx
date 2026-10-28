import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from '../shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect recruiter to admin companies page if they land on home
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
