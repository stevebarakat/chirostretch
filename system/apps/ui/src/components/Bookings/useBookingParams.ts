"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useBookingParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const updateParams = useCallback(
    (updates: { serviceId?: string | null; date?: string | null; time?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const setServiceId = useCallback(
    (id: string | null) => {
      // When service changes, reset date and time
      updateParams({ serviceId: id, date: null, time: null });
    },
    [updateParams]
  );

  const setDate = useCallback(
    (newDate: string | null) => {
      // When date changes, reset time
      updateParams({ date: newDate, time: null });
    },
    [updateParams]
  );

  const setTime = useCallback(
    (newTime: string | null) => {
      updateParams({ time: newTime });
    },
    [updateParams]
  );

  const clearAll = useCallback(() => {
    updateParams({ serviceId: null, date: null, time: null });
  }, [updateParams]);

  return {
    serviceId: serviceId ? parseInt(serviceId, 10) : null,
    date,
    time,
    setServiceId,
    setDate,
    setTime,
    clearAll,
    isComplete: serviceId !== null && date !== null && time !== null,
  };
}
