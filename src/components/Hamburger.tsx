"use client";

import { useId, useEffect } from "react";

type Props = {
	label?: string;
	open: boolean;
	onToggle: (open: boolean) => void;
};

export default function Hamburger({ label = "Menu", open, onToggle }: Props) {
	const menuId = useId();

	return (
		<button
			type="button"
			aria-label={label}
			aria-expanded={open}
			aria-controls={menuId}
			onClick={() => onToggle(!open)}
			className="relative h-8 w-10 rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
		>
			<span aria-hidden className="sr-only">{label}</span>
			<div
				className={`transition-transform duration-300 ease-in-out ${open ? "rotate-45" : "rotate-0"}`}
			>
				<div className={`h-0.5 w-6 bg-current transition-all ${open ? "translate-y-1.5" : "-translate-y-1.5"}`} />
				<div className={`h-0.5 w-6 bg-current my-1 transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
				<div className={`h-0.5 w-6 bg-current transition-all ${open ? "-translate-y-1.5 -rotate-90" : "translate-y-1.5"}`} />
			</div>
		</button>
	);
}


