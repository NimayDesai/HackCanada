'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className="relative"
		>
			<Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 ease-in-out transform dark:rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 ease-in-out transform rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
