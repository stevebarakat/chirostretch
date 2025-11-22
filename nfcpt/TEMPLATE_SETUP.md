# WordPress Headless Template Setup Guide

This guide walks you through setting up a new site using the WordPress Headless Template.

## Prerequisites

- Node.js 18+ installed
- WordPress site with admin access
- Domain/hosting for deployment

## Step 1: Template Setup

1. **Clone the template**

   ```bash
   git clone <template-repo-url> your-site-name
   cd your-site-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Copy environment template**
   ```bash
   cp .env.example .env.local
   ```

## Step 2: Environment Configuration

Edit `.env.local` with your values:

```bash
# Required
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_FORMSPREE_FORM_ID=your-form-id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

## Step 3: Site Configuration

### Update Site Information (`/config/site.config.ts`)

```typescript
export const siteConfig = {
  name: "Your Business Name",
  description: "Your business description",
  url: "https://your-site.com",
  contact: {
    phone: "(555) 123-4567",
    email: "info@your-site.com",
    address: {
      street: "123 Main Street",
      city: "Your City",
      state: "ST",
      zip: "12345",
    },
  },
  businessHours: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
    { day: "Friday", hours: "9:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ],
  socialMedia: {
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourpage",
    twitter: "https://twitter.com/yourpage",
    linkedin: "https://linkedin.com/company/yourcompany",
  },
};
```

### Customize Theme (`/config/theme.config.ts`)

```typescript
export const themeConfig = {
  colors: {
    primary: "#your-primary-color",
    secondary: "#your-secondary-color",
    accent: "#your-accent-color",
    background: "#ffffff",
    surface: "#f7fafc",
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
      muted: "#718096",
    },
    border: "#e2e8f0",
    success: "#38a169",
    warning: "#d69e2e",
    error: "#e53e3e",
  },
  // ... rest of theme config
};
```

### Configure Components (`/config/components.config.ts`)

Enable/disable components based on your needs:

```typescript
export const componentsConfig = {
  header: {
    enabled: true,
    showPhone: true,
    showLogo: true,
    showMenu: true,
  },
  footer: {
    enabled: true,
    showSocial: true,
    showContactInfo: true,
    showBusinessHours: true,
    showMenu: true,
  },
  hero: { enabled: true },
  callToAction: { enabled: true },
  promotion: { enabled: false }, // Disable if not needed
  introduction: { enabled: true },
  gallery: { enabled: true },
  blocks: { enabled: true },
  reviews: { enabled: false }, // Disable if not needed
  blog: { enabled: true },
  contactForm: { enabled: true },
  sidebar: { enabled: false },
  masthead: { enabled: false },
  map: { enabled: false },
  signUp: { enabled: false },
};
```

## Step 4: WordPress Setup

### Install Required Plugins

1. **WPGraphQL** - Provides GraphQL API
2. **Advanced Custom Fields (ACF)** - For custom fields
3. **WPGraphQL for ACF** - Connects ACF to GraphQL

### Create Custom Field Groups

Create these field groups in WordPress Admin > Custom Fields:

#### Custom SEO

- `canonical` (Text)
- `googleVerify` (Text)
- `bingVerify` (Text)
- `schema` (Textarea)

#### Upper Footer

- `footerCall` (Text)
- `footerBtn1` (Text)
- `footerBtn2` (Text)

#### Lower Footer

- `contactInfo` (Textarea)
- `officeHours` (Textarea)
- `socialMedia` (Repeater with sub-fields)

#### Introduction

- `leftSide` (Textarea)
- `rightSide` (Textarea)
- `stats` (Repeater with sub-fields)

#### Gallery Page

- `galleryTitle` (Text)
- `image` (Gallery)

#### Blocks

- `blocks` (Flexible Content)

#### Call to Action

- `headings` (Text)
- `button1` (Text)
- `button2` (Text)

### Create Menus

1. **Main Menu** - Primary navigation
2. **Footer Menu** - Footer navigation

### Set Up Content

1. Create pages and posts
2. Assign custom fields to pages
3. Set featured images
4. Configure menus

## Step 5: Integration Setup

### Google Analytics (Optional)

1. Create Google Analytics account
2. Get Measurement ID
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Cloudinary (Optional)

1. Create Cloudinary account
2. Get cloud name
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```

### Formspree (Optional)

1. Create Formspree account
2. Create form and get form ID
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_FORMSPREE_FORM_ID=your-form-id
   ```

### Google Maps (Optional)

1. Create Google Cloud project
2. Enable Maps JavaScript API
3. Create API key
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
   ```

## Step 6: Testing

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Test functionality**

   - Navigate to `http://localhost:3000`
   - Check all enabled components render
   - Test responsive design
   - Verify WordPress content loads

3. **Check for errors**
   ```bash
   npm run lint
   npm run build
   ```

## Step 7: Deployment

### Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the project: `npm run build`
2. Deploy the `.next` folder to your platform
3. Set environment variables

## Step 8: Post-Deployment

1. **Update WordPress settings**

   - Set site URL to production domain
   - Configure permalinks
   - Update any hardcoded URLs

2. **Test production site**

   - Check all pages load correctly
   - Verify forms work
   - Test mobile responsiveness

3. **SEO setup**
   - Submit sitemap to Google Search Console
   - Verify Google Analytics tracking
   - Check meta tags

## Customization Checklist

- [ ] Site name and description updated
- [ ] Contact information configured
- [ ] Business hours set
- [ ] Social media links added
- [ ] Theme colors customized
- [ ] Components enabled/disabled as needed
- [ ] WordPress plugins installed
- [ ] Custom fields created
- [ ] Menus configured
- [ ] Content added
- [ ] Integrations configured
- [ ] Environment variables set
- [ ] Site tested locally
- [ ] Deployed to production
- [ ] Production site tested

## Troubleshooting

### Common Issues

1. **GraphQL endpoint not found**

   - Verify WPGraphQL plugin is active
   - Check endpoint URL in environment variables

2. **Components not rendering**

   - Check component configuration
   - Verify component is imported correctly

3. **Styling issues**

   - Check theme configuration
   - Verify CSS custom properties

4. **Build errors**
   - Run `npm run lint` to check for errors
   - Verify all required environment variables are set

### Getting Help

- Check the main README.md for detailed documentation
- Review Next.js and WPGraphQL documentation
- Open an issue in the template repository

## Next Steps

After setup, consider:

- Adding custom components
- Extending the theme system
- Adding more integrations
- Optimizing performance
- Setting up monitoring
