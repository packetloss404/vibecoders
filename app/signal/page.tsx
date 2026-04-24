import type { Metadata } from "next";
import { SignalClient } from "./SignalClient";

export const metadata: Metadata = {
  title: "Signal Board · Vibe Social",
  description:
    "Real-time pulse of the vibe coding community — live streams, new streamers, and trending BBS threads, auto-generated with zero moderation.",
};

export default function SignalPage() {
  return <SignalClient />;
}
