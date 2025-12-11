import { ContactPageBannerManage } from "@/components/admin/contact-page-banner-manage";
import { BranchManage } from "@/components/admin/branch-manage";
import { ContactMessages } from "@/components/admin/contact-messages";

export default function ContactAdminPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ContactPageBannerManage />
      <BranchManage />
      <ContactMessages />
    </div>
  );
}


