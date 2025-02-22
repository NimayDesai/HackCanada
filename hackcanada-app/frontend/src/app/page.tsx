'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
	return (
		<div className="min-h-screen mt-20 flex flex-col items-center relative overflow-hidden">
			{/* Main Content */}

			<div className="rounded-[2rem] bg-lime-200 px-24 pb-24 pt-16">
				<h1 className="text-6xl font-medium text gray-950">
				Personalized Meal Plan Generator
			</h1>
			<p className="mt-5 text-lg text-gray-700 dark:text-gray-300">
				Create custom meal plans tailored to your dietary needs and preferences.
			</p>
			<div className = "mt-10 flex gap-6">
				<Button className="rounded-full bg-lime-600 px-4 py-3 text-base/4 font-medium text-white shadow-md">
					Get Started
				</Button>
				<Button className="rounded-full bg-white/15 px-4 py-3 text-base/4 font-medium text-gray-950 shadow-md">
					Learn More
				</Button>
			</div>
			</div>

			<h1 className = "mt-20 text-4xl font-medium text gray-950">
				Why NutriMind?
			</h1>

			<div className="relative px-10 py-16">
			<div className="rounded-[2rem] inset-x-2 top-48 bottom-0 bg-lime-200 px-24 pb-24 pt-16">
				<div className="mx-auto max-w-7xl">
					<div className="flow-root">
					<div className = "-m-2 grid grid-cols-3 gap-4">
					<FeatureCard />
					<FeatureCard />
					<FeatureCard />
					</div>
				</div>
				</div>
				</div>
			</div>

		</div>	
	);
}

function FeatureCard() {
	return (
		<div className="rounded-[2rem] p-2 ring ring-lime-500/10 shadow-md shadow-black/5">
		<div className ="rounded-3xl bg-white p-10 pb-9">
		<h2 className = "text-3xl">Feature 1</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		<p className = ""></p>
	</div>
	</div>
	)
}