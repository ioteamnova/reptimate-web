/* eslint-disable @next/next/no-img-element */
import { Auction } from "@/service/my/auction";
import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "../ResponsiveLayout";
import { formatTimeDifference, formatViews } from "@/utils/dateFormat";

type Props = { post: Auction };
export default function AuctionPostCard({
  post: {
    idx,
    createdAt,
    currentPrice,
    unit,
    endTime,
    gender,
    size,
    variety,
    state,
    title,
    thumbnail,
    profilePath,
    nickname,
  },
}: Props) {
  function formatDateToCustomString(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  }

  function setStateString(state: string): string {
    let str = "";
    if (state == "selling") {
      str = "";
    } else if (state == "end") {
      str = "종료";
    } else {
      str = "임시저장";
    }
    return str;
  }
  const imgStyle = {
    paddingBottom: "100%",
    position: "relative" as "relative",
  };
  return (
    <div >
        <PC>
          <div className="relative">
            <Link
              href={`/auction/posts/${idx}`}
            >
              {/* 대표 이미지 부분 */}
              <div className="relative w-[233.59px] h-[233.59px] overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10 opacity-40"></div>
                <img
                  className="object-cover w-full h-full"
                  src={
                    thumbnail !== null ? thumbnail : "/img/reptimate_logo.png"
                  }
                  width={233.59}
                  height={233.59}
                  alt={""}
                  style={{ zIndex: 1 }}
                />
              </div>
              {/* 작성자 정보 */}
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <img
                  className="ml-2 w-8 h-8 rounded-full border-2"
                  width={10}
                  height={10}
                  src={
                    profilePath !== null
                      ? profilePath
                      : "/img/reptimate_logo.png"
                  }
                  alt={""}
                />
                <p className="text-white font-semibold ml-1">{nickname}</p>
              </div>
              <div className={`${
                    state === "selling"
                      ? ""
                      : state === "end"
                      ? "bg-black px-1 rounded-md opacity-80"
                      : "text-main-color font-bold"
                  } absolute right-3 flex items-center z-[999]`}  style={{top:10, height:18}}>
                <p
                  className={`text-white text-lg z-[999] relative`}
                  style={{fontSize:12,}}
                >
                  {setStateString(state)}
                </p>
              </div>
            </Link>
          </div>
        </PC>
        <Mobile>
          <Link
              style={{ marginBottom:16}}
              href={`/auction/posts/${idx}`}
          >
            <div style={{}}>

              {/* 대표 이미지 부분 */}
              <div className="relative h-[183.5.59px] overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10 opacity-40"></div>
                <div style={imgStyle}>
                  <img
                    className="object-cover absolute inset-0 w-full h-full"
                    height={183.5}
                    src={
                      thumbnail !== null ? thumbnail : "/img/reptimate_logo.png"
                    }
                    alt=""
                    style={{ zIndex: 1 }}
                  />
                </div>
                {/* 작성자 정보 */}
                <div className="absolute bottom-0 left-0 mb-1 flex items-center z-20">
                  {/* 작성자 프로필 이미지 */}
                  <img
                    className="ml-1 rounded-full border-2 object-cover"
                    width={20}
                    height={20}
                    src={
                      profilePath !== null
                        ? profilePath
                        : "/img/reptimate_logo.png"
                    }
                    style={{width:20, height:20}}
                    alt={"profile"}
                  />
                  <p className="text-white font-semibold text-sm ml-1">
                    {nickname}
                  </p>
                </div>
                <div className={`${
                    state === "selling"
                      ? ""
                      : state === "end"
                      ? "bg-black px-1 rounded-md opacity-80"
                      : "text-main-color font-bold"
                  } absolute right-3 flex items-center z-[999]`}  style={{top:10, height:18}}>
                  <p
                    className={`text-white text-lg z-[999] relative`}
                    style={{fontSize:12,}}
                  >
                    {setStateString(state)}
                  </p>
                </div>
              </div>
            </div>
            {/* 게시글 정보 부분 */}
            <div className="ml-[5px]">
              <h3 className="text-[14px]">{title}</h3>
              <div className="w-full flex flex-row items-center">
                <p className="text-[15px] mr-1">
                  {state === "selling" ? "현재 입찰가 : " : "낙찰가 : "}
                </p>
                <p className="font-bold text-[15px]">
                  {currentPrice ? currentPrice : "---"}
                </p>
                <p className="text-sm ml-1">원</p>
              </div>
              <div className="flex items-center">
                <p
                  className={`text-xs  text-white p-0.5 rounded font-bold text-[13px] ${
                    gender === "수컷"
                      ? "bg-gender-male-color"
                      : gender === "암컷"
                      ? "bg-gender-female-color"
                      : "bg-gray-400"
                  }`}
                >
                  {gender}
                </p>
                <p className="text-xs mx-1 text-white bg-gray-400 p-0.5 rounded font-bold text-[13px]">
                  {size}
                </p>
              </div>
              <div className="flex items-center ">
                <p className="text-[13px] text-[#606060]">{formatTimeDifference(createdAt)}</p>
                  
              </div>
            </div>
          </Link>
        </Mobile>
        <PC>
          <div className="ml-[5px]">
            <h3 className="text-[14px]">{title}</h3>
            <div className="w-full flex flex-row items-center">
              <p className="text-[15px] mr-1">
                {state === "selling" ? "현재 입찰가 : " : "낙찰가 : "}
              </p>
              <p className="font-bold text-[15px]">
                {currentPrice ? currentPrice : "---"}
              </p>
              <p className="text-sm ml-1">원</p>
            </div>
            <div className="flex items-center">
              <p
                className={`text-xs  text-white p-0.5 rounded font-bold text-[13px] ${
                  gender === "수컷"
                    ? "bg-gender-male-color"
                    : gender === "암컷"
                    ? "bg-gender-female-color"
                    : "bg-gray-400"
                }`}
              >
                {gender}
              </p>
              <p className="text-xs mx-1 text-white bg-gray-400 p-0.5 rounded font-bold text-[13px]">
                {size}
              </p>
            </div>
            <div className="flex items-center ">
              <p className="text-[13px] text-[#606060]">{formatTimeDifference(createdAt)}</p>
                
            </div>
          </div>
        </PC>
    
    </div>
  );
}
