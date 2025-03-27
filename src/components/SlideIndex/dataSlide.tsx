import { StaticImageData } from "next/image";
import image1 from "../../../public/assets/slide/1.jpg";
import image2 from "../../../public/assets/slide/2.jpg";
import image3 from "../../../public/assets/slide/3.jpg";
import image4 from "../../../public/assets/slide/4.jpg";
import image5 from "../../../public/assets/slide/5.jpg";
import image6 from "../../../public/assets/slide/6.jpg";
import image7 from "../../../public/assets/slide/7.jpg";

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
  {
    src: image5,
    title: "Vé hết? Luôn có người nhượng lại!",
    description: "Chỉ cần tìm, là thấy ngay người có vé bạn cần.",
  },
  {
    src: image6,
    title: "Tixflow bảo vệ quyền lợi bạn",
    description: "Cam kết minh bạch, hoàn tiền khi có vấn đề.",
  },
  {
    src: image7,
    title: "Trải nghiệm mượt mà – mọi lúc mọi nơi",
    description: "Không đi được? Đăng bán lại chỉ với vài cú click.",
  },
  {
    src: image4,
    title: "Giao diện đơn giản, dùng dễ cả trên điện thoại và máy tính.",
    description: "Không đi được? Đăng bán lại chỉ với vài cú click.",
  },
];

export default images;
