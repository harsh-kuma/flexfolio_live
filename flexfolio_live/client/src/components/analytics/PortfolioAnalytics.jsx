"use client";

import { trackAnalyticsEvent } from "@/lib/api";
import { useEffect, useRef } from "react";

export default function PortfolioAnalytics({ portfolioId, }) {
  const sentRef = useRef(false);
  useEffect(() => {
    if (!portfolioId) return;
    let visitorId = localStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem("visitorId", visitorId);
    }

    let sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("sessionId",sessionId);
    }

    const viewedKey = `view_${portfolioId}`;

    // Unique portfolio view per browser session
    if (!sessionStorage.getItem(viewedKey)) {
      trackAnalyticsEvent({
        portfolioId,
        visitorId,
        sessionId,
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
        sessionId,
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