export default function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border animate-pulse">
      <div className="relative aspect-[2/3] bg-muted"></div>
      <div className="p-3">
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/4"></div>
      </div>
    </div>
  );
}
