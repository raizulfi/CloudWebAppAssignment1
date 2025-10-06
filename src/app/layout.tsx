import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <Header studentNumber="Student #123456" />
          <div id="primary-menu-drawer" className="md:hidden hidden border-b border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col p-3 gap-2">
              <a href="/" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Tabs</a>
              <a href="/about" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">About</a>
              <a href="/escape-room" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Escape Room</a>
              <a href="/coding-races" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Coding Races</a>
              <a href="/court-room" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Court Room</a>
            </nav>
          </div>
          <main className="min-h-screen p-6 text-gray-900 dark:text-gray-100">{children}</main>
          <Footer studentName="Your Name" studentNumber="Student #123456" />
        </ThemeProvider>
      </body>
    </html>
  );
}
