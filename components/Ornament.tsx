/** Classical gold scroll divider: twin curled scrolls around a diamond, with hairlines to each side. */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 28" className={`h-auto w-56 sm:w-72 ${className}`} aria-hidden>
      <g fill="none" stroke="#D6B477" strokeWidth="1.1" strokeLinecap="round">
        <path d="M128 14C120 4 106 3 102 9C99 13 104 17 107 13C109 10 105 8 104 10 M128 14C120 24 106 25 102 19C99 15 104 11 107 15C109 18 105 20 104 18 M100 14H6" />
        <path d="M152 14C160 4 174 3 178 9C181 13 176 17 173 13C171 10 175 8 176 10 M152 14C160 24 174 25 178 19C181 15 176 11 173 15C171 18 175 20 176 18 M180 14H274" />
      </g>
      <g fill="#D6B477">
        <path d="M140 4l10 10-10 10-10-10z" />
        <circle cx="140" cy="14" r="2.4" className="fill-ink" />
        <circle cx="6" cy="14" r="1.6" />
        <circle cx="274" cy="14" r="1.6" />
      </g>
    </svg>
  );
}

/** The ornament centred on the top edge of a section, straddling the boundary. */
export function SectionOrnament({ inside = false }: { inside?: boolean }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 z-[1] flex justify-center ${inside ? "top-8" : "top-0 -translate-y-1/2"}`}>
      <span>
        <Ornament />
      </span>
    </div>
  );
}
