export const getFooterContent = `
query getFooterContent {
  upperFooter {
    options {
      footerBtn1 {
        btn1Text
        link {
          nodes {
            uri
          }
        }
      }
      footerBtn2 {
        btn2Text
        btn2Link {
          nodes {
            uri
          }
        }
      }
      footerCall {
        description
        footerHeadline
      }
    }
  }
  lowFooter {
    lowerFooter {
      contactInfo
      officeHours
      socialMedia {
        ... on LowerFooterSocialMediaSocialMediaPropertyLayout {
          name
          url
          icon {
            node {
              altText
              mediaDetails {
                height
                width
              }
              sourceUrl
            }
          }
        }
      }
    }
  }
}
`;
