import { Skeleton, ProductCardSkeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <Skeleton variant="text" className="h-10 w-60" />
      <Skeleton variant="text" className="mt-3 h-4 w-96" />
      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
