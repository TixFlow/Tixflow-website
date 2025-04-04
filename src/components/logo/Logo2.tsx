"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo/logo2.png";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

const Logo2: React.FC<LogoProps> = ({
  width = 100,
  height = 100,
  className,
}) => {
  return (
    <Link href="/">
      <div className={`relative ${className}`}>
        <Image
          src={logo}
          alt="TIXFLOW"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo2;
