"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItemProps[];
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <Breadcrumb className="absolute top-10 left-10">
      <BreadcrumbList className="flex items-center space-x-2">
        {items.map((item, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink asChild>
              <Link
                href={item.href}
                className={` ${
                  pathname === item.href ? "text-white font-bold" : ""
                }`}
              >
                {item.label}
              </Link>
            </BreadcrumbLink>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
