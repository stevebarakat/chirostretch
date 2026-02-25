import styles from "./AnnouncementBar.module.css";

type AnnouncementBarProps = {
  message: React.ReactNode;
};

export default function AnnouncementBar({ message }: AnnouncementBarProps) {
  return <div className={styles.bar}>{message}</div>;
}
