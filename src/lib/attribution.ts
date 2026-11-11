"use client";

// First-touch attribution: the first UTM source and landing page a visitor
// arrives with. Stored per browser, passed to the estimator and Cal bookings.

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
};

const KEY = "ne_attr";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export function captureAttribution() {
  try {
    if (localStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      landing_page: window.location.pathname,
      referrer: document.referrer || undefined,
    };
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v;
    }
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage blocked: attribution is a nice-to-have, never a blocker.
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
