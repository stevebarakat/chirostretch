query getPageFranchiseOpportunities {
  page(id: "/franchise-opportunities", idType: URI) {
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
      whyusHeading
        whyusDescription
        whyusImage {
          node {
            altText
            srcSet
          }
        }
      }
    }
  }
}
