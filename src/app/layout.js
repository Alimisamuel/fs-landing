import "./globals.css";

export const metadata = {
  title: "Faithstream",
  description: "Faith Streams is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },
   viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
    openGraph: {
    title: "Faithstream | Faith Movies, Sermons & Gospel Content",
    description: "Faith Streams is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
    url: "https://faithstream.com",
    siteName: "Faithstream",
    type: "website",
    locale: "en_US",

  },
  twitter: {
    card: "summary_large_image",
    title: "Faithstream | Faith Movies, Sermons & Gospel Content",
    description: "Faith Streams is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
    
    site: "@faithstream",
  },
    keywords: [
    "Faith Stream",
    "faithstreams",
    "faith-based movies",
    "Christian movies",
    "gospel TV",
    "devotionals",
    "sermons",
    "live church",
    "inspirational videos",
    "family entertainment",
    "Christian music",
    "gospel content",
    "prayer room",
    "Christian podcast",
    "Bible study",
    "motivational content",
    "Christian documentaries",
    "spiritual growth",
    "worship live",
    "Christian streaming app",
    "House of Faith",
    "Faith Stream Nigeria",
    "Christian films",
    "kids Christian shows",
    "uplifting stories",
    "Christian talk shows",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
