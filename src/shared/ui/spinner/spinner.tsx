export function Spinner({ size }: { size: number }) {
  return (
    <div className="relative shrink-0 grow flex justify-center items-center ">
      <div
        className={`h-${size} w-${size} absolute rounded-full border-slate-300 border-x-2 animate-spin`}
      ></div>
    </div>
  );
}
