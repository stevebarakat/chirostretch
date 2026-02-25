import styles from "./AnnouncementBar.module.css";

type AnnouncementBarProps = {
  message: string;
  highlight?: string;
};

export default function AnnouncementBar({ message, highlight }: AnnouncementBarProps) {
  return (
    <div className={styles.bar}>
      {message}
      {highlight && <> <strong>{highlight}</strong></>}
    </div>
  );
}
