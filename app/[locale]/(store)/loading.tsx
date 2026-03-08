import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero skeleton */}
      <Skeleton className="h-[85vh] w-full rounded-none sm:h-[90vh]" />

      {/* Collections skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6 lg:py-24">
        <Skeleton variant="text" className="mx-auto h-8 w-48" />
        <Skeleton variant="text" className="mx-auto mt-3 h-4 w-72" />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6 lg:py-24">
        <Skeleton variant="text" className="mx-auto h-8 w-40" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
