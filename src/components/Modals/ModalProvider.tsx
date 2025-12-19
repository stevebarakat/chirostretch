"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { Modal } from "@/components/UI";
import { GravityForm } from "@/components/GravityForms";
import styles from "./ModalProvider.module.css";

// Lazy load SearchModal
const SearchModal = dynamic(() => import("@/components/Search/SearchModal"), {
  ssr: false,
});

type ModalProviderProps = {
  children: React.ReactNode;
  claimOfferForm?: unknown;
};

function ModalContent({ claimOfferForm }: { claimOfferForm?: unknown }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const modalParam = searchParams.get("modal");
  const isClaimOfferOpen = modalParam === "claim-offer";
  const isSearchOpen = modalParam === "search";

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <>
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={closeModal} />

      {/* Claim Offer Modal */}
      <Modal open={isClaimOfferOpen} onClose={closeModal}>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Claim Your New Patient Offer</h2>
          <p className={styles.modalDescription}>
            Fill out the form below to claim your exclusive new patient offer.
          </p>
          {claimOfferForm ? (
            <div className={styles.formWrapper}>
              <GravityForm form={claimOfferForm} />
            </div>
          ) : (
            <p className={styles.error}>Form not available. Please try again later.</p>
          )}
        </div>
      </Modal>
    </>
  );
}

export function ModalProvider({ children, claimOfferForm }: ModalProviderProps) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <ModalContent claimOfferForm={claimOfferForm} />
      </Suspense>
    </>
  );
}
