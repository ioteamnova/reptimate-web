"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function communityMenu() {
  const pathName = usePathname();
  return (
    <div className="flex justify-between items-center pl-10">
      <nav className="flex gap-4 font-bold">
        <Link href="/" className={pathName === "/" ? "text-[#6D71E6]" : ""}>
          분양글
        </Link>
        <Link
          href="/community/used-deal"
          className={
            pathName === "/community/used-deal" ? "text-[#6D71E6]" : ""
          }
        >
          중고 거래
        </Link>
        <Link
          href="/community/free"
          className={pathName === "/community/free" ? "text-[#6D71E6]" : ""}
        >
          자유 게시판
        </Link>
        <Link
          href="/community/ask"
          className={pathName === "/community/ask" ? "text-[#6D71E6]" : ""}
        >
          질문 게시판
        </Link>
      </nav>
    </div>
  );
}