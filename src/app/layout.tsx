import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Assignment 1",
  description: "Next.js Tabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900 bg-white text-gray-900 dark:text-gray-100">
        <header className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
          <span className="font-bold">Student #123456</span>
          <nav className="flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/tabs">Tabs</Link>
          </nav>
        </header>

        <main className="min-h-screen p-6">{children}</main>

        <footer className="p-4 bg-gray-200 dark:bg-gray-800 text-center">
          <p>
            © 2025 Your Name | Student #123456 |{" "}
            {new Date().toLocaleDateString()}
          </p>
        </footer>
      </body>
    </html>
  );
}
