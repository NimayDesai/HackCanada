'use client';

import { useState } from 'react';

export default function Home() {
	const [dietaryRestrictions, setDietaryRestrictions] = useState('');
	const [allergies, setAllergies] = useState('');
	const [fitnessGoals, setFitnessGoals] = useState('');

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Dietary Restrictions:', dietaryRestrictions);
		console.log('Allergies:', allergies);
		console.log('Fitness Goals:', fitnessGoals);
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative overflow-hidden">
			{/* Main Content */}
			<div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xl z-10">
				<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
					Personalized Meal Plan Generator
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Dietary Restrictions */}
					<div>
						<label
							htmlFor="dietary-restrictions"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Dietary Restrictions
						</label>
						<select
							id="dietary-restrictions"
							value={dietaryRestrictions}
							onChange={(e) => setDietaryRestrictions(e.target.value)}
							className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
						>
							<option value="">Select...</option>
							<option value="vegetarian">Vegetarian</option>
							<option value="gluten-free">Gluten-Free</option>
							<option value="vegan">Vegan</option>
							<option value="paleo">Paleo</option>
							<option value="keto">Keto</option>
							<option value="none">None</option>
						</select>
					</div>

					{/* Allergies */}
					<div>
						<label
							htmlFor="allergies"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Allergies
						</label>
						<select
							id="allergies"
							value={allergies}
							onChange={(e) => setAllergies(e.target.value)}
							className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
						>
							<option value="">Select...</option>
							<option value="nuts">Nuts</option>
							<option value="dairy">Dairy</option>
							<option value="shellfish">Shellfish</option>
							<option value="gluten">Gluten</option>
							<option value="eggs">Eggs</option>
							<option value="none">None</option>
						</select>
					</div>

					{/* Fitness Goals */}
					<div>
						<label
							htmlFor="fitness-goals"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Fitness Goals
						</label>
						<select
							id="fitness-goals"
							value={fitnessGoals}
							onChange={(e) => setFitnessGoals(e.target.value)}
							className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
						>
							<option value="">Select...</option>
							<option value="weight-loss">Weight Loss</option>
							<option value="muscle-gain">Muscle Gain</option>
							<option value="maintain">Maintain</option>
						</select>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full h-12 bg-lime-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
					>
						Generate Meal Plan
					</button>
				</form>
			</div>
		</div>
	);
}
