"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function logout() {
      try {
        // Call logout API route
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }

        // Wait a moment before redirect
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err) {
        console.error("Logout error:", err);
        setError("An error occurred during logout. Redirecting...");

        // Redirect anyway after error
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }

    logout();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        textAlign: "center",
      }}
    >
      <div>
        {error ? (
          <>
            <h1>Error</h1>
            <p style={{ color: "#dc2626" }}>{error}</p>
          </>
        ) : (
          <>
            <h1>Logging out...</h1>
            <p>You will be redirected shortly.</p>
          </>
        )}
      </div>
    </div>
  );
}
