import { ProductGridSkeleton } from '../../../components/site/ProductGridSkeleton';
import { Skeleton } from '../../../components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
      <Skeleton className="h-9 w-48 mb-8" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:shrink-0">
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="flex-1">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
