'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
}

export default function Home() {
  const whyNutriMindRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleScrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
	if (ref.current) {
	  ref.current.scrollIntoView({ behavior: 'smooth' });
	}
  };

  return (
    <div className="w-[106%] -ml-9 min-h-screen mt-6 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-lime-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="rounded-[2rem] px-16 pb-20 pt-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight pt-10">
          Personalized Meal Planning, Simplified
        </h1>
        <p className="mt-5 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          AI-driven meal plans tailored to your dietary needs, fitness goals, and budget.
        </p>
        <div className="mt-10 flex gap-6 justify-center">
          <Button className="rounded-full bg-lime-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-lime-700 transition duration-300">
            Get Started
          </Button>
          <Button className="rounded-full border-2 border-gray-900 dark:border-gray-100 px-8 py-4 text-lg font-semibold text-white dark:text-gray-100 hover:bg-gray-700 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition duration-300" onClick={() => handleScrollToSection(whyNutriMindRef)}>
            Learn More
          </Button>
        </div>
      </div>

      {/* Why NutriMind Section */}
      <h1 ref={whyNutriMindRef} className="mt-24 text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
        Why Choose NutriMind?
      </h1>
      <div className="relative px-5 py-16 w-full max-w-7xl">
        <div className="rounded-[2rem] bg-white dark:bg-gray-800 px-12 pb-16 pt-12 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard  
            title="Smart AI Meal Planning"  
            description="Personalized meal plans based on your dietary preferences, cultural background, allergies, and fitness goals."  
          />  
          <FeatureCard  
            title="Effortless Grocery Budgeting"  
            description="Optimize your grocery list with cost-effective meal suggestions to stay within budget while eating healthy."  
          />  
          <FeatureCard  
            title="Easy Meal Logging"  
            description="Snap a pic of your meals and let AI track your nutrition seamlessly—no manual input needed."  
          />  
        </div>
      </div>

      {/* How It Works Section */}
      <h1 ref={howItWorksRef} className="mt-24 text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
        How It Works
      </h1>
      <div className="relative px-5 py-16 w-full max-w-7xl">
        <div className="rounded-[2rem] bg-lime-200 dark:bg-gray-700 px-12 pb-16 pt-12 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard title="1. Set Preferences" description="Enter your dietary restrictions, cultural preferences, and fitness goals." />
          <FeatureCard title="2. Receive a Custom Plan" description="Get a tailored meal plan with budget-conscious and nutritious recipes." />
          <FeatureCard title="3. Track & Adjust" description="Easily log meals and let AI refine your recommendations over time." />
        </div>
      </div>

      {/* Testimonials Section */}
      <h1 className="mt-24 text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
        What Our Users Say
      </h1>
      <div className="relative px-5 py-16 w-full max-w-7xl">
        <div className="rounded-[2rem] bg-white dark:bg-gray-800 px-12 pb-16 pt-12 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <Testimonial text="NutriMind transformed how I eat! I'm healthier and saving money!" name="- Sarah M." />
          <Testimonial text="AI-powered tracking makes staying on top of my nutrition effortless." name="- John D." />
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="mt-24 text-center pb-20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Start Your Nutrition Journey Today</h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Join thousands transforming their health with NutriMind. Get started now!
        </p>
        <Button className="mt-6 rounded-full bg-lime-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-lime-700 transition duration-300">
          Get Started
        </Button>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-[2rem] p-6 bg-white dark:bg-gray-700 shadow-lg transition-transform transform hover:scale-105">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

function Testimonial({ text, name }: { text: string; name: string }) {
  return (
    <div className="rounded-xl p-6 bg-gray-50 dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105">
      <p className="text-lg italic text-gray-800 dark:text-gray-200">"{text}"</p>
      <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100">{name}</p>
    </div>
  );
}
