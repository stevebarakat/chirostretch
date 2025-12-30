import { DownloadsList } from "@/components/Account";
import { getViewerDownloads } from "@/lib/commerce/account";

export const metadata = {
  title: "Downloads - Dashboard - ChiroStretch",
  description: "Access your downloadable products and files",
};

export default async function DownloadsPage() {
  const downloads = await getViewerDownloads();

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Downloads</h1>
      <DownloadsList downloads={downloads} />
    </>
  );
}
