import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://saadat-r-ahmed.github.io";
const SITE_TITLE = "Saadat Rafid Ahmed — Researcher & ML Engineer";
const SITE_DESC =
  "Lecturer at BRAC University & ML Team Lead at Innospace. Specializing in low-resource NLP, adversarial machine learning, RAG systems, and AI for education. Seeking fully-funded graduate positions.";
const GA_ID = "G-83NF2NJYPN";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Saadat Rafid Ahmed",
  },
  description: SITE_DESC,
  keywords: [
    "Saadat Rafid Ahmed",
    "NLP researcher",
    "Machine Learning engineer",
    "BRAC University lecturer",
    "adversarial NLP",
    "low-resource NLP",
    "Bengali NLP",
    "RAG systems",
    "AI for education",
    "transfer learning robustness",
    "ML portfolio",
    "computer science researcher",
    "Dhaka Bangladesh",
    "HuggingFace Transformers",
    "sentiment analysis Bengali",
  ],
  authors: [{ name: "Saadat Rafid Ahmed", url: SITE_URL }],
  creator: "Saadat Rafid Ahmed",
  publisher: "Saadat Rafid Ahmed",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "Saadat Rafid Ahmed",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 400,
        height: 400,
        alt: "Saadat Rafid Ahmed",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/icon.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  category: "technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Saadat Rafid Ahmed",
      description: SITE_DESC,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Saadat Rafid Ahmed",
      url: SITE_URL,
      jobTitle: ["Lecturer", "ML Team Lead"],
      worksFor: [
        {
          "@type": "Organization",
          name: "BRAC University",
          department: "Department of Computer Science and Engineering",
        },
        {
          "@type": "Organization",
          name: "Innospace Infotech Ltd.",
        },
      ],
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "BRAC University",
      },
      knowsAbout: [
        "Natural Language Processing",
        "Machine Learning",
        "Adversarial Machine Learning",
        "Low-Resource NLP",
        "Bengali Language Technology",
        "Retrieval-Augmented Generation",
        "AI for Education",
        "Transfer Learning",
      ],
      sameAs: [
        "https://github.com/saadat-r-ahmed",
        "https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed",
      ],
      email: "mailto:saadat.r.ahmed@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="canonical" href={SITE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics 4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
          }}
        />
        {/* Google Search Console verification — replace content with your verification code */}
        <meta name="google-site-verification" content="0A1aMNMoycZtaUWqRAyuTIwie2HuqDQpmpsPUT5TE4Y" />
      </head>
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
