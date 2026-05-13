import { redirect } from "next/navigation";

// Payment plan requests are handled through the get-started wizard
export default function PaymentPage() {
  redirect("/get-started");
}
