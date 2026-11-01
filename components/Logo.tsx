import { BASE } from "@/lib/site";

/**
 * The AR Cafe badge logo (navy and gold). Files live in public/brand/:
 * ar-cafe-logo.png (1024 px, transparent) and the smaller .webp copies used on the site.
 */
export default function Logo({ className = "", alt = "AR Cafe", eager = false, size = 256 }: { className?: string; alt?: string; eager?: boolean; size?: 256 | 512 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}/brand/ar-cafe-logo-${size}.webp`}
      srcSet={`${BASE}/brand/ar-cafe-logo-256.webp 256w, ${BASE}/brand/ar-cafe-logo-512.webp 512w`}
      sizes={size === 512 ? "(max-width: 768px) 60vw, 320px" : "96px"}
      alt={alt}
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`aspect-square select-none ${className}`}
      draggable={false}
    />
  );
}
