import { redirect } from "next/navigation";
import { DashboardLayout, DownloadsList } from "@/components/account";
import { getViewerDownloads } from "@/lib/woocommerce/account";
import { isAuthenticated } from "@/lib/auth";

export const metadata = {
  title: "Downloads - My Account - ChiroStretch",
  description: "Access your downloadable products and files",
};

export default async function DownloadsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/downloads");
  }

  const downloads = await getViewerDownloads();

  return (
    <DashboardLayout title="Downloads">
      <DownloadsList downloads={downloads} />
    </DashboardLayout>
  );
}
