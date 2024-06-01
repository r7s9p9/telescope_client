export function Spinner({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <div
      style={{ height: size, width: size }}
      className={`rounded-full border-slate-300 border-x-2 animate-spin duration-300 ${className || ""}`}
    />
  );
}
