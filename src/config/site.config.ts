export const siteConfig = {
  name: "ChiroStretch",
  description: "Global Mobility. Smarter Movement. Better Living.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://chirostretch.com",
  contact: {
    phone: "(720) 290-2364",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@chirostretch.com",
    address: {
      street: process.env.NEXT_PUBLIC_ADDRESS_STREET || "",
      city: process.env.NEXT_PUBLIC_ADDRESS_CITY || "",
      state: process.env.NEXT_PUBLIC_ADDRESS_STATE || "",
      zip: process.env.NEXT_PUBLIC_ADDRESS_ZIP || "",
    },
  },
  menus: {
    header: "main-menu",
    footer: "footer-menu",
  },
} as const;
