import Image from "next/image";
import Link from "next/link";
import { Mobile, PC } from "./ResponsiveLayout";
import { Posts } from "@/service/my/board";
import { formatTimeDifference, formatViews } from "@/utils/dateFormat";

type Props = { post: Posts };
export default function PostCard({
  post: {
    idx,
    view,
    userIdx,
    title,
    category,
    writeDate,
    thumbnail,
    nickname,
    profilePath,
  },
}: Props) {
  const imgStyle = {
    paddingBottom: "100%",
    position: "relative" as "relative",
  };
  
  return (
    <div >
        <PC>
          <div className="relative">
            <Link
              href={`/community/${category}/posts/[idx]`}
              as={`/community/${category}/posts/${idx}`}
            >
              {/* 대표 이미지 부분 */}
              <div className="relative w-[233.59px] h-[233.59px] overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10 opacity-40"></div>
                <Image
                  className="object-cover w-full h-full"
                  src={
                    thumbnail !== null
                      ? thumbnail
                      : "/img/reptimate_logo.png"
                  }
                  width={233.59}
                  height={233.59}
                  alt={"post"}
                  style={{ zIndex: 1 }}
                />
              </div>
              {/* 작성자 정보 */}
              <div className="absolute bottom-0 left-0 mb-2 flex items-center z-20">
                <Image
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
            </Link>
          </div>
        </PC>
        <Mobile>
          <Link
              style={{ marginBottom:16}}
              href={`/community/${category}/posts/[idx]`}
              as={`/community/${category}/posts/${idx}`}
          >
            <div style={{width:183.5}}>
              {/* 대표 이미지 부분 */}
              <div className="relative h-[183.5.59px] overflow-hidden hover:border-2 hover:border-main-color rounded-md">
                {/* 대표 이미지 쉐도우 */}
                <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-gray-400 via-transparent to-transparent z-10 opacity-40"></div>
                <div style={imgStyle}>
                  <Image
                    className="object-cover absolute inset-0 w-full h-full"
                    width={183.5}
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
                  <Image
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
              </div>
            </div>
            {/* 게시글 정보 부분 */}
            <div className="w-[183.5px]">
              {/* 제목 */}
              <h3 className="text-[14px]">{title}</h3>
              
              <div className="flex items-center ">
                <p className="text-[13px] text-[#606060]">조회수</p>
                <p className="text-[13px] text-[#606060] ml-0.5">{formatViews(view)}</p>
                <p className="text-[13px] text-[#606060] ml-1">{formatTimeDifference(writeDate)}</p>
              </div>
            </div>
          </Link>
        </Mobile>
        <PC>
          <div className="mt-1 mb-6 flex flex-col">
            <div style={{marginLeft:10}}>
              <h3 className="text-[14px]">{title}</h3>
              <div className="flex items-center ">
                <p className="text-[13px] text-[#606060]">조회수</p>
                <p className="text-[13px] text-[#606060] ml-0.5">{formatViews(view)}</p>
                <p className="text-[13px] text-[#606060] ml-1">{formatTimeDifference(writeDate)}</p>
              </div>
            </div>
          </div>
        </PC>
    
    </div>
  );
}
