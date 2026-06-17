import SuccessScreen from "@/components/ui/SuccessScreen";

export default function ConsultationSuccess() {
  return (
    <SuccessScreen
      title="Consultation Requested"
      message="We've received your request. Our team will confirm your appointment and reach out at the scheduled time."
      linkHref="/dashboard"
      linkLabel="Back to Dashboard"
    />
  );
}
