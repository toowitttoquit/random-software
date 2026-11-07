interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 680 110"
      className={className}
      aria-label="Random Software"
      role="img"
    >
      <text
        className="fill-brand-green"
        fontFamily="var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif"
        fontWeight={700}
        fontSize={64}
        dominantBaseline="middle"
        textAnchor="middle"
        x={36}
        y={56}
      >
        {"{"}
      </text>

      <text
        className="fill-base-text"
        fontFamily="var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif"
        fontWeight={700}
        fontSize={52}
        dominantBaseline="middle"
        textAnchor="middle"
        x={340}
        y={56}
      >
        Random Software
      </text>

      <text
        className="fill-brand-green"
        fontFamily="var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif"
        fontWeight={700}
        fontSize={64}
        dominantBaseline="middle"
        textAnchor="middle"
        x={644}
        y={56}
      >
        {"}"}
      </text>
    </svg>
  );
}
