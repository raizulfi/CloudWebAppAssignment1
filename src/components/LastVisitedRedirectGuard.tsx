"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LAST_VISITED_COOKIE = "lastVisited";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function LastVisitedRedirectGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const lastVisited = getCookie(LAST_VISITED_COOKIE);
      const currentPath = window.location.pathname;
      if (
        lastVisited &&
        lastVisited !== currentPath &&
        lastVisited !== "/"
      ) {
        router.replace(lastVisited);
      } else {
        setShowContent(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [router]);

  if (!showContent) {
    // Optionally show a loading spinner or blank screen
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><span>Loading...</span></div>;
  }

  return <>{children}</>;
}
