import EmergencyContactsEdit from "@/page-components/admin/EmergencyContactsEdit";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Emergency Contacts | Admin Portal",
};

export default function EmergencyContactsPage() {
  return <EmergencyContactsEdit />;
}
