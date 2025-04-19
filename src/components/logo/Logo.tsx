"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo/logo.png";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({
  width = 100,
  height = 100,
  className,
}) => {
  return (
    <Link href="/">
      <div className={`relative ${className}`} style={{ width, height }}>
        <Image
          src={logo}
          alt="TIXFLOW"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 120px, 100px"
        />
      </div>
    </Link>
  );
};

export default Logo;
