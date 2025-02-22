'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
});

const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
});

export default function TabsDemo() {
	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const signupForm = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	function onLoginSubmit(values: z.infer<typeof loginSchema>) {
		console.log('Login:', values);
	}

	function onSignupSubmit(values: z.infer<typeof signupSchema>) {
		console.log('Signup:', values);
	}

	return (
		<div className="flex h-screen justify-center items-center content-center place-content-center mt-100">
			<Tabs
				defaultValue="login"
				className="w-[400px] justify-center items-center"
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Login</TabsTrigger>
					<TabsTrigger value="signup">Sign Up</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
						<Card className="mx-auto max-w-sm">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl font-bold">Login</CardTitle>
								<CardDescription>
									Enter your email and password to login to your account
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											{...loginForm.register('email')}
											placeholder="user@example.com"
											type="email"
										/>
										{loginForm.formState.errors.email && (
											<p className="text-red-500">
												{loginForm.formState.errors.email.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Input
											{...loginForm.register('password')}
											type="password"
										/>
										{loginForm.formState.errors.password && (
											<p className="text-red-500">
												{loginForm.formState.errors.password.message}
											</p>
										)}
									</div>
									<Button type="submit" className="w-full bg-lime-700">
										<div className="text-white">Login</div>
									</Button>
								</div>
							</CardContent>
						</Card>
					</form>
				</TabsContent>
				<TabsContent value="signup">
					<form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
						<Card className="mx-auto max-w-sm">
							<CardHeader className="space-y-1">
								<CardTitle className="text-2xl font-bold">
									Create An Account
								</CardTitle>
								<CardDescription>
									Enter your email and password to make an account
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											{...signupForm.register('email')}
											placeholder="user@example.com"
											type="email"
										/>
										{signupForm.formState.errors.email && (
											<p className="text-red-500">
												{signupForm.formState.errors.email.message}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Input
											{...signupForm.register('password')}
											type="password"
										/>
										{signupForm.formState.errors.password && (
											<p className="text-red-500">
												{signupForm.formState.errors.password.message}
											</p>
										)}
									</div>
									<Button type="submit" className="w-full bg-lime-700">
										Sign Up
									</Button>
								</div>
							</CardContent>
						</Card>
					</form>
				</TabsContent>
			</Tabs>
		</div>
	);
}
