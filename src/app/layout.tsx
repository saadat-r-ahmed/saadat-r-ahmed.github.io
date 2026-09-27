import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://saadat-r-ahmed.github.io";
const SITE_TITLE =
  "Saadat Rafid Ahmed — Lecturer, Computer Science and Engineering, BRAC University";
const SITE_DESC =
  "Academic homepage of Saadat Rafid Ahmed, Lecturer in Computer Science and Engineering at BRAC University. Research on sequence models, learning under label scarcity, and the robustness of transfer-learned representations. Seeking a fully funded PhD in bioinformatics and computational genomics.";
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
    "computational genomics",
    "bioinformatics PhD applicant",
    "sequence modeling",
    "representation learning",
    "adversarial robustness",
    "transfer learning robustness",
    "low-resource NLP",
    "machine learning under label scarcity",
    "retrieval-augmented generation",
    "BRAC University",
    "Dhaka Bangladesh",
    "academic homepage",
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
    type: "profile",
    images: [{ url: "/icon.png", width: 400, height: 400, alt: "Saadat Rafid Ahmed" }],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/icon.png"],
  },
  alternates: { canonical: SITE_URL },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  category: "science",
};

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
      jobTitle: "Lecturer",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "BRAC University",
        department: "Department of Computer Science and Engineering",
      },
      worksFor: [
        {
          "@type": "CollegeOrUniversity",
          name: "BRAC University",
          department: "Department of Computer Science and Engineering",
        },
        { "@type": "Organization", name: "Innospace Infotech Ltd." },
      ],
      alumniOf: { "@type": "CollegeOrUniversity", name: "BRAC University" },
      knowsAbout: [
        "Sequence Modeling",
        "Representation Learning",
        "Machine Learning under Label Scarcity",
        "Robustness of Transfer-Learned Models",
        "Natural Language Processing",
        "Low-Resource Language Technology",
        "Retrieval-Augmented Generation",
        "Bioinformatics",
        "Computational Genomics",
      ],
      sameAs: [
        "https://github.com/saadat-r-ahmed",
        "https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed",
      ],
      email: ["mailto:saadat.r.ahmed@gmail.com", "mailto:saadat.ahmed@bracu.ac.bd"],
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
    <html lang="en">
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
        <meta
          name="google-site-verification"
          content="0A1aMNMoycZtaUWqRAyuTIwie2HuqDQpmpsPUT5TE4Y"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
