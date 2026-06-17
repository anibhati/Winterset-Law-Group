import { ApprovalsSkeleton } from "@/components/ui/Skeleton";

export default function ApprovalsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-xl" />
      </div>
      <ApprovalsSkeleton />
    </div>
  );
}
