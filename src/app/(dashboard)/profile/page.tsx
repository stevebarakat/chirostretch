import { AccountDetailsFormWrapper } from "./AccountDetailsFormWrapper";
import { getViewerAccount } from "@/lib/woocommerce/account";
import crypto from "crypto";

export const metadata = {
  title: "Profile - Dashboard - ChiroStretch",
  description: "Update your account information and password",
};

export default async function ProfilePage() {
  const account = await getViewerAccount();

  if (!account) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <h2>Error Loading Account</h2>
        <p>Unable to load your account information. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ marginBottom: "1.5rem" }}>Profile</h1>
      <AccountDetailsFormWrapper
        userId={account.databaseId}
        initialData={{
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          nickname:
            account.metaData?.find((m) => m?.key === "nickname")?.value ?? null,
          description:
            account.metaData?.find((m) => m?.key === "description")?.value ??
            null,
          url:
            account.metaData?.find((m) => m?.key === "user_url")?.value ?? null,
          job_title:
            account.metaData?.find((m) => m?.key === "job_title")?.value ??
            null,
          avatarUrl: account.email
            ? `https://www.gravatar.com/avatar/${crypto
                .createHash("md5")
                .update(account.email.trim().toLowerCase())
                .digest("hex")}?d=identicon&s=160`
            : null,
        }}
      />
    </>
  );
}
