module.exports=[81641,87906,91959,94606,52240,10566,95274,56392,34301,4512,13100,91220,5884,a=>{"use strict";let b=`
  query BookingProducts {
    bookingProducts {
      databaseId
      name
      slug
      price
      shortDescription
      bookingDuration
      bookingDurationUnit
      bookingCost
    }
  }
`;a.s(["BOOKING_PRODUCTS_QUERY",0,b],87906);let c=`
  query EventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      slug
      title
      id
      databaseId
      author {
        node {
          name
        }
      }
      content
    }
  }
`;a.s(["EVENT_BY_SLUG_QUERY",0,c],91959);let d=`
  query FranchiseOpportunities {
    page(id: "/franchise", idType: URI) {
      title
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            altText
            sourceUrl
            srcSet
            sizes
            slug
            title
            description
            mediaDetails {
              width
              height
            }
          }
        }
      }
      heroUnit {
        heroLink {
          target
          title
          url
        }
      }
      franchiseOpportunitiesAbout {
        aboutHeading
        aboutSubheading
        aboutImage {
          node {
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
        aboutCtaText
        aboutCtaLink {
          url
          title
          target
        }
        aboutCta2Text
        aboutCta2Link {
          url
          title
          target
        }
      }
      componentDescriptionList {
        descriptionListItems {
          itemTitle
          itemDescription
          itemIcon {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
      franchiseOpportunitiesWhyUs {
        whyusHeading
        whyusDescription
        whyusImage {
          node {
            altText
            srcSet
            sourceUrl
          }
        }
      }
    }
  }
`;a.s(["FRANCHISE_QUERY",0,d],94606);let e=`
  # Reusable Fragments
  fragment MediaDetailsFields on MediaDetails {
    width
    height
  }

  fragment FeaturedImageFields on MediaItem {
    id
    sourceUrl
    altText
    srcSet
    sizes
    mediaDetails {
      ...MediaDetailsFields
    }
  }

  fragment AuthorFields on User {
    id
    name
    slug
  }

  fragment CategoryFields on Category {
    id
    name
    slug
  }

  query Homepage {
    featuredProducts: products(where: { featured: true }, first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        averageRating
        reviewCount
        ... on SimpleProduct {
          price
          stockStatus
        }
        ... on VariableProduct {
          price
          stockStatus
        }
        ... on ExternalProduct {
          price
        }
        ... on GroupProduct {
          price
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...FeaturedImageFields
            }
          }
        }
      }
    }
    upcomingEvents: events(first: 20) {
      nodes {
        slug
        title
        id
        databaseId
        content
        startDate
        endDate
        cost
        venue {
          title
          city
          state
        }
        organizers {
          nodes {
            title
          }
        }
        featuredImage {
          node {
            ...FeaturedImageFields
          }
        }
      }
    }
    latestPosts: posts(first: 2) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        date
        author {
          node {
            ...AuthorFields
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...FeaturedImageFields
            }
          }
        }
        categories {
          nodes {
            ...CategoryFields
          }
        }
      }
    }
    page(id: "/homepage", idType: URI) {
      title
      content
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            altText
            sourceUrl
            srcSet
            sizes
            slug
            title
            description
            mediaDetails {
              ...MediaDetailsFields
            }
          }
        }
      }
      heroUnit {
        heroLink {
          target
          title
          url
        }
        heroLinkIcon {
          node {
            sourceUrl
            altText
            slug
            mediaDetails {
              width
              height
            }
          }
        }
        heroLink2 {
          target
          title
          url
        }
        heroLinkIcon2 {
          node {
            altText
            sourceUrl
            slug
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      homepageCta {
        headings {
          headline
          subheading
        }
        button1 {
          btn1Link {
            nodes {
              uri
              ... on NodeWithTitle {
                title
              }
            }
          }
          btn1Icon {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
        button2 {
          btn2Link {
            url
            title
            target
          }
          btn2Icon {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
      componentDescriptionList {
        descriptionListItems {
        itemTitle
        itemIcon {
          node {
            altText
            sourceUrl
          }
        }
        itemDescription
      }
      }
      homepageFeaturedProducts {
        featuredProductsHeading
        featuredProductsSubheading
        featuredProductsSource
        featuredProductsManual {
          product {
            nodes {
              id
              ... on NodeWithTitle {
                title
              }
              ... on NodeWithFeaturedImage {
                featuredImage {
                  node {
                    sourceUrl
                    altText
                    srcSet
                    sizes
                    mediaDetails {
                      ...MediaDetailsFields
                    }
                  }
                }
              }
            }
          }
        }
      }
      homepageUpcomingEvents {
        eventsHeading
        eventsSubheading
        eventsLimit
        eventsCtaText
        eventsCtaLink
      }
      homepageLatestInsights {
        insightsHeading
        insightsSubheading
        insightsLimit
        insightsCtaText
        insightsCtaLink
      }
      homepageIntroduction {
        leftSide {
          headline
          text
        }
        rightSide {
          bulletPoints
          headline
        }
      }
      stats {
        stats {
          ... on StatsStatsStatLayout {
            stat {
              description
              number
              prefix
              suffix
            }
          }
        }
      }
    }
    customSEO {
      customSeoSettings {
        fieldGroupName
        googleAnalyticsId
        canonical
        googleVerify
        bingVerify
      }
    }
    currentPromo {
      promo {
        bottomLine
        middleLine
        price
        topLine
      }
    }
  }
`;a.s(["HOMEPAGE_QUERY",0,e],52240);let f=`
  query Layout {
    logo: mediaItem(id: "logo", idType: SLUG) {
      altText
      sourceUrl
      srcSet
      sizes
      mediaDetails {
        width
        height
      }
    }
    topMenu: menu(id: "main-menu", idType: SLUG) {
      id
      name
      menuItems(where: {parentDatabaseId: 0}) {
        nodes {
          label
          uri
          id
          childItems {
            nodes {
              label
              uri
              id
            }
          }
        }
      }
    }
    headerMenu: menu(id: "homepage-menu", idType: SLUG) {
      id
      name
      menuItems(where: {parentDatabaseId: 0}) {
        nodes {
          label
          uri
          id
          childItems {
            nodes {
              label
              uri
              id
            }
          }
        }
      }
    }
    footerMenu: menu(id: "shop", idType: SLUG) {
      id
      name
      menuItems(where: {parentDatabaseId: 0}) {
        nodes {
          label
          uri
          id
          childItems {
            nodes {
              label
              uri
              id
            }
          }
        }
      }
    }
  }
`;a.s(["LAYOUT_QUERY",0,f],10566);let g=`
  query LocationBySlug($slug: ID!) {
    location(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      title
      content
      streetAddress
      city
      state
      zip
      phone
      email
      shortDescription
      servicesOffered
      heroUnit {
        heroLink {
          target
          title
          url
        }
        heroLinkIcon {
          node {
            altText
            sourceUrl
            slug
            mediaDetails {
              width
              height
            }
          }
        }
        heroLink2 {
          target
          title
          url
        }
        heroLinkIcon2 {
          node {
            sourceUrl
            altText
            slug
            mediaDetails {
              width
              height
            }
          }
        }
      }
      coordinates {
        lat
        lng
      }
      hours {
        day
        open
        close
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
            description
            slug
            title
            mediaDetails {
              width
              height
            }
          }
        }
      }
      practitioners {
        nodes {
          id
          databaseId
          title
          jobTitle
          credentials
          bio
          acceptingPatients
          headshot {
            sourceUrl
            altText
          }
          disciplines {
            nodes {
              slug
              name
            }
          }
          services {
            nodes {
              slug
              name
            }
          }
          specialties {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
  }
`,h=`
  query AllLocationSlugs {
    locations(first: 1000) {
      nodes {
        id
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;a.s(["ALL_LOCATION_SLUGS_QUERY",0,h,"LOCATION_BY_SLUG_QUERY",0,g],95274);let i=`
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      databaseId
      title
      slug
      uri
      content
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
            srcSet
            sizes
            slug
            title
            description
            mediaDetails {
              width
              height
            }
          }
        }
      }
      heroUnit {
        heroLink {
          target
          title
          url
        }
        heroLinkIcon {
          node {
            sourceUrl
            altText
            slug
            mediaDetails {
              width
              height
            }
          }
        }
        heroLink2 {
          target
          title
          url
        }
        heroLinkIcon2 {
          node {
            sourceUrl
            altText
            slug
            mediaDetails {
              width
              height
            }
          }
        }
      }
      blocks
    }
  }
`,j=`
  query AllPageSlugs {
    pages(first: 1000, where: { parent: null }) {
      nodes {
        id
        slug
        uri
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;a.s(["ALL_PAGE_SLUGS_QUERY",0,j,"PAGE_BY_URI_QUERY",0,i],56392);let k=`
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      title
      excerpt
      content
      date
      modified
      author {
        node {
          id
          name
          slug
        }
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            id
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
      blocks
    }
  }
`,l=`
  query AllPostSlugs {
    posts(first: 1000) {
      nodes {
        id
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;a.s(["ALL_POST_SLUGS_QUERY",0,l,"POST_BY_SLUG_QUERY",0,k],34301);let m=`
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      sku
      description
      shortDescription
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        attributes {
          nodes {
            id
            name
            options
            variation
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        attributes {
          nodes {
            id
            name
            options
            variation
          }
        }
        galleryImages {
          nodes {
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
        variations {
          nodes {
            id
            databaseId
            price
            regularPrice
            salePrice
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      ... on ExternalProduct {
        price
        regularPrice
        salePrice
        externalUrl
        buttonText
      }
      ... on GroupProduct {
        price
        galleryImages {
          nodes {
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      productTags {
        nodes {
          id
          name
          slug
        }
      }
      related(first: 4) {
        nodes {
          id
          name
          slug
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
          ... on NodeWithFeaturedImage {
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`,n=`
  query AllProductSlugs {
    products(first: 1000, where: { typeIn: [SIMPLE, VARIABLE, EXTERNAL, GROUPED] }) {
      nodes {
        id
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;a.s(["ALL_PRODUCT_SLUGS_QUERY",0,n,"PRODUCT_BY_SLUG_QUERY",0,m],4512);let o=`
  query ChiroServicesSettings {
    chiroServicesSettings {
      title
      description
      services {
        tabLabel
        tabIcon {
          sourceUrl
          altText
        }
        title
        description
        bulletPoints
        infoBox
        image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;a.s(["SERVICES_SETTINGS_QUERY",0,o],13100);let p=`
  query AllTestimonials($first: Int = 100) {
    testimonials(first: $first) {
      nodes {
        id
        databaseId
        title
        rating
        reviewText
        locationId
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;a.s(["ALL_TESTIMONIALS_QUERY",0,p],91220);let q=`
  query ChiroFeatureSettings {
    chiroFeatureSettings {
      title
      description
      keyPoints {
        icon {
          sourceUrl
          altText
        }
        iconBackgroundColor
        title
        description
      }
    }
  }
`;a.s(["VALUE_PROPOSITIONS_SETTINGS_QUERY",0,q],5884),a.s([],81641)}];

//# sourceMappingURL=src_lib_graphql_queries_index_ts_bad7dbd6._.js.map