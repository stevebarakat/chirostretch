import Link from "next/link";
import { User } from "lucide-react";
import styles from "./AccountMenu.module.css";

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "";

export default function AccountMenu() {
  return (
    <Link href={`${WP_URL}/my-account/`} className={styles.accountLink}>
      <User size={20} aria-hidden="true" />
      <span>My Account</span>
    </Link>
  );
}
