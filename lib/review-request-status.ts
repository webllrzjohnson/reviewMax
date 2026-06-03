import type { ReviewRequest } from "@/types";

export type ReviewRequestStatus = "pending" | "failed" | "processed";

export function getReviewRequestStatus(
  request: ReviewRequest,
): ReviewRequestStatus {
  if (request.processed_at) return "processed";
  if (request.process_error) return "failed";
  return "pending";
}

export function reviewRequestStatusLabel(status: ReviewRequestStatus): string {
  switch (status) {
    case "processed":
      return "Processed";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
}
