"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return (
			<button
				type="button"
				aria-label="Toggle dark mode"
				className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700"
				style={{ visibility: "hidden" }}
			/>
		);
	}

	const isDark = (resolvedTheme ?? theme) === "dark";

	return (
		<button
			type="button"
			aria-label="Toggle dark mode"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			{isDark ? "Light" : "Dark"}
		</button>
	);
}


