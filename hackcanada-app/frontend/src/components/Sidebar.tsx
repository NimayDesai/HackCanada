import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MapPin, Apple, LayoutDashboard, User, Settings, Home } from 'lucide-react';

const sidebarItems = [
	{ href: '/', icon: Home, label: 'Home' },
	{ href: '/mealplan', icon: Apple, label: 'Meal Plan' },
	{ href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
	{ href: '/map', icon: MapPin, label: 'Map' },
	{ href: '/login', icon: User, label: 'Login' }
];

interface SidebarProps {
	open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-20 text-gray-800 dark:text-gray-100 w-64 fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
				open ? 'translate-x-0' : '-translate-x-full'
			} lg:translate-x-0`}
		>
			<nav className="h-full flex flex-col justify-between">
				<div className="px-4 py-6 space-y-8">
					{sidebarItems.map((item) => (
						<Link key={item.href} href={item.href} passHref>
							<Button
								variant={pathname === item.href ? 'secondary' : 'ghost'}
								className={`w-full justify-start py-3 ${
									pathname === item.href
										? 'bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200'
										: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-700'
								}`}
							>
								<item.icon className="mr-3 h-5 w-5" />
								<span className="text-base">{item.label}</span>
							</Button>
						</Link>
					))}
				</div>
				<div className="p-4 border-t border-gray-200 dark:border-gray-700">
					<Link href="/settings" passHref>
						<Button
							variant={pathname === '/settings' ? 'secondary' : 'outline'}
							className={`w-full py-3 ${
								pathname === '/settings'
									? 'bg-green-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200'
									: 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
							}`}
						>
							<Settings className="mr-3 h-5 w-5" />
							<span className="text-base">Settings</span>
						</Button>
					</Link>
				</div>
			</nav>
		</aside>
	);
}
