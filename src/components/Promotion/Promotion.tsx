import styles from "./promo.module.css";

interface Promo {
  price: number;
  topLine: string;
  middleLine: string;
  bottomLine: string;
}

function Promotion({ promo }: { promo: Promo }) {
  const { price, topLine, middleLine, bottomLine } = promo;
  return (
    <div className={styles.promo}>
      <div>
        <span className={styles.price}>
          <span>{price && "$"}</span>
          {price}
        </span>
      </div>
      <div className={styles.offer}>
        <span className={styles.newPatient}>{topLine}</span>
        <span className={styles.special}>{middleLine}</span>
        <span className={styles.points}>{bottomLine}</span>
      </div>
    </div>
  );
}

export default Promotion;
