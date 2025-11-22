import Link from "next/link";
import { Metadata } from "next";
import notFound from "/public/images/notFound.webp";

export const metadata: Metadata = {
  title: "Not Found | North Florida Chiropractic Physical Therapy",
  description: "North Florida Chiropractic Physical Therapy | Page Not Found",
};

export default function NotFound() {
  return (
    <>
      <div
        style={{
          backgroundColor: "hsl(0, 0%, 95%)",
          backgroundImage: `url(${notFound.src})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "repeat-x",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          textAlign: "center",
          paddingBottom: "64px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            background: "hsl(0 0% 95%)",
            border: "1px solid hsl(0, 0%, 80%)",
            padding: "8px",
            margin: "12px 64px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>404 | Page Not Found</h2>
          <p style={{}}>
            Oops! The page youre looking for doesnt exist. It might have been
            moved or deleted, or perhaps you just entered the wrong URL.
            Double-check the URL for any typos and try again.
          </p>
          <Link href="/">Return Home</Link>
        </div>
      </div>
    </>
  );
}
