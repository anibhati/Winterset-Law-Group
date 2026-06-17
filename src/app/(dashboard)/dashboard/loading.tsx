import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      <DashboardSkeleton />
    </div>
  );
}
