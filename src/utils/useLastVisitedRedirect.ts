"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function useLastVisitedRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    // run only once per mount to avoid redirect loops
    if (ranRef.current) return;
    ranRef.current = true;

    try {
      const cookies = document.cookie ? document.cookie.split(";").map((c) => c.trim()) : [];
      const lastCookie = cookies.find((c) => c.startsWith("lastVisitedPage="));
      if (!lastCookie) return;

      const raw = lastCookie.split("=")[1] ?? "";
      const lastVisited = decodeURIComponent(raw);

      // Only redirect to internal app routes (safeguard) and avoid loops
      if (!lastVisited || !lastVisited.startsWith("/")) return;
      if (lastVisited === pathname) return;

      router.replace(lastVisited);
    } catch {
      // swallow errors — do not block rendering
    }
  }, [pathname, router]);
}
