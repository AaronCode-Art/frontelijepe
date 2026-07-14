interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  className?: string;
}

export default function Badge({ children, color = "#0059FF", bg, className = "" }: BadgeProps) {
  const backgroundColor = bg ?? `${color}18`;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
      style={{ color, backgroundColor }}
    >
      {children}
    </span>
  );
}
