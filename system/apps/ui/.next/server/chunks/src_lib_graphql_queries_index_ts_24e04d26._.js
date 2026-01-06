module.exports=[98916,21409,78881,93803,82112,e=>{"use strict";let t=`
  query getAllEvents($first: Int, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        startDate
        endDate
        cost
        eventsCategories {
          nodes {
            name
            slug
          }
        }
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
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;e.s(["ALL_EVENTS_QUERY",0,t],21409);let r=`
  query AllLocations($first: Int, $after: String) {
    locations(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        shortDescription
        city
        state
        streetAddress
        zip
        phone
        email
        coordinates {
          lat
          lng
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
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;e.s(["ALL_LOCATIONS_QUERY",0,r],78881);let s=`
  query AllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
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
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;e.s(["ALL_POSTS_QUERY",0,s],93803);let a=`
  query AllProducts($first: Int, $after: String) {
    products(first: $first, after: $after, where: { typeIn: [SIMPLE, VARIABLE, EXTERNAL, GROUPED] }) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        ... on VariableProduct {
          price
          regularPrice
          salePrice
          stockStatus
        }
        ... on ExternalProduct {
          price
          regularPrice
          salePrice
        }
        ... on GroupProduct {
          price
        }
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
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;e.s(["ALL_PRODUCTS_QUERY",0,a],82112),e.s([],98916)}];

//# sourceMappingURL=src_lib_graphql_queries_index_ts_24e04d26._.js.map