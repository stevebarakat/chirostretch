import { fetchGraphQL } from "@/lib/graphql/client";
import {
  SERVICES_SETTINGS_QUERY,
  type ServicesSettingsResponse,
} from "@/lib/graphql/queries";
import { ServicesTabsClient } from "./ServicesTabsClient";
import styles from "./ServicesTabs.module.css";

type ServicesTabsProps = {
  servicesOffered?: string[];
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function ServicesTabs({ servicesOffered }: ServicesTabsProps) {
  const data = await fetchGraphQL<ServicesSettingsResponse>(
    SERVICES_SETTINGS_QUERY
  );
  // Filter services based on what this location offers (slugified for flexibility)
  const offeredSlugs = servicesOffered?.map((s) => slugify(s));
  const services =
    data.chiroServicesSettings?.services?.filter((s) =>
      offeredSlugs?.includes(slugify(s.tabLabel))
    ) ?? [];
  const title = data.chiroServicesSettings?.title;
  const description = data.chiroServicesSettings?.description;

  return (
    <>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSubtitle}>{description}</p>
      <ServicesTabsClient services={services} />
    </>
  );
}
