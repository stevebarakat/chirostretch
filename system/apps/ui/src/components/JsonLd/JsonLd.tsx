import Script from "next/script";

export default function JsonLd({ children }: { children: React.ReactNode }) {
  const schema = children?.toString()?.replace(/old./g, "www.");
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema! }}
    />
  );
}
