import { Course } from "@/types/types";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

function ShareBtns({ course }: { course: Course }) {
  const shareUrl = `${process.env.SHARE_URL}/courses/${course._id}`;

  return (
    <div className="border border-gray-400 rounded-md mb-4">
      <h3 className="text-xl font-bold text-center pt-2">Share This Course</h3>
      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton url={shareUrl} hashtag={`Personal house ForRent`}>
          <FacebookIcon size={40} round={true} />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={course.title}
          hashtags={[`Personal house ForRent`]}
        >
          <TwitterIcon size={40} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton
          url={shareUrl}
          title={course.title}
          separator=":: "
        >
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={course.title}
          body={`Check out this property listing : ${shareUrl}`}
        >
          <EmailIcon size={40} round={true} />
        </EmailShareButton>
      </div>
    </div>
  );
}

export default ShareBtns;
