// Clips for the homepage hero. 8 cards: even indexes go to the left wing, odd to the right.
//
// Until real clips are added, each card renders a watermarked placeholder.
// To add a real clip: export it 9:16, about 480x854, 3 to 6 seconds, muted, H.264 MP4
// under 1.5 MB, drop it in public/clips/, and set `src` (and `poster`, a JPG of the first frame).
// Only use clips you have the rights to show publicly.

export type HeroClip = {
  platform: "TikTok" | "Reels" | "Shorts" | "X";
  label: string; // describes the clip, for your own reference
  src?: string; // e.g. "/clips/alex-schor-1.mp4"
  poster?: string; // e.g. "/clips/alex-schor-1.jpg"
};

export const heroClips: HeroClip[] = [
  { platform: "TikTok", label: "Music clip" },
  { platform: "Reels", label: "Combat sports clip" },
  { platform: "Shorts", label: "Podcast clip" },
  { platform: "TikTok", label: "Creator clip" },
  { platform: "Reels", label: "Music clip" },
  { platform: "X", label: "Combat sports clip" },
  { platform: "Shorts", label: "Podcast clip" },
  { platform: "TikTok", label: "Product clip" },
];
