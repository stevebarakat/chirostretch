export const LOCATION_FIELDS = `
  fragment LocationFields on Location {
    id
    databaseId
    slug
    title
    streetAddress
    city
    state
    zip
    phone
    email

    coordinates {
      lat
      lng
    }

    hours {
      day
      open
      close
    }

    mapEmbed
    services

    shortDescription
  }
`;

export const STAFF_FIELDS = `
  fragment StaffFields on StaffMember {
    id
    databaseId
    title
    staffType
    jobTitle
    credentials
    specialties
    bio
    acceptingPatients
    isPublic

    headshot {
      sourceUrl
      altText
    }

    assignedLocation {
      id
      databaseId
      title
      slug
    }
  }
`;

export const EVENT_FIELDS = `
  fragment EventFields on Event {
    id
    databaseId
    slug
    title
    content
    date

    venue {
      id
      databaseId
      title
      address
      city
      state
      zip
    }

    clinicLocation {
      ...LocationFields
    }

    staffPresenters {
      ...StaffFields
    }
  }
  ${LOCATION_FIELDS}
  ${STAFF_FIELDS}
`;
