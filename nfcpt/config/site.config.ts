export const siteConfig = {
  name: "North Florida Chiropractic & Physical Therapy",
  description:
    "Professional chiropractic and physical therapy services in North Florida",
  url: "https://nfcpt.ts",
  contact: {
    phone: "(904) 272-4329",
    email: "info@nfcpt.ts",
    address: {
      street: "123 Main Street",
      city: "Jacksonville",
      state: "FL",
      zip: "32202",
    },
  },
  businessHours: [
    { day: "Monday", hours: "8:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "8:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "8:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "8:00 AM - 6:00 PM" },
    { day: "Friday", hours: "8:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 1:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  socialMedia: {
    facebook: "https://facebook.com/nfcpt",
    instagram: "https://instagram.com/nfcpt",
    twitter: "https://twitter.com/nfcpt",
    linkedin: "https://linkedin.com/company/nfcpt",
  },
} as const;
