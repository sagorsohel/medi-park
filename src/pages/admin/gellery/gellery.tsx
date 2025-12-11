import { GalleryPageBannerManage } from "@/components/admin/gallery-page-banner-manage";
import { GalleryManage } from "@/components/admin/gallery-manage";

export default function GelleryPageManage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <GalleryPageBannerManage />
      <GalleryManage />
    </div>
  );
}


