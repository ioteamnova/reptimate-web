"use client";
// import { useEffect, useRef, useState } from 'react';
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

// import { getProduct, getProducts } from '@/service/products'
import React, { useCallback, useState, useEffect } from "react";
// import { notFound } from 'next/navigation';
import VideoPlayer from "@/components/action/video-player";
// import ChettingOpen from '../../../../components/action/chetting-open'
import StreamingChatView from "@/components/action/StreamingChatView";

import Image from "next/image";
import unlike_black from "../../../../../public/img/unlike_black.png";
import { getActionInfo } from "@/service/httpconnect/live_stream_axios";
import acitonLiveDto from "@/service/dto/action-live-dto";

type Props = {
  params: {
    slug: string;
  };
};

export default function ActionPage({ params: { slug } }: Props) {
  let data: acitonLiveDto;
  // const [menu, setMenu] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [nickname, setNickname] = useState("");
  const [sideView, setSideView] = useState("chat");

  // const [value1, setValue1]:use = useState()
  // const [count, setCount] = useState(0);
  // const count2 = useRef(0);

  // const product = await getProduct(slug);
  // const newvideoUrl: string =
  //     'https://live.reptimate.store/stream/hls/TGRT-LmGf-wfVX-x8Ax-7jPw/index.m3u8';
  // if (!product) {
  //     notFound();
  // }

  // const macaddress = require('macaddress');
  // console.log(JSON.stringify(macaddress.networkInterfaces(), null, 2));

  useEffect(() => {
    //서버 사이드 렌더링으로 데이터 가져오기
    getActionInfo(callback);

    // let mounted = true
    // console.log('마운트 될 때만 실행된다.');

    // if (mounted) {

    // }

    // return () => {
    //     console.log('컴포넌트가 화면에서 사라짐');
    // };
  }, []);

  function viewChat() {
    if (sideView != "chat") {
      setSideView("chat");
    }
  }
  function viewParticipate() {
    if (sideView != "participate") {
      setSideView("participate");
    }
  }
  function viewBid() {
    if (sideView != "bid") {
      setSideView("bid");
    }
  }

  //데이터 받아오는 부분
  function callback(message: acitonLiveDto): void {
    // console.log("message");
    // console.log(message);

    ///data = message;
    setActionTitle(message.title);
    setNickname(message.UserInfo.nickname);

    if (message.liveStream.state == 1) {
      setVideoUrl(
        `https://live.reptimate.store/stream/hls/${message.liveStream.streamKey}/index.m3u8`
      );
    }
  }

  return (
    <>
      {/* <Script
                src="../../../js/demo.js"
                strategy="lazyOnload"
                onLoad={() =>
                    console.log(`script loaded correctly, window.FB has been populated`)
                }
            /> */}
      <div className="flex flex-col lg:flex-row">
        <div className="flex-auto flex-col">
          <div className="bg-black w-full">
            <VideoPlayer src={videoUrl}></VideoPlayer>
          </div>

          <div className="flex h-[8rem] flex-col py-4 px-6 text-black border-b-[1px] border-gray border-r-[1px] border-gray">
            <span className="basis-1/2 text-left text-lg">{actionTitle}</span>
            <div className="flex text-left basis-1/2">
              <div className="flex basis-1/2">
                <div className="rounded-full bg-purple w-14 h-14"></div>
                <div className="p-[1rem]">{nickname}</div>
              </div>

              <div className="flex basis-1/2 flex-row-reverse text-center">
                <span className="py-[1rem]">22</span>
                <span className="py-[1rem] text-right">
                  <Image
                    src={unlike_black}
                    width={25}
                    height={25}
                    alt="Picture of the author"
                    className="like_btn m-auto"
                  />
                </span>
                <span className="py-[1rem] pe-[1rem]">공유</span>
                <span className="py-[1rem] pe-[1rem]">20명 참여중</span>
              </div>
            </div>
          </div>

          <div className="h-[20rem] p-4 text-start border-r-[1px] border-gray">
            <div className="h-[18rem] rounded-lg bg-silver p-4">
              경매 간단 정보
            </div>
          </div>
        </div>
        <div className="lg:w-[20rem] w-full">
          <StreamingChatView></StreamingChatView>
        </div>
      </div>
    </>
  );
}
