"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { toast } from "@/lib/toast";
import { rewriteImageUrl } from "@/utils/image-helpers";
import type { ShopCategoryNode } from "@/lib/graphql/queries/products";
import styles from "./ShopHomepage.module.css";

type ShopProductProp = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  shortDescription?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      mediaDetails?: { width?: number; height?: number };
    };
  };
};

type ShopHomepageProps = {
  dealProduct?: ShopProductProp | null;
  popularProducts?: ShopProductProp[];
  categories?: ShopCategoryNode[];
};

const BUNDLE_ITEMS = [
  {
    name: "ComfortAlign Posture Corrector",
    slug: "comfortalign-posture-corrector",
    databaseId: 0,
    price: "3500",
  },
  {
    name: "Deep Tissue Massage Ball Set",
    slug: "deep-tissue-massage-ball-set",
    databaseId: 0,
    price: "1800",
  },
  {
    name: "ChiroStretch Herbal Cream",
    slug: "chirostretch-herbal-cream",
    databaseId: 0,
    price: "1700",
  },
];

const BUNDLE_TOTAL = "6500";
const BUNDLE_SAVINGS = "600";

const TRUST_BADGES = [
  { icon: "🚚", title: "Free Shipping 50+", desc: "On orders over $50" },
  { icon: "🔒", title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
  { icon: "⭐", title: "4.8/5 Stars", desc: "200+ verified reviews" },
  {
    icon: "🏥",
    title: "Practitioner Approved",
    desc: "Chiropractor recommended",
  },
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

export default function ShopHomepage({
  dealProduct,
  popularProducts = [],
  categories = [],
}: ShopHomepageProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const loading = useCartStore((s) => s.loading);

  const handleAddDeal = async () => {
    if (!dealProduct?.databaseId) return;
    try {
      await addToCart(dealProduct.databaseId, 1, {
        name: dealProduct.name ?? "",
        prices: {
          price: dealProduct.salePrice ?? dealProduct.price ?? "0",
          regular_price: dealProduct.regularPrice ?? "0",
          sale_price: dealProduct.salePrice ?? "0",
        },
      });
      toast.success(`Added ${dealProduct.name} to cart`);
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

  const dealImage = dealProduct?.featuredImage?.node;

  return (
    <main>
      {/* Hero Promo */}
      {dealProduct && (
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <div className={styles.promoBadge}>Limited Time Offer</div>
              <h1 className={styles.heroTitle}>
                Your Spine Deserves Better Support
              </h1>
              <p className={styles.heroDesc}>
                {dealProduct.name} — on sale now.
              </p>
              <div className={styles.promoPrice}>
                {dealProduct.regularPrice && dealProduct.salePrice ? (
                  <>
                    <del>{formatPrice(dealProduct.regularPrice)}</del>{" "}
                    {formatPrice(dealProduct.salePrice)}{" "}
                    <span className={styles.saveBadge}>SALE</span>
                  </>
                ) : (
                  formatPrice(dealProduct.price ?? "0")
                )}
              </div>
              <div className={styles.heroCtas}>
                <Link
                  href={`/shop/${dealProduct.slug}`}
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
              {dealImage?.sourceUrl && (
                <Image
                  src={rewriteImageUrl(dealImage.sourceUrl)}
                  alt={dealImage.altText ?? dealProduct.name ?? ""}
                  width={dealImage.mediaDetails?.width ?? 600}
                  height={dealImage.mediaDetails?.height ?? 600}
                  priority
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Today's Deal */}
      {dealProduct && (
        <section className={styles.deal}>
          <div className={styles.dealInner}>
            <div className={styles.sectionLabel}>Today&apos;s Deal</div>
            <h2 className={styles.sectionTitle}>Don&apos;t Miss This</h2>
            <p className={styles.sectionSub}>Limited stock at this price.</p>
            <div className={styles.dealCard}>
              <div className={styles.dealImage}>
                {dealImage?.sourceUrl && (
                  <Image
                    src={rewriteImageUrl(dealImage.sourceUrl)}
                    alt={dealImage.altText ?? dealProduct.name ?? ""}
                    width={dealImage.mediaDetails?.width ?? 280}
                    height={dealImage.mediaDetails?.height ?? 280}
                  />
                )}
              </div>
              <div>
                <div className={styles.dealBadge}>🔥 Sale</div>
                <h3 className={styles.dealName}>{dealProduct.name}</h3>
                {dealProduct.shortDescription ? (
                  <p
                    className={styles.dealDesc}
                    dangerouslySetInnerHTML={{
                      __html: dealProduct.shortDescription,
                    }}
                  />
                ) : null}
                <div className={styles.dealUrgency}>
                  ⏰ Sale price ends soon — limited quantity available
                </div>
                <div className={styles.dealPricing}>
                  {dealProduct.regularPrice && dealProduct.salePrice ? (
                    <>
                      <del>{formatPrice(dealProduct.regularPrice)}</del>{" "}
                      {formatPrice(dealProduct.salePrice)}
                    </>
                  ) : (
                    formatPrice(dealProduct.price ?? "0")
                  )}
                </div>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnGreen}`}
                  onClick={handleAddDeal}
                  disabled={loading || !dealProduct.databaseId}
                >
                  {loading ? "Adding…" : "Add to Cart →"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {popularProducts.length > 0 && (
        <section className={styles.sellers}>
          <div className={styles.sellersInner}>
            <div className={styles.sectionLabel}>Best Sellers</div>
            <h2 className={styles.sectionTitle}>What Everyone&apos;s Buying</h2>
            <p className={styles.sectionSub}>
              Our most popular products based on real customer orders.
            </p>
            <div className={styles.sellersGrid}>
              {popularProducts.map((product, i) => (
                <Link
                  key={product.slug ?? i}
                  href={`/shop/${product.slug}`}
                  className={styles.sellCard}
                >
                  <div className={styles.sellRank}>{i + 1}</div>
                  <div className={styles.sellImage}>
                    {product.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={rewriteImageUrl(
                          product.featuredImage.node.sourceUrl,
                        )}
                        alt={
                          product.featuredImage.node.altText ??
                          product.name ??
                          ""
                        }
                        width={
                          product.featuredImage.node.mediaDetails?.width ?? 200
                        }
                        height={
                          product.featuredImage.node.mediaDetails?.height ?? 200
                        }
                      />
                    )}
                  </div>
                  <div className={styles.sellInfo}>
                    <h3 className={styles.sellName}>{product.name}</h3>
                    <div className={styles.sellPrice}>
                      {formatPrice(product.price ?? product.salePrice ?? "0")}
                    </div>
                    <QuickAddButton
                      databaseId={product.databaseId ?? 0}
                      name={product.name ?? ""}
                      price={product.price ?? product.salePrice ?? "0"}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Quick-Links */}
      {categories.length > 0 && (
        <section className={styles.categories}>
          <div className={styles.categoriesInner}>
            <div className={styles.sectionLabel}>Quick Browse</div>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.catPills}>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={styles.catPill}
                >
                  {cat.name}
                  {cat.count != null ? ` (${cat.count})` : ""}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <h2 className={styles.bundleTitle}>Complete Your Recovery Kit</h2>
              <p className={styles.bundleDesc}>
                Get the posture corrector, massage balls, and herbal relief
                cream together — everything you need for a full recovery
                routine.
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
        <Link href="/products" className={`${styles.btn} ${styles.btnBlue}`}>
          Browse All Products →
        </Link>
      </section>
    </main>
  );
}
