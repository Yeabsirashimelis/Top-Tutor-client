"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectPath = "/auth/signin",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Routes that should NOT be protected
  const excludedRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
  ];

  useEffect(() => {
    // Only redirect if:
    // 1. Not loading
    // 2. User is unauthenticated
    // 3. Current route is NOT an excluded route
    if (status === "unauthenticated" && !excludedRoutes.includes(pathname)) {
      router.replace(redirectPath);
    }
  }, [status, router, redirectPath, pathname]);

  // If current route is excluded, render children without protection
  if (excludedRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Show loading state
  if (status === "loading") return null; // or a spinner

  // If unauthenticated on protected route, don't render
  if (status === "unauthenticated") return null;

  // Render protected content
  return <>{children}</>;
}
