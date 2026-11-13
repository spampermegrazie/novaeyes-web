import type { Metadata } from "next";
import { VerticalPage } from "@/components/vertical-page";
import { getVertical } from "@/content/verticals";

const vertical = getVertical("/app-and-startup-clipping");

export const metadata: Metadata = {
  title: vertical.title,
  description: vertical.description,
  alternates: { canonical: vertical.path },
};

export default function Page() {
  return <VerticalPage vertical={vertical} />;
}
