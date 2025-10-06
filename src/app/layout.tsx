import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
        <Header studentNumber="Student #123456" />
        <main className="min-h-screen p-6">{children}</main>
        <Footer studentName="Your Name" studentNumber="Student #123456" />
      </body>
    </html>
  );
}
