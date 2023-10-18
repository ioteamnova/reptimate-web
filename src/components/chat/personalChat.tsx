'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

import ChatList from "@/components/chat/ChatList"
import PersonalChatBox from "@/components/chat/ChatBox"
import {chatRoom,connectMessage,Ban_Message,userInfo, getResponseChatList } from "@/service/chat/chat"

import  { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate"
import { userAtom, isLoggedInState } from "@/recoil/user";
import { chatRoomState, chatRoomVisisibleState, chatNowInfoState} from "@/recoil/chatting";
import { useRecoilState, useSetRecoilState } from "recoil";

interface IMessage {
  userIdx: number;
  socketId: string;
  message: string;
  room: string;
}
interface DMessage {
  userIdx: number;
  score: number;
  room: string;
}
export default function PersonalChat() {
  const [sendMessage, setSendMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [textMsg, settextMsg] = useState('');
  const [roomName, setroomName] = useState('');
  const [data, setData] = useState<getResponseChatList | null>(null);
  const [chatRoomData, setchatRoomData] = useState<chatRoom[]>([]);
  const [existNextPage, setENP] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const target = useRef(null);

  const [move, setMove] = useState(false);

  const [userIdx, setUserIdx] = useState<number>(0); // 유저의 userIdx 저장
  const [nickname, setNickname] = useState("");
  const [profilePath, setProfilePath] = useState(""); // 유저의 userIdx 저장
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);

  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const setchatRoomState = useSetRecoilState(chatRoomState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(chatRoomVisisibleState);
  const [chatNowInfo, setchatNowInfo] = useRecoilState(chatNowInfoState);
  // const [chatRoom, setchatRoom] = useRecoilState(chatRoomState);

  const options = {
    threshold: 1.0,
  };

  useEffect(() => {
    const storedData = localStorage.getItem('recoil-persist');
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
        //입장한 사용자의 idx지정
        setUserIdx(userData.USER_DATA.idx);
        // 입장한 사용자의 이름, 프로필 이미지 지정
        setNickname(userData.USER_DATA.nickname);
        setProfilePath(userData.USER_DATA.profilePath);

        //getChatRoomList(accessToken);
        // setchatRoomData([])
      } else {
      }
    }
  }, [])

  useEffect(() => {
    setchatRoomData([])
    if (!chatRoomVisisible) {
      const storedData = localStorage.getItem('recoil-persist');
      if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.USER_DATA.accessToken) {
          const extractedAccessToken = userData.USER_DATA.accessToken;
          getChatRoomList(extractedAccessToken);
        } else {
        }
      }
    } else {
      setchatRoomData([])
    }
  }, [chatRoomVisisible]);

  // chatRoomData가 업데이트될 때 호출되는 useEffect
  // useEffect(() => {
    
  // }, [chatRoomData]);

  // 채팅방 리스트 불러오기
  const getChatRoomList = async (accessToken: string) => {
    console.log("=============getChatRoomList() : personalChat.tsx================")
    setLoading(true);
    const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    };
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_URL}/chat/list`, config);
        setData((prevData) =>
        ({
          result: {
            items: [
              ...(prevData?.result.items || []),
              ...response.data.result.items,
            ],
            existsNextPage: response.data.result.existsNextPage,
          },
        } as getResponseChatList));
        const combinedItems = [
          ...(chatRoomData || []),
          ...response.data.result.items,
        ];
        // updatedAt를 Date로 변환하고 내림차순으로 정렬합니다.
        const sortedArray: chatRoom[] = combinedItems.sort((a, b) => {
          const dateA: Date = new Date(a.chatRoom.updatedAt);
          const dateB: Date = new Date(b.chatRoom.updatedAt);

          // 내림차순으로 정렬하려면 dateB - dateA를 반환합니다.
          return dateB.getTime() - dateA.getTime();
        });
        setchatRoomData(sortedArray);
        console.log("=============getChatRoomList() : personalChat.tsx : 성공================")
        console.log(response.data)
        console.log("=============================")
        // console.log(response.data?.result)
        setENP(response.data?.result.existsNextPage);
        setPage((prevPage) => prevPage + 1);
    } catch (error: any) {
      console.log("=========getChatRoomList() : personalChat.tsx : catch (error: any)========")
      console.log(error)
      console.log("======================")
        if(error.response.status == 401) {
            const storedData = localStorage.getItem('recoil-persist');
            if (storedData) {
                const userData = JSON.parse(storedData);
                if (userData.USER_DATA.accessToken) {
                    const extractedARefreshToken = userData.USER_DATA.refreshToken;
                    reGenerateTokenMutation.mutate({
                        refreshToken: extractedARefreshToken
                    }, {
                        onSuccess: (data) => {
                            // api call 재선언
                            console.log("accessToken 만료로 인한 재발급")
                            if(userData.USER_DATA.accessToken != data) {
                              getChatRoomList(data);
                            } else {
                              // router.replace("/");
                              // setIsLoggedIn(false)
                              // alert("로그인 만료\n다시 로그인 해주세요");
                            }
                        },
                        onError: () => {
                            // router.replace("/");
                            // setIsLoggedIn(false)
                            // alert("로그인 만료\n다시 로그인 해주세요");
                        }
                    });
                } else {
                }
            }
        }
    }
  setLoading(false);
  };

useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && existNextPage) {
            getChatRoomList(accessToken);
            console.log("useEffect[getChatRoomList, existNextPage, loading, options]")
          }
      });
  }, options);
  if (target.current) {
    observer.observe(target.current);
  }
  return () => {
    if (target.current) {
      observer.unobserve(target.current);
    }
  };
}, [getChatRoomList, existNextPage, loading, options]);

// 채팅방 입장시 ui 채팅방으로 교체
function intoChatting(clickedChatRoomData: chatRoom) {
  setchatRoomData([])
  setchatRoomVisisibleState(true)
  setchatRoomData([])
  setchatNowInfo({ nickname: clickedChatRoomData.UserInfo.nickname, roomName: clickedChatRoomData.chatRoomIdx, profilePath: clickedChatRoomData.UserInfo.profilePath });
  console.log(clickedChatRoomData);
}

return (
    <div className="bg-gray-100 flex justify-center">
      <div className="flex-1 w-full border-gray-100 border-r-[1px]">
          {//채팅방 입장
          chatRoomVisisible && (
            <div className="flex justify-center">
              <PersonalChatBox></PersonalChatBox>
            </div>
          )}
          {// 채팅방 리스트 보기
          !chatRoomVisisible && (
            <div className="flex-1 overflow-auto bg-white">
              {chatRoomData.map((chatRoomData, i) => (
              <div className="cursor-pointer"
                key={i}
                onClick={() => intoChatting(chatRoomData)} >
                <ChatList chatRoomData={chatRoomData} key={i}/>
              </div>
            ))}
            </div>
          )}
        </div>
        {existNextPage && (
            <div className="flex justify-center">
                <div
                className="w-[15px] h-[15px] border-t-4 border-main-color border-solid rounded-full animate-spin" ref={target}>
                </div>
            </div>
        )}
        {loading && (
            <div className="flex justify-center">
                <div
                className="w-[15px] h-[15px] border-t-4 border-main-color border-solid rounded-full animate-spin" ref={target}>
                </div>
            </div>
        )}
    </div>
  );
}