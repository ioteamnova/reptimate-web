"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilState } from "recoil";
import { recentSearchKeywordsAtom } from "@/recoil/user";

export default function AiMenu(props: any) {

  const [recentSearchKeywords] = useRecoilState(recentSearchKeywordsAtom);

  const mostRecentSearchkeyword = recentSearchKeywords[recentSearchKeywords.length - 1];

  // const setFunctionList: ((state: null) => void)[] = props.setFunctionList;

  // const resetState = () => {
  //   if(setFunctionList){
  //     setFunctionList.forEach((func) => func(null));
  //   }
  // };

  const pathName = usePathname();
  return (
    <div className="w-full mx-auto max-w-screen-xl pl-[40px]">
      <PC>
        <div className="flex justify-between items-center pt-[15px]">
          <nav className="flex gap-4">
            <Link
              href={"/searchresult/integrated?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/integrated" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              통합
            </Link>
            <Link
              href={"/searchresult/adoption?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/adoption" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              분양글
            </Link>
            <Link
              href={"/searchresult/auction?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/auction" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              경매글
            </Link>
            <Link
              href={"/searchresult/market?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/market" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              중고 거래
            </Link>

            <Link
              href={"/searchresult/ask?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/ask" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              질문 게시판
            </Link>

            <Link
              href={"/searchresult/free?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/free" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              자유 게시판
            </Link>
          </nav>
        </div>
      </PC>

      <Mobile>
        <div className="flex justify mt-10 px-4 py-2 bg-gray-300">
        <nav className="flex gap-4">
        <Link
              href={"/searchresult/integrated?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/integrated" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              통합
            </Link>
            <Link
              href={"/searchresult/adoption?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/adoption" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              분양글
            </Link>
            <Link
              href={"/searchresult/auction?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/auction" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
              // onClick={resetState}
            >
              경매글
            </Link>
            <Link
              href={"/searchresult/market?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/market" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              중고 거래
            </Link>

            <Link
              href={"/searchresult/ask?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/ask" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              질문 게시판
            </Link>

            <Link
              href={"/searchresult/free?keyword=" + mostRecentSearchkeyword}
              className={`${
                pathName === "/searchresult/free" ? "text-[#6D71E6] font-bold border-b-2 border-[#6D71E6]" : ""
              } group hover:text-main-color pb-[6px]`}
            >
              자유 게시판
            </Link>
          </nav>
        </div>

      </Mobile>
    </div>
  );
}
