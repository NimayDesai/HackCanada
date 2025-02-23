// eslint-disable-file no-implicit-any
"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
//import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface FeatureCardProps {
  title: string;
  description: string;
}

export default function Home() {
  const whyNutriMindRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-[107%] -ml-9 min-h-screen mt-6 flex flex-col items-center overflow-x-hidden bg-gradient-to-b from-lime-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section with Animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mt-20 py-10 px-6 max-w-4xl"
      >
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
          Personalized Meal Planning, Simplified
        </h1>
        <p className="mt-5 text-lg text-gray-700 dark:text-gray-300">
          AI-driven meal plans tailored to your dietary needs, fitness goals,
          and budget.
        </p>
        <div className="mt-10 flex gap-6 justify-center">
          <Button className="rounded-full bg-lime-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-lime-700 transition transform hover:scale-105">
            Get Started
          </Button>
          <Button
            className="rounded-full px-8 py-4 text-lg bg-gray-700 dark:bg-gray-100 font-semibold text-gray-100 dark:text-gray-800 hover:bg-gray-900 dark:hover:bg-gray-300 transition"
            onClick={() => handleScrollToSection(whyNutriMindRef)}
          >
            Learn More
          </Button>
        </div>
      </motion.section>

      {/* Why NutriMind */}
      <SectionTitle ref={whyNutriMindRef}>Why Choose NutriMind?</SectionTitle>
      <FeatureGrid>
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
      </FeatureGrid>

      {/* How It Works with Flexbox Layout */}
      <SectionTitle ref={howItWorksRef}>How It Works</SectionTitle>
      <div className="flex gap-6 px-6 max-w-6xl mx-auto py-16">
        <FeatureCard
          title="1. Set Preferences"
          description="Enter your dietary restrictions, cultural preferences, and fitness goals."
        />
        <FeatureCard
          title="2. Receive a Custom Plan"
          description="Get a tailored meal plan with budget-conscious and nutritious recipes."
        />
        <FeatureCard
          title="3. Track & Adjust"
          description="Easily log meals and let AI refine your recommendations over time."
        />
      </div>

      {/* Testimonials */}
      <SectionTitle>What Our Users Say</SectionTitle>
      <FeatureGrid>
        <Testimonial
          text="NutriMind transformed how I eat! I'm healthier and saving money!"
          name="- Mark A."
        />
        <Testimonial
          text="AI-powered tracking makes staying on top of my nutrition effortless."
          name="- Edward L."
        />
        <Testimonial
          text="The meal suggestions are tailored to my goals. I feel great and save time!"
          name="- Jessica P."
        />
      </FeatureGrid>

      {/* Final CTA with Pulse Effect */}
      <section className="text-center py-20 px-6 max-w-4xl">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Start Your Nutrition Journey Today
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Join thousands transforming their health with NutriMind. Get started
          now!
        </p>
        <Button className="mt-6 rounded-full bg-lime-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-lime-700 transition transform hover:scale-105 pulse-btn">
          Get Started
        </Button>
      </section>
    </div>
  );
}

const SectionTitle = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.Ref<HTMLHeadingElement>;
}) => (
  <h2
    ref={ref}
    className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mt-24"
  >
    {children}
  </h2>
);

const FeatureGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto py-16">
    {children}
  </div>
);

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl p-6 bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 text-center">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
}

function Testimonial({ text, name }: { text: string; name: string }) {
  return (
    <div className="rounded-xl p-6 bg-gray-50 dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105">
      <p className="text-lg italic text-gray-800 dark:text-gray-200">{text}</p>
      <p className="mt-4 font-semibold text-gray-900 dark:text-gray-100">
        {name}
      </p>
    </div>
  );
}
