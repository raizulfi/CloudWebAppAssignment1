type FooterProps = {
	studentName: string;
	studentNumber: string;
};

export default function Footer({ studentName, studentNumber }: FooterProps) {
	return (
		<footer className="px-4 py-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
			<p>
				© {new Date().getFullYear()} {studentName} · {studentNumber} · {new Date().toLocaleDateString()}
			</p>
		</footer>
	);
}


