import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "./globals.css";
import LayoutClient from "./layout-cllient";
import MainContent from "./MainContent";

export const metadata: Metadata = {
  title: "Faithstream | Movie, Series, PrayerStreams, Devotionals, Podcasts, FaithSound, Animation",
  description: "FaithStream is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
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
    title: "Faithstream | Movie, Series, PrayerStreams, Devotionals, Podcasts, FaithSound, Animation",
    description: "FaithStream is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
    url: "https://thefaithstream.com",
    siteName: "FaithStream",
    type: "website",
    locale: "en_US",

  },
  twitter: {
    card: "summary_large_image",
    title: "Faithstream | Movie, Series, PrayerStreams, Devotionals, Podcasts, FaithSound, Animation",
    description: "FaithStream is your all-in-one platform for faith-based, inspirational, and family-friendly entertainment Discover uplifting movies, sermons,  worship videos, talk shows, documentaries, devotions and live events from  creators  around the world  all in one place.",
    
    site: "@faithstream",
  },
    keywords: [
    "FaithStream",
    "faithstream",
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
    "FaithStream Nigeria",
    "Christian films",
    "kids Christian shows",
    "uplifting stories",
    "Christian talk shows",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          
          <LayoutClient>
            <MainContent />
            {children}
            
            </LayoutClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
