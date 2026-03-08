import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero skeleton */}
      <Skeleton className="h-[60vh] w-full rounded-none" />

      {/* Collections skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <Skeleton variant="text" className="mx-auto h-8 w-48" />
        <Skeleton variant="text" className="mx-auto mt-3 h-4 w-72" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <Skeleton variant="text" className="mx-auto h-8 w-40" />
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
