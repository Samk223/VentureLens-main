export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Magnifying glass circle */}
      <circle cx="45" cy="55" r="28" stroke="currentColor" strokeWidth="8" />
      {/* Magnifying glass handle */}
      <line x1="65" y1="75" x2="85" y2="95" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      {/* Line chart going up */}
      <path d="M 15 75 L 35 45 L 50 60 L 75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow head */}
      <path d="M 55 25 L 75 25 L 75 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
