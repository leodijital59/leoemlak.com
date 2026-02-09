import { useState } from "react";
import ModalVideo from "@/components/common/ModalVideo";
import { extractYouTubeId } from "@/lib/formatters";

type Props = {
  videoUrl: string | null
}

const PropertyVideo = ({ videoUrl }: Props) => {
  const [isOpen, setOpen] = useState(false);

  // Extract YouTube ID from URL
  const videoId = videoUrl ? extractYouTubeId(videoUrl) : null;

  // Don't render if no video URL or invalid YouTube ID
  if (!videoId) {
    return null;
  }

  return (
    <div className="row">
      <ModalVideo setIsOpen={setOpen} isOpen={isOpen} videoId={videoId} />
      <div className="col-md-12">
        <div className="property_video bdrs12 w-100">
          <button
            className="video_popup_btn mx-auto popup-img"
            onClick={() => setOpen(true)}
            style={{ border: "none", background: "transparent" }}
          >
            <span className="flaticon-play" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyVideo;
