import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { wpQuery } from "@app/_lib/wp/graphql";
import { getGravityForm } from "next-gravity-forms/server";
import Container from "@/components/ui/Container";
import { GravityForm } from "@/components/gravity-forms";
import { getSiteConfig } from "@/config";
import styles from "./page.module.css";
import { FormDebugInterceptor } from "./debug-interceptor";

export const revalidate = 300;

const siteConfig = getSiteConfig();

const FORM_ID = 16;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const form = await getGravityForm(FORM_ID);

    if (!form) {
      return {
        title: "Franchise Application",
      };
    }

    const description =
      form.description || "Apply to become a franchise partner.";

    return {
      title: `${form.title} | ${siteConfig.name || "ChiroStretch"}`,
      description: description,
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Franchise Application",
    };
  }
}

export default async function FranchiseApplicationPage() {
  try {
    const form = await getGravityForm(FORM_ID);

    if (!form) {
      notFound();
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Form fields:", JSON.stringify(form, null, 2));
    }

    return (
      <Container>
        <FormDebugInterceptor />
        <article className={styles.page}>
          <header className={styles.header}>
            {form.description && (
              <p className={styles.description}>{form.description}</p>
            )}
          </header>

          <div className={styles.content}>
            <GravityForm form={form} />
          </div>
        </article>
      </Container>
    );
  } catch (error) {
    console.error("Failed to load franchise application form:", error);
    notFound();
  }
}
