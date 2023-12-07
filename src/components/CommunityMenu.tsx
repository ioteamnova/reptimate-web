"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "./ResponsiveLayout";

export default function CommunityMenu() {
  const pathName = usePathname();
  
  return (
    <div className="w-full mx-auto max-w-screen-xl" style={{paddingLeft:40}}>
      <PC>
        <div className="flex justify-between items-center" style={{paddingTop:15, }}>
          <nav className="flex gap-4">
            <Link
              href="/"
              className={`${
                pathName === null || pathName === "/" || pathName.startsWith("/community/adoption") ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color`}
              style={{paddingBottom:6, }}
            >
              분양글
            </Link>
            <Link
              href="/community/market"
              className={`${
                pathName === "/community/market" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color`}
              style={{paddingBottom:6, }}
            >
              중고 거래
            </Link>
            <Link
              href="/community/free"
              className={`${
                pathName === "/community/free" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color`}
              style={{paddingBottom:6, }}
            >
              자유 게시판
            </Link>
            <Link
              href="/community/ask"
              className={`${
                pathName === "/community/ask" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color `}
              style={{paddingBottom:6, }}
            >
              질문 게시판
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify-center mt-12">
          <nav className="flex gap-5 font-bold text-lg">
            <Link
              href="/ai"
              className={`${
                (pathName === null || pathName === "/" || pathName.startsWith("/community/adoption")) ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              분양글
            </Link>
            <Link
              href="/community/market"
              className={`${
                pathName === "/community/market" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              중고 거래
            </Link>
            <Link
              href="/community/free"
              className={`${
                pathName === "/community/free" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              자유 게시판
            </Link>
            <Link
              href="/community/ask"
              className={`${
                pathName === "/community/ask" ? "text-[#6D71E6]" : ""
              } group hover:text-main-color`}
            >
              질문 게시판
            </Link>
          </nav>
        </div>
      </Mobile>
    </div>
  );
}
