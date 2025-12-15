"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export default function IndexLocationsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    indexed?: number;
    message?: string;
    error?: string;
    details?: string;
  } | null>(null);

  async function handleIndex() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/algolia/index-locations", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          success: false,
          error: data.error || "Unknown error",
          message: data.message,
          details: data.details,
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Index Locations to Algolia</h1>
      <Button onClick={handleIndex} disabled={loading}>
        {loading ? "Indexing..." : "Index Locations"}
      </Button>

      {result && (
        <div className={styles.result}>
          {result.success ? (
            <div className={styles.success}>
              <h2>✅ Success!</h2>
              <p>Indexed {result.indexed} locations</p>
            </div>
          ) : (
            <div className={styles.error}>
              <h2>❌ Error</h2>
              <p>
                <strong>{result.error || "Unknown error"}</strong>
              </p>
              {result.message && <p>{result.message}</p>}
              {result.details && (
                <pre style={{ fontSize: "0.875rem", overflow: "auto" }}>
                  {result.details}
                </pre>
              )}
              {result.indexed !== undefined && (
                <p>Locations found: {result.indexed}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
