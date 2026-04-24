export interface Streamer {
  name: string;
  channelUrl: string;
  channelId: string;
  bio?: string;
  avatarUrl?: string;
  schedule?: string;
  socials?: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
}

export const streamers: Streamer[] = [
  {
    name: "Quad H",
    channelUrl: "https://youtube.com/@HardHeadHackerHead",
    channelId: "UCvRibuOhtInWPz8Yaf3DjTw",
    bio: "Quad's Lab is where vibe coding meets real building. Welcome to Quad's Lab, the place for coders, creators, and builders who want to ship real projects, learn fast, and build something meaningful.",
    avatarUrl: "https://yt3.ggpht.com/9Igf_XacuNB-wA9zhmNPSAqlSkzvwMp7iI1F1Ex5e4fnTi9OqRrCFuI3qBRC_d5dqhs4Fz7I=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Check channel for latest streams",
  },
  {
    name: "BridgeMind",
    channelUrl: "https://youtube.com/@bridgemindai",
    channelId: "UCwaTGE53GLGC3fDClVl_7TA",
    bio: "Matthew Miller is the Founder & CEO of BridgeMind — his third startup.",
    avatarUrl: "https://yt3.ggpht.com/Nhub0TMCZUFjPrr7PZDvKuv6O2zICq7Yfi5Ah6P0OdTq_iaoZJ0zM8uMB4pKuEmc7XWpbrxa=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Afternoon/evening streams",
  },
  {
    name: "Nico G",
    channelUrl: "https://youtube.com/@NicoGrajales",
    channelId: "UCfOgjnwXVU2mWVfRCBfEGdg",
    bio: "Former Marine/Airman turned software dev, building in public. The mission: vibe code to $1,000,000. Stop typing. Start building.",
    avatarUrl: "https://yt3.googleusercontent.com/FlhxsjvVI7Ca7wAf5IYBy8tl5s9evewgTIkpfFFiaMfl-xi4rwD6cwTkpSnKAKnV7B4137DM=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Check channel for latest streams",
  },
  {
    name: "dyoburon",
    channelUrl: "https://youtube.com/@dyoburon",
    channelId: "UCYzpOLXEmgUiHZeho6u77Zg",
    bio: "My background is software engineering (Ex-Microsoft, Salesforce, Expedia), and I recognized the power of LLMs to rapidly create products. I want to document my journey here with everyone, and hopefully create a community interested in building.",
    avatarUrl: "https://yt3.ggpht.com/TeGGg2s1Y_ljM3kcNNcChz42YVuJc4PofSKGxOLTJD9wBlIVOq4RTzmsB0v24dMdSYERdmg30w=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Frequent streamer, varied times",
  },
  {
    name: "Jordan Lee",
    channelUrl: "https://youtube.com/@jorddanlee",
    channelId: "UCMB_2UGhVxA_gLjdtm35lRw",
    bio: "Founder from Canada, building AI-powered tools for businesses and helping owners and entrepreneurs monetize with AI. Documenting the entire process live — every win, every mistake, and everything learned along the way.",
    avatarUrl: "https://yt3.ggpht.com/TbyAjuYqNQXKFFbMTe7pOZvwQapBnzxL30qrhFtLyCI8SFX4YFmnGS5RU6WhYE5Rn4lAp7xSvmA=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Frequent streamer, mornings ~9-10 AM ET",
  },
  {
    name: "Enterprise Vibe Code",
    channelUrl: "https://youtube.com/@EnterpriseVibeCode",
    channelId: "UCyxYcJWs5WstpM2h8KjabUw",
    bio: "Senior DevOps Engineer live streaming how he's Vibe Coding Enterprise-Grade Open Source Applications.",
    avatarUrl: "https://yt3.ggpht.com/soNqUlI1xJ6QaP_hlgY3-TZEcgsD06PARrEbyON99GiKgReOtglbO_4gAYp40VJebwPhSq7baQ=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Late night streams",
  },
  {
    name: "Bilbro's Vibe Coding",
    channelUrl: "https://youtube.com/@BilbroSwagginzCoding",
    channelId: "UCU0uyjCjL9gcwKhGc_9kW8A",
    bio: "Bilbro's Vibe Coding",
    avatarUrl: "https://yt3.ggpht.com/j3Jyl1ZiQxC3HCnsWvF96Ao60quzdTYZQPjsYounVpz5kEyJKO6iYVja5ftpB0ZHkPdmu0iP8g=s800-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Clearmud",
    channelUrl: "https://youtube.com/@Clearmud",
    channelId: "UClMgNsPzvVprkO297NfjDuw",
    bio: "Simplifying AI for those who demand results, not hype. I'm Marcelo Oliveira, and I help businesses, entrepreneurs and creatives turn AI into a competitive advantage through data-driven insights and demonstrations.",
    avatarUrl: "https://yt3.ggpht.com/BLP7t_BjIAGu_Qk86WU6tYj2-5940aey-EqZmjqvySypdZ3rTYpFod2Foyzd7txlzYhNAXrdGw=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Late night/early morning streams",
  },
  {
    name: "khuur",
    channelUrl: "https://youtube.com/@khuurdotdev",
    channelId: "UCflKBuSaZf-NJN0BmVmF90A",
    bio: "Welcome to the chill spot for coders & curious minds! We vibe code, explore the latest AI tools, drop AI & tech news, and learn new things together — no pressure, just good energy. Whether you're a beginner or a seasoned dev, pull up a chair and code with us.",
    avatarUrl: "https://yt3.ggpht.com/U1uoa8pCJn_4Xs7QHPED_TQbCe1B_rwGsyfXNX0JOZKFzGwzrqTvR-nHT_Q5o26L08x0okwF-w=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Check channel for latest streams",
  },
  {
    name: "Nate Needham",
    channelUrl: "https://youtube.com/@NateNeedham",
    channelId: "UChh5UFM7CUMFNVQrJX1aVVA",
    bio: "Welcome to Automate & Innovate. I'm Nate Needham, and I'm on a mission to prove that the gap between a $1,000,000 idea and a finished product has officially disappeared.",
    avatarUrl: "https://yt3.ggpht.com/lcNEEOHdSdu5wObC4BvSoolrvV-c_-1Gv1MeDhYHeixJIhnnyJV79HnjrLGwoDxoK4QyiQxm=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Frequent streamer, varied times",
  },
  {
    name: "Dubibubii",
    channelUrl: "https://youtube.com/@Dubibubii",
    channelId: "UC4SgqYQmdTCKXUoer2U-lcg",
    bio: "Welcome to my business diary",
    avatarUrl: "https://yt3.ggpht.com/uMgck3WF7S5xDeTG_8sXqM2w2svUmlWCnBXWIxxp0keRPZg90gB5_9Gj8gnew-xGU06jSb1yYg=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Morning/afternoon streams",
  },
  {
    name: "André Mikalsen",
    channelUrl: "https://youtube.com/@AndreMikalsen",
    channelId: "UCRoL0fiIVfPTrWmRDN-iszQ",
    bio: "AI should produce actual results, not cool demos 🚀",
    avatarUrl: "https://yt3.ggpht.com/n5m8r69YOXbXS2dM8p-ZHBwiAccMucah7x-U9QeJtEiZRxylFtZwwtSEwrAPhgPGCmFtgtK0zg=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Mon/Wed/Fri 09:00-14:00 CET",
    socials: {
      twitter: "https://x.com/andremikalsen_",
      discord: "https://discord.gg/QhRnz9m5HE",
      github: "https://github.com/AndyMik90",
    },
  },
  {
    name: "Unpuzzle",
    channelUrl: "https://youtube.com/@unpuzzleco",
    channelId: "UCX-jX5o5UxQ6nPTPSu0ZFPA",
    bio: "Follow along as I vibe code my way to $1M in SaaS revenue, one day at a time. Solo founder building multiple products in public — raw, unfiltered, and real.",
    avatarUrl: "https://yt3.googleusercontent.com/H-zangefn_edX0J4orDl1_L8P2ZStObf_47mm-viajjaSJjbO4LuiA6alHejk5aH7mP0Wi3qk70=s800-c-k-c0x00ffffff-no-rj",
    schedule: "Check channel for latest streams",
  },
];
