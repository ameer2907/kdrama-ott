export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 sm:w-44">
      <div className="skeleton rounded-lg aspect-[2/3]" />
      <div className="mt-2 space-y-1.5">
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-2.5 w-3/5 rounded" />
      </div>
    </div>
  );
}
