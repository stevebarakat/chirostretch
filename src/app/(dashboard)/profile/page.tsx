import { AccountDetailsFormWrapper } from "@/components/Dashboard";
import { getViewerAccount } from "@/lib/commerce/account";
import crypto from "crypto";

export const metadata = {
  title: "Profile - Dashboard - ChiroStretch",
  description: "Update your account information and password",
};

export default async function ProfilePage() {
  const data = await getViewerAccount();

  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <h2>Error Loading Account</h2>
        <p>Unable to load your account information. Please try again.</p>
      </div>
    );
  }

  const { viewer, customer } = data;

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Profile</h1>
      <AccountDetailsFormWrapper
        userId={customer?.databaseId ?? 0}
        initialData={{
          firstName: customer?.firstName ?? viewer?.firstName,
          lastName: customer?.lastName ?? viewer?.lastName,
          email: customer?.email ?? viewer?.email,
          nickname: viewer?.nickname ?? null,
          description: viewer?.description ?? null,
          url: viewer?.url ?? null,
          job_title:
            customer?.metaData?.find((m) => m?.key === "job_title")?.value ??
            null,
          avatarUrl: (customer?.email ?? viewer?.email)
            ? `https://www.gravatar.com/avatar/${crypto
                .createHash("md5")
                .update(
                  (customer?.email ?? viewer?.email ?? "").trim().toLowerCase()
                )
                .digest("hex")}?d=identicon&s=160`
            : null,
        }}
      />
    </>
  );
}
