"use client";

import React from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { toast } from "@/lib/toast";
import styles from "./ShopHomepage.module.css";

/*
 * Product data is hardcoded for now.
 * TODO: Replace with WooCommerce GraphQL queries once catalog is finalized.
 */

const SALE_ITEM = {
  name: "Ergo Support Office Cushion",
  slug: "ergo-support-office-cushion",
  databaseId: 0, // placeholder — update with real ID
  regularPrice: "3900",
  salePrice: "2900",
  description:
    "Memory foam ergonomic cushion designed for all-day seated comfort. Reduces lower back strain and promotes proper pelvic alignment.",
};

const BEST_SELLERS = [
  { name: "ComfortAlign Posture Corrector", slug: "comfortalign-posture-corrector", databaseId: 0, price: "3500" },
  { name: "Deep Tissue Massage Ball Set", slug: "deep-tissue-massage-ball-set", databaseId: 0, price: "1800" },
  { name: "Cervical Spine Support Pillow", slug: "cervical-spine-support-pillow", databaseId: 0, price: "5500" },
  { name: "ProFlex Stretch Strap", slug: "proflex-stretch-strap", databaseId: 0, price: "2200" },
];

const CATEGORIES = [
  { label: "Alignment & Posture", slug: "alignment-posture", count: 6 },
  { label: "Myofascial Release", slug: "myofascial-release", count: 5 },
  { label: "Mobility & Stretch", slug: "mobility-stretch", count: 2 },
  { label: "Sleep & Recovery", slug: "sleep-recovery", count: 2 },
  { label: "Topical Relief", slug: "topical-relief", count: 2 },
];

const BUNDLE_ITEMS = [
  { name: "ComfortAlign Posture Corrector", slug: "comfortalign-posture-corrector", databaseId: 0, price: "3500" },
  { name: "Deep Tissue Massage Ball Set", slug: "deep-tissue-massage-ball-set", databaseId: 0, price: "1800" },
  { name: "ChiroStretch Herbal Cream", slug: "chirostretch-herbal-cream", databaseId: 0, price: "1700" },
];

const BUNDLE_TOTAL = "6500";
const BUNDLE_SAVINGS = "600";

const TRUST_BADGES = [
  { icon: "🚚", title: "Free Shipping 50+", desc: "On orders over $50" },
  { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
  { icon: "⭐", title: "4.8/5 Stars", desc: "200+ verified reviews" },
  { icon: "🏥", title: "Practitioner Approved", desc: "Chiropractor recommended" },
];

function QuickAddButton({
  databaseId,
  name,
  price,
}: {
  databaseId: number;
  name: string;
  price: string;
}) {
  const addToCart = useCartStore((s) => s.addToCart);
  const loading = useCartStore((s) => s.loading);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!databaseId) return;
    try {
      await addToCart(databaseId, 1, {
        name,
        prices: { price },
      });
      toast.success(`Added ${name} to cart`);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  if (!databaseId) return null;

  return (
    <button
      type="button"
      className={styles.quickAdd}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Adding…" : "+ Quick Add"}
    </button>
  );
}

export default function ShopHomepage() {
  const addToCart = useCartStore((s) => s.addToCart);
  const loading = useCartStore((s) => s.loading);

  const handleAddDeal = async () => {
    if (!SALE_ITEM.databaseId) return;
    try {
      await addToCart(SALE_ITEM.databaseId, 1, {
        name: SALE_ITEM.name,
        prices: {
          price: SALE_ITEM.salePrice,
          regular_price: SALE_ITEM.regularPrice,
          sale_price: SALE_ITEM.salePrice,
        },
      });
      toast.success(`Added ${SALE_ITEM.name} to cart`);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  const handleAddBundle = async () => {
    try {
      for (const item of BUNDLE_ITEMS) {
        if (!item.databaseId) continue;
        await addToCart(item.databaseId, 1, {
          name: item.name,
          prices: { price: item.price },
        });
      }
      toast.success("Added bundle to cart");
    } catch {
      toast.error("Failed to add bundle to cart. Please try again.");
    }
  };

  return (
    <main>
      {/* Announcement Bar */}
      <div className={styles.announcement}>
        Free shipping on orders over $50 —{" "}
        <strong>Save $10</strong> on the Ergo Support Office Cushion today!
      </div>

      {/* Hero Promo */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.promoBadge}>Limited Time Offer</div>
            <h1 className={styles.heroTitle}>
              Your Spine Deserves Better Support
            </h1>
            <p className={styles.heroDesc}>
              The Ergo Support Office Cushion — ergonomic design meets everyday
              comfort. On sale now.
            </p>
            <div className={styles.promoPrice}>
              <del>{formatPrice(SALE_ITEM.regularPrice)}</del>{" "}
              {formatPrice(SALE_ITEM.salePrice)}{" "}
              <span className={styles.saveBadge}>SAVE $10</span>
            </div>
            <div className={styles.heroCtas}>
              <Link
                href={`/shop/${SALE_ITEM.slug}`}
                className={`${styles.btn} ${styles.btnWhite}`}
              >
                Shop the Deal →
              </Link>
              <Link
                href="/products"
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                Browse All Products
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            {/* TODO: product image */}
          </div>
        </div>
      </section>

      {/* Today's Deal */}
      <section className={styles.deal}>
        <div className={styles.dealInner}>
          <div className={styles.sectionLabel}>Today&apos;s Deal</div>
          <h2 className={styles.sectionTitle}>Don&apos;t Miss This</h2>
          <p className={styles.sectionSub}>Limited stock at this price.</p>
          <div className={styles.dealCard}>
            <div className={styles.dealImage}>
              {/* TODO: product image */}
            </div>
            <div>
              <div className={styles.dealBadge}>🔥 Sale — Save 26%</div>
              <h3 className={styles.dealName}>{SALE_ITEM.name}</h3>
              <p className={styles.dealDesc}>{SALE_ITEM.description}</p>
              <div className={styles.dealUrgency}>
                ⏰ Sale price ends soon — limited quantity available
              </div>
              <div className={styles.dealPricing}>
                <del>{formatPrice(SALE_ITEM.regularPrice)}</del>{" "}
                {formatPrice(SALE_ITEM.salePrice)}
              </div>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={handleAddDeal}
                disabled={loading || !SALE_ITEM.databaseId}
              >
                {loading ? "Adding…" : "Add to Cart →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={styles.sellers}>
        <div className={styles.sellersInner}>
          <div className={styles.sectionLabel}>Best Sellers</div>
          <h2 className={styles.sectionTitle}>What Everyone&apos;s Buying</h2>
          <p className={styles.sectionSub}>
            Our most popular products based on real customer orders.
          </p>
          <div className={styles.sellersGrid}>
            {BEST_SELLERS.map((product, i) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}`}
                className={styles.sellCard}
              >
                <div className={styles.sellRank}>{i + 1}</div>
                <div className={styles.sellImage}>
                  {/* TODO: product image */}
                </div>
                <div className={styles.sellInfo}>
                  <h3 className={styles.sellName}>{product.name}</h3>
                  <div className={styles.sellPrice}>
                    {formatPrice(product.price)}
                  </div>
                  <QuickAddButton
                    databaseId={product.databaseId}
                    name={product.name}
                    price={product.price}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Quick-Links */}
      <section className={styles.categories}>
        <div className={styles.categoriesInner}>
          <div className={styles.sectionLabel}>Quick Browse</div>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.catPills}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={styles.catPill}
              >
                {cat.label} ({cat.count})
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle */}
      <section className={styles.bundle}>
        <div className={styles.bundleInner}>
          <div className={styles.bundleGrid}>
            <div className={styles.bundleProducts}>
              {BUNDLE_ITEMS.map((item, i) => (
                <React.Fragment key={item.slug}>
                  {i > 0 && <div className={styles.bundlePlus}>+</div>}
                  <div className={styles.bundleProd}>{item.name}</div>
                </React.Fragment>
              ))}
            </div>
            <div>
              <div className={`${styles.sectionLabel} ${styles.bundleLabel}`}>
                Bundle &amp; Save
              </div>
              <h2 className={styles.bundleTitle}>
                Complete Your Recovery Kit
              </h2>
              <p className={styles.bundleDesc}>
                Get the posture corrector, massage balls, and herbal relief cream
                together — everything you need for a full recovery routine.
              </p>
              <div className={styles.bundlePrice}>
                {formatPrice(BUNDLE_TOTAL)}{" "}
                <span className={styles.bundleSavings}>
                  (Save {formatPrice(BUNDLE_SAVINGS)})
                </span>
              </div>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPink}`}
                onClick={handleAddBundle}
                disabled={loading}
              >
                {loading ? "Adding…" : "Add Bundle to Cart →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className={styles.trust}>
        <div className={styles.trustGrid}>
          {TRUST_BADGES.map((badge) => (
            <div key={badge.title}>
              <div className={styles.trustIcon}>{badge.icon}</div>
              <h4 className={styles.trustTitle}>{badge.title}</h4>
              <p className={styles.trustDesc}>{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Browse All CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Want to See Everything?</h2>
        <p className={styles.ctaSub}>
          Browse the full ChiroStretch product catalogue — across 5 categories.
        </p>
        <Link
          href="/products"
          className={`${styles.btn} ${styles.btnBlue}`}
        >
          Browse All Products →
        </Link>
      </section>
    </main>
  );
}
