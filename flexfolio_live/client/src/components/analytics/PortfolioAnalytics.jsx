"use client";

import { trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef } from "react";

export default function PortfolioAnalytics({
  portfolioId,
}) {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!portfolioId) return;

    let visitorId =
      sessionStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId = crypto.randomUUID();

      sessionStorage.setItem(
        "visitorId",
        visitorId
      );
    }

    const viewedKey = `view_${portfolioId}`;

    // Unique portfolio view per browser session
    if (!sessionStorage.getItem(viewedKey)) {
      trackAnalyticsEvent({
        portfolioId,
        visitorId,
        eventType: "view",
      });

      sessionStorage.setItem(
        viewedKey,
        "true"
      );
    }

    const startTime = Date.now();

    const sendSession = () => {
      if (sentRef.current) return;

      const duration = Math.floor(
        (Date.now() - startTime) / 1000
      );

      // Ignore accidental opens
      if (duration < 3) return;

      sentRef.current = true;

      trackAnalyticsEvent({
        portfolioId,
        visitorId,
        eventType: "session",
        duration,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendSession();
      }
    };

    window.addEventListener(
      "beforeunload",
      sendSession
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      sendSession();

      window.removeEventListener(
        "beforeunload",
        sendSession
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [portfolioId]);

  return null;
}