import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ThemeProvider from "../components/ThemeProvider";
import LastVisitedRedirect from "../components/LastVisitedRedirect";

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
          <LastVisitedRedirect />
          <Header studentNumber="Muhammad Raihan Zulfi 22586503 " />
          <main className="min-h-screen p-6 text-gray-900 dark:text-gray-100">{children}</main>
          <Footer studentName="Raihan Zulfi" studentNumber="22586503" />
        </ThemeProvider>
      </body>
    </html>
  );
}
