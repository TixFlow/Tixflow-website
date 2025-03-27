import { StaticImageData } from "next/image";
import image1 from "../../../public/assets/slide/1.jpg";
import image2 from "../../../public/assets/slide/2.jpg";
import image3 from "../../../public/assets/slide/3.jpg";
import image4 from "../../../public/assets/slide/4.png";

interface SlideImage {
  src: StaticImageData;
  title: string;
  description: string;
}
const images: SlideImage[] = [
  {
    src: image1,
    title: "Tixflow - Nền tảng trao đổi vé tiện lợi",
    description: "Mua – bán vé một cách minh bạch, nhanh chóng và an toàn.",
  },
  {
    src: image2,
    title: "Sự kiện hot? Vé ở đây!",
    description: "Cập nhật vé sự kiện mới nhất, từ concert đến hội thảo.",
  },
  {
    src: image3,
    title: "Tự do giao dịch, không lo rủi ro",
    description:
      "Xác thực vé, bảo vệ người dùng, giảm thiểu rủi ro từ giao dịch tay đôi.",
  },
  {
    src: image4,
    title: "Bán vé đã mua? Chuyện nhỏ!",
    description: "Không đi được? Đăng bán lại chỉ với vài cú click.",
  },
];

export default images;
