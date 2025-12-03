import React from "react";

declare global {
  type Children = { children: React.ReactNode };

  type Promo = {
    price: string;
    topLine: string;
    middleLine: string;
    bottomLine: string;
  };

  type ExcerptType = {
    title: string;
    excerpt: string;
    link: string;
    uri: string;
    slug: string;
    featuredImage: Image;
  };

  type Image = {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
      caption: string;
      slug: string;
    };
  };

  type MenuItem = {
    id: string;
    uri: string;
    label: string;
    childItems?: {
      nodes: MenuItem[];
    };
  };

  type ScriptType = {
    id?: string;
    src?: string;
    location: "external" | "inline";
    type:
      | "module"
      | "text/javascript"
      | "application/ld+json"
      | "application/json"
      | "importmap";
    strategy:
      | "beforeInteractive"
      | "afterInteractive"
      | "lazyOnload"
      | "worker";
    async?: boolean;
    code?: string;
  };
}
