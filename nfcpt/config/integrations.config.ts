export const integrationsConfig = {
  googleAnalytics: {
    enabled: true,
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  },
  cloudinary: {
    enabled: true,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "nfcpt",
    transformations: {
      effect: {
        name: "pixelate",
      },
    },
  },
  formspree: {
    enabled: true,
    formId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "",
  },
  googleMaps: {
    enabled: true,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  },
  vercelAnalytics: {
    enabled: true,
  },
} as const;
