import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <Skeleton variant="text" className="mb-6 h-4 w-48" />
      <div className="grid gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="flex flex-col gap-4 py-4">
          <Skeleton variant="text" className="h-8 w-3/4" />
          <Skeleton variant="text" className="h-6 w-24" />
          <Skeleton variant="text" className="mt-4 h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
          <Skeleton variant="text" className="h-4 w-2/3" />
          <Skeleton className="mt-8 h-14 w-full" />
        </div>
      </div>
    </div>
  );
}
