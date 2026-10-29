import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syed Fathahun Nasar | Senior GIS Specialist",
  description:
    "Senior GIS Specialist focused on VPF / VMap vector map production, FME automation, ArcGIS Pro geodatabases and geospatial data quality control.",
};

const EMAIL = "mailtonasar@gmail.com";
const GITHUB = "https://github.com/sdnasar2001";

const expertise = [
  {
    icon: "layers",
    title: "VPF / VMap Production",
    text: "Standards-compliant vector product format deliverables, built and validated against MIL-STD-2407 and MIL-PRF-89035A, down to the binary table level.",
  },
  {
    icon: "flow",
    title: "FME Automation",
    text: "Repeatable FME Workbench pipelines that convert, restructure and validate large datasets, replacing manual steps with reliable automated workflows.",
  },
  {
    icon: "database",
    title: "Geodatabase Design",
    text: "ArcGIS Pro geodatabase schemas, domains and feature classes organised for clean production, editing and downstream export.",
  },
  {
    icon: "check",
    title: "Data Quality Control",
    text: "Schema, attribute and topology checks that catch problems early, with clear reports that make every issue traceable and fixable.",
  },
  {
    icon: "code",
    title: "Python Tooling",
    text: "Custom Python and arcpy tools, from ArcGIS Pro toolboxes to standalone Windows utilities, built around real production problems.",
  },
  {
    icon: "doc",
    title: "Technical Documentation",
    text: "Clear client-facing technical documents and specifications in both English and Arabic.",
  },
];

const tools = [
  "ArcGIS Pro",
  "FME Workbench",
  "Python",
  "arcpy",
  "File Geodatabase",
  "VPF / VMap Level 2",
  "MIL-STD-2407",
  "MIL-PRF-89035A",
  "Topology QC",
  "Binary file formats",
];

const steps = [
  {
    n: "01",
    title: "Understand the specification",
    text: "Read the standard and the client requirements closely, so the data model is right before production starts.",
  },
  {
    n: "02",
    title: "Automate the pipeline",
    text: "Build FME and Python workflows so every run is consistent, fast and easy to repeat.",
  },
  {
    n: "03",
    title: "Validate everything",
    text: "Run schema, attribute and topology checks at every stage instead of only at the end.",
  },
  {
    n: "04",
    title: "Deliver with confidence",
    text: "Hand over clean, documented data that passes client review the first time.",
  },
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "layers":
      return (
        <svg {...common}>
          <path d="M12 3 2 8l10 5 10-5-10-5Z" />
          <path d="m2 13 10 5 10-5" />
          <path d="m2 18 10 5 10-5" opacity="0.5" />
        </svg>
      );
    case "flow":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="6" height="6" rx="1.5" />
          <rect x="15" y="15" width="6" height="6" rx="1.5" />
          <path d="M9 6h4a3 3 0 0 1 3 3v6" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
          <path d="m14 4-4 16" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
          <path d="M14 3v6h6" />
          <path d="M8 13h8M8 17h5" />
        </svg>
      );
  }
}

function Contours() {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern id="graticule" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgb(148 163 184 / 0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#graticule)" />
      <g fill="none" stroke="rgb(45 212 191)" strokeWidth="1.2">
        {rings.map((i) => (
          <ellipse
            key={"a" + i}
            cx="610"
            cy="170"
            rx={30 + i * 36}
            ry={18 + i * 24}
            transform="rotate(-18 610 170)"
            strokeOpacity={0.45 - i * 0.045}
          />
        ))}
      </g>
      <g fill="none" stroke="rgb(52 211 153)" strokeWidth="1">
        {rings.slice(0, 6).map((i) => (
          <ellipse
            key={"b" + i}
            cx="120"
            cy="440"
            rx={26 + i * 34}
            ry={16 + i * 22}
            transform="rotate(14 120 440)"
            strokeOpacity={0.3 - i * 0.045}
          />
        ))}
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-700 antialiased">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2 font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500 text-sm font-bold text-slate-950">
              SN
            </span>
            <span className="hidden sm:inline">Syed Nasar</span>
          </a>
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-300 sm:gap-8">
            <a href="#expertise" className="hover:text-white">Expertise</a>
            <a href="#approach" className="hidden hover:text-white sm:inline">Approach</a>
            <a href="#contact" className="rounded-lg bg-white/10 px-3 py-1.5 text-white hover:bg-white/20">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-slate-950 text-white">
        <Contours />
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 md:pb-32 md:pt-40">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            Senior GIS Specialist
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Syed Fathahun Nasar
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            I build and validate production-grade vector map data, from automated FME pipelines
            and ArcGIS Pro geodatabases to standards-compliant VPF deliverables.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={"mailto:" + EMAIL}
              className="rounded-lg bg-teal-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              Get in touch
            </a>
            <a
              href="#expertise"
              className="rounded-lg border border-white/20 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              View expertise
            </a>
          </div>
          <p className="mt-14 font-mono text-xs tracking-widest text-slate-500">
            VPF | VMAP L2 | FME | ARCGIS PRO | PYTHON | QC
          </p>
        </div>
      </section>

      {/* Expertise */}
      <section id="expertise" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">Expertise</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              What I do
            </h2>
            <p className="mt-4 text-slate-600">
              Focused on the full life of geospatial data: modelling it, producing it, checking it,
              and delivering it to specification.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon name={item.icon} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Tools and standards
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {tools.map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">Approach</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              How I work
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="border-t-2 border-teal-500 pt-5">
                <p className="font-mono text-sm font-semibold text-teal-600">{s.n}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center text-white md:px-14">
          <Contours />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">Have a geospatial data challenge?</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Whether it is a production pipeline, a QC problem or a format conversion, I am happy to
              talk it through.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={"mailto:" + EMAIL}
                className="rounded-lg bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
              >
                {EMAIL}
              </a>
              <a
                href={GITHUB}
                className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>Syed Fathahun Nasar - Senior GIS Specialist</p>
          <p>Built with Next.js and Tailwind CSS</p>
        </div>
      </footer>
    </main>
  );
}
