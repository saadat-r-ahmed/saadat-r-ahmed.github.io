import {
  education,
  interests,
  links,
  news,
  profile,
  publications,
  research,
  sharedTasks,
  software,
  statement,
  teaching,
} from "@/content";

const navLinks = [
  { label: "news", href: "#news" },
  { label: "publications", href: "#publications" },
  { label: "research", href: "#research" },
  { label: "teaching", href: "#teaching" },
  { label: "contact", href: "#contact" },
  { label: "cv", href: "/cv.pdf" },
];

// Stroke icons, inline so the page ships no icon dependency.
const icons: Record<string, React.ReactNode> = {
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 5L2 7" />
    </>
  ),
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"
    />
  ),
  university: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-4.5 7 4.5v11" />
      <path d="M9.5 21v-5.5h5V21" />
    </>
  ),
  scholar: (
    <>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12.5V17c3.5 2.5 8.5 2.5 12 0v-4.5" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A5 5 0 0 1 16 8Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  cv: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </>
  ),
};

function Icon({ name, label, href }: { name: string; label: string; href: string }) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-muted transition-colors hover:text-accent"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[name]}
      </svg>
    </a>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 border-t border-rule pt-10">
      <h2 className="h-section">{title}</h2>
      {children}
    </section>
  );
}

type EntryData = {
  title: string;
  org: string;
  meta?: string | null;
  period: string;
  body: string;
};

function Entry({ entry }: { entry: EntryData }) {
  return (
    <article className="mb-7 last:mb-0">
      <div className="entry-head">
        <h3 className="font-slab font-medium leading-snug">{entry.title}</h3>
        <span className="whitespace-nowrap font-sans text-[12.5px] text-muted">
          {entry.period}
        </span>
      </div>
      <p className="text-[15px] italic text-muted">
        {entry.org}
        {entry.meta ? ` · ${entry.meta}` : ""}
      </p>
      <p className="mt-2 text-[15px] text-ink/85">{entry.body}</p>
    </article>
  );
}

/** al-folio bib entry: venue badge in the gutter, record + action buttons beside it. */
function BibEntry({
  abbr,
  children,
}: {
  abbr: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7 grid grid-cols-1 gap-x-5 gap-y-2 last:mb-0 sm:grid-cols-[86px_1fr]">
      <div className="max-w-[86px]">
        <div className="badge">{abbr}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function Home() {
  const visibleLinks = links.filter((link) => link.url);
  const socials = [
    { name: "email", label: "Email", href: `mailto:${profile.emails[0]}` },
    ...visibleLinks.map((l) => ({ name: l.icon, label: l.label, href: l.url })),
  ];

  return (
    <>
      <nav className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-1 px-6 py-3">
          <a
            href="#"
            className="mr-auto font-slab text-[15px] font-medium text-ink hover:no-underline"
          >
            {profile.name}
          </a>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[13.5px] text-muted hover:text-accent hover:no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
        <header>
          <h1 className="font-slab text-[2.7rem] font-light leading-none tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-3 font-sans text-[15px] text-muted">
            {profile.role} ·{" "}
            <a
              href="https://cse.sds.bracu.ac.bd/faculty_profile/311/saadat_rafid_ahmed"
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.affiliation}
            </a>{" "}
            · {profile.location}
          </p>

          {/* Portrait floats so the bio wraps around it, as on an al-folio about page. */}
          <figure className="mb-6 mt-8 md:float-right md:mb-4 md:ml-8 md:mt-2 md:w-[210px]">
            <img
              src="/icon.png"
              alt={profile.name}
              width={210}
              height={210}
              className="mx-auto w-[170px] rounded-lg border border-rule bg-white p-4 shadow-sm md:w-[210px]"
            />
            <figcaption className="mt-3 text-center font-sans text-[12.5px] leading-relaxed text-muted md:text-left">
              {profile.emails.map((email) => (
                <span key={email}>
                  <a href={`mailto:${email}`}>{email}</a>
                  <br />
                </span>
              ))}
              {profile.location}
            </figcaption>
          </figure>

          <div className="mt-8 space-y-4">
            {statement.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="clear-both flex flex-wrap items-center gap-5 pt-8">
            {socials.map((s) => (
              <Icon key={s.label} name={s.name} label={s.label} href={s.href} />
            ))}
          </div>
        </header>

        <Section id="news" title="news">
          <dl className="divide-y divide-rule border-y border-rule">
            {news.map((item) => (
              <div
                key={item.date}
                className="flex flex-col gap-x-5 py-3 sm:flex-row sm:items-baseline"
              >
                <dt className="whitespace-nowrap font-sans text-[12.5px] font-medium text-accent sm:w-[80px] sm:shrink-0">
                  {item.date}
                </dt>
                <dd className="text-[15px]">{item.text}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="publications" title="selected publications">
          <p className="mb-6 font-sans text-[12.5px] text-muted">
            An asterisk denotes first or corresponding author.
          </p>
          {publications.map((pub) => (
            <BibEntry key={pub.title} abbr={pub.abbr}>
              <h3 className="font-slab font-medium leading-snug">{pub.title}</h3>
              <p className="text-[15px]">
                <strong className="font-medium">{pub.authors}</strong>
                {pub.firstAuthor ? "*" : ""}
              </p>
              <p className="text-[14.5px] italic text-muted">
                {pub.venue}, {pub.year}
              </p>
              {pub.note && <p className="mt-1 text-[14.5px] text-muted">{pub.note}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {pub.url && (
                  <a
                    className="btn"
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    arXiv
                  </a>
                )}
                {pub.bibtex && (
                  <details className="w-auto open:w-full">
                    <summary className="btn cursor-pointer list-none">BibTeX</summary>
                    <pre className="mt-2 overflow-x-auto rounded border border-rule bg-accent-soft/50 p-3 font-sans text-[12px] leading-relaxed text-ink/80">
                      {pub.bibtex}
                    </pre>
                  </details>
                )}
              </div>
            </BibEntry>
          ))}

          <h3 className="h-sub mb-4 mt-10">Benchmarks and Open-Source Tooling</h3>
          {software.map((item) => (
            <BibEntry key={item.name} abbr={item.abbr}>
              <h4 className="font-slab font-medium">{item.name}</h4>
              <p className="text-[14.5px] italic text-muted">{item.role}</p>
              <p className="mt-1 text-[15px]">{item.desc}</p>
            </BibEntry>
          ))}

          <h3 className="h-sub mb-4 mt-10">Shared Task Participation</h3>
          {sharedTasks.map((item) => (
            <BibEntry key={item.name} abbr={item.abbr}>
              <h4 className="font-slab font-medium">{item.name}</h4>
              <p className="text-[14.5px] italic text-muted">{item.role}</p>
              <p className="mt-1 text-[15px]">{item.desc}</p>
            </BibEntry>
          ))}
        </Section>

        <Section id="research" title="research">
          <h3 className="h-sub mb-2">Current Interests</h3>
          <p className="mb-4 text-[15px]">{interests.current.join(" · ")}</p>
          <h3 className="h-sub mb-2">Intended Direction</h3>
          <p className="mb-8 text-[15px]">{interests.intended}</p>
          {research.map((entry) => (
            <Entry key={entry.title} entry={entry} />
          ))}
        </Section>

        <Section id="education" title="education">
          <Entry
            entry={{
              title: education.degree,
              org: `${education.org}, ${education.location}`,
              period: education.period,
              body: education.body,
            }}
          />
        </Section>

        <Section id="teaching" title="teaching">
          {teaching.map((entry) => (
            <Entry key={entry.title} entry={entry} />
          ))}
        </Section>

                                        <Section id="contact" title="contact">
          <p className="text-[15px]">
            {profile.emails.map((email) => (
              <span key={email}>
                <a href={`mailto:${email}`}>{email}</a>
                <br />
              </span>
            ))}
            {profile.affiliation}, {profile.location}
          </p>
        </Section>
      </main>

      <footer className="border-t border-rule py-6">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-6 font-sans text-[12.5px] text-muted">
          <span>
            &copy; {new Date().getFullYear()} {profile.name}
          </span>
          <span>Last updated September 2026</span>
        </div>
      </footer>
    </>
  );
}
