"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
	studentNumber: string;
};

export default function Header({ studentNumber }: HeaderProps) {
	const pathname = usePathname();

	const navItems = [
		{ href: "/", label: "Tabs" },
		{ href: "/about", label: "About" },
		{ href: "/escape-room", label: "Escape Room" },
		{ href: "/coding-races", label: "Coding Races" },
		{ href: "/court-room", label: "Court Room" },
	];

	return (
		<header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
			<span className="text-sm font-semibold" aria-label="Student number">
				{studentNumber}
			</span>
			<nav aria-label="Main navigation" className="flex gap-3 flex-wrap items-center">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 ${
								isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
							}`}
							aria-current={isActive ? "page" : undefined}
						>
							{item.label}
						</Link>
					);
				})}
				<ThemeToggle />
			</nav>
		</header>
	);
}


