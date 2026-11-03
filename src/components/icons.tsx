import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, strokeWidth = 1.5, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10.5" cy="10.5" r="7.5" />
    <path d="m21 21-5.2-5.2" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="7.5" r="4.5" />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1Z" />
  </Icon>
);

export const BagIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="8" width="16" height="13.5" rx="2" />
    <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    <path d="M8.5 11.5h0M15.5 11.5h0" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Icon>
);

export const HandIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 11V6a2 2 0 0 0-4 0" />
    <path d="M14 10V4a2 2 0 0 0-4 0v2" />
    <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    <path d="M13 17.2c-.9-.6-2.2-1.5-2.2-2.6a1.1 1.1 0 0 1 2.2-.3 1.1 1.1 0 0 1 2.2.3c0 1.1-1.3 2-2.2 2.6Z" />
  </Icon>
);

export const LeafIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </Icon>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const GiftIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

/** Bidri Craft ornament mark */
export function LogoMark({ size = 56, ...props }: IconProps) {
  const petal = "M28 4c4 6 6 10.5 6 14.5a6 6 0 0 1-12 0C22 14.5 24 10 28 4Z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {[0, 90, 180, 270].map((r) => (
        <g key={r} transform={`rotate(${r} 28 28)`}>
          <path d={petal} />
          <path d="M28 10.5c1.8 3 2.6 5.3 2.6 7.3a2.6 2.6 0 0 1-5.2 0c0-2 .8-4.3 2.6-7.3Z" />
        </g>
      ))}
      {[45, 135, 225, 315].map((r) => (
        <path
          key={r}
          transform={`rotate(${r} 28 28)`}
          d="M28 11.5c2 2.6 3 4.4 3 6.1a3 3 0 0 1-6 0c0-1.7 1-3.5 3-6.1Z"
        />
      ))}
      <circle cx="28" cy="28" r="3.2" />
    </svg>
  );
}
