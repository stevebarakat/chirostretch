import { algoliasearch } from "algoliasearch";
import { getAlgoliaConfig } from "@/config/algolia.config";

const config = getAlgoliaConfig();

export function isAlgoliaConfigured(): boolean {
  return !!(
    config.appId &&
    config.searchOnlyApiKey &&
    config.appId !== "" &&
    config.searchOnlyApiKey !== ""
  );
}

export const searchClient = isAlgoliaConfigured()
  ? algoliasearch(config.appId, config.searchOnlyApiKey)
  : null;

export const adminClient =
  isAlgoliaConfigured() && config.adminApiKey
    ? algoliasearch(config.appId, config.adminApiKey)
    : null;
