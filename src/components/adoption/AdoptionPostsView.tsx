import {
  GetAdoptionPostsView,
  Images,
  getResponse,
} from "@/service/my/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import ImageSlider from "../ImageSlider";
import { useMutation } from "@tanstack/react-query";
import { commentWrite } from "@/api/comment";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState, userAtom, chatVisisibleState } from "@/recoil/user";
import { Comment, getCommentResponse } from "@/service/comment";
import CommentCard from "../comment/CommentCard";
import CommentForm from "../comment/CommentForm";
import { adoptionDelete } from "@/api/adoption/adoption";
import { boardRegisterBookmark, boardDeleteBookmark } from "@/api/board/board"

import { useRouter } from "next/navigation";

import unlike_black from "../../../public/img/unlike_black.png";
import like_maincolor from "../../../public/img/like_maincolor.png";
import Image from "next/image";
import Swal from "sweetalert2";

import {
  chatRoomState,
  chatRoomVisisibleState,
  chatNowInfoState,
  isNewChatState,
  isNewChatIdxState,
} from "@/recoil/chatting";
import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";
import {
  chatRoom,
  connectMessage,
  Ban_Message,
  userInfo,
  getResponseChatList,
} from "@/service/chat/chat";

export default function AdoptionPostsView() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);

  const [commentData, setCommentData] = useState<getCommentResponse | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);

  const [commentFormValue, setCommentFormValue] = useState<string>(""); // 댓글 작성 후, 댓글 폼 불러오기 위한 변수

  const [commentList, setCommentList] = useState<Comment[]>();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const [isChatVisisible, setIsChatVisisible] =
    useRecoilState(chatVisisibleState);
  const [chatRoomVisisible, setchatRoomVisisibleState] = useRecoilState(
    chatRoomVisisibleState
  );
  const [isNewChat, setisNewChatState] = useRecoilState(isNewChatState);
  const [isNewChatIdx, setisNewChatIdx] = useRecoilState(isNewChatIdxState);
  const [chatNowInfo, setchatNowInfo] = useRecoilState(chatNowInfoState);
  const [accessToken, setAccessToken] = useState("");
  const [userIdx, setUserIdx] = useState(0);
  const [chatRoomData, setchatRoomData] = useState<chatRoom[]>([]);

  const [commentCnt, setCommentCnt] = useState(0);
  const [bookmarkCnt, setBookmarkCnt] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  /*********************
   *
   *       북마크
   *
   ********************/
  const bookmarkClick = () => {
    if (bookmarked) {
      setBookmarked(false);
      setBookmarkCnt(bookmarkCnt-1);
      boardDeleteMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: data!.result.idx,
      });
    } else {
      setBookmarked(true);
      setBookmarkCnt(bookmarkCnt+1);
      boardRegisterMutation.mutate({
        userAccessToken: accessToken,
        boardIdx: data!.result.idx,
        userIdx: userIdx
      });
    }
  };
  // 북마크 등록
  const boardRegisterMutation = useMutation({
    mutationFn: boardRegisterBookmark,
    onSuccess: (data) => {
    },
  });
  // 북마크 삭제
  const boardDeleteMutation = useMutation({
    mutationFn: boardDeleteBookmark,
    onSuccess: (data) => {
    },
  });

  function BackButton() {
    const handleGoBack = () => {
      window.history.back(); // Go back to the previous page using window.history
    };

    return (
      <button
        onClick={handleGoBack}
        className="cursor-poiter px-2 font-bold mt-12"
      >
        &lt; 뒤로가기
      </button>
    );
  }

  const deleteMutation = useMutation({
    mutationFn: adoptionDelete,
    onSuccess: (data) => {
      Swal.fire({
        text: "게시글이 삭제되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      router.replace("/");
    },
  });

  const profileMenu = () => {
    setProfileMenuOpen((prevProfileMenuOpen) => !prevProfileMenuOpen);
  };

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleChat = () => {
    //1:1채팅 코드
    setIsChatVisisible(true);
    checkChatRoom(accessToken);
  };
  function intoChatting(
    idx: number,
    nickname: string,
    roomName: number,
    profilePath: string
  ) {
    setchatRoomVisisibleState(true);
    setchatNowInfo({
      idx: idx,
      nickname: nickname,
      roomName: roomName,
      profilePath: profilePath,
    });
  }
  const checkChatRoom = async (accessToken: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // 해당 사용자와 개설된 채팅방이 있는지 확인
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/chat/room/${post?.UserInfo.idx}`,
        config
      );
      // 개설된 채팅방이 있는 경우
      if (
        post?.UserInfo.nickname &&
        response.data.result &&
        post?.UserInfo.profilePath
      ) {
        intoChatting(
          post.UserInfo.idx,
          post.UserInfo.nickname,
          response.data.result,
          post.UserInfo.profilePath
        );
      } else {
        // console.error("Error: Some values are undefined");
      }
    } catch (error: any) {
      // console.error("Error fetching data:", error);
      if (error.response.data.status == 401) {
        const storedData = localStorage.getItem("recoil-persist");
        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken) {
            const extractedARefreshToken = userData.USER_DATA.refreshToken;
            reGenerateTokenMutation.mutate(
              {
                refreshToken: extractedARefreshToken,
              },
              {
                onSuccess: (data) => {
                  // api call 재선언
                  checkChatRoom(accessToken);
                },
                onError: () => {
                  //
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                  router.replace("/");
                  setIsLoggedIn(false);
                },
              }
            );
          } else {
          }
        }
      } else if (error.response.status == 404) {
        // 개설된 채팅방이 없는 경우 첫 채팅 state 지정하여 보냄
        if (error.response.data.errorCode === "CHATROOM_NOT_EXIST") {
          setchatRoomVisisibleState(true);
          setisNewChatState(true);
          if (post?.UserInfo.idx) {
            setisNewChatIdx(post?.UserInfo.idx);
            intoChatting(
              post.UserInfo.idx,
              post.UserInfo.nickname,
              0,
              post.UserInfo.profilePath
            );
          } else {
            // console.error(
            //   "Error : setisNewChatIdx(post?.UserInfo.idx); : Some values are undefined"
            // );
          }
        }
      }
    }
  };

  const handleEdit = () => {
    // Implement th`e edit action here
    window.location.href = `/community/adoption/edit/${idx}`;
  };

  const handleDelete = () => {
    // Implement the delete action here
    const confirmation = window.confirm("해당 게시글을 삭제하시겠습니까?");

    if (confirmation) {
      const requestData = {
        boardIdx: idx,
        userAccessToken: userAccessToken || "",
      };

      deleteMutation.mutate(requestData);
    }
  };

  const handleReport = () => {
    // Implement the report action here
  };

  const handleLogin = () => {
    const confirmation = window.confirm("로그인 후 댓글을 작성할 수 있습니다.");

    if (confirmation) {
      window.location.href = `/login`;
    }
  };

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = 0;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData != null) {
      const userData = JSON.parse(storedData || "");
      currentUserIdx = userData.USER_DATA.idx;
      userAccessToken = userData.USER_DATA.accessToken;
      userProfilePath = userData.USER_DATA.profilePath;
      userNickname = userData.USER_DATA.nickname;
    }
  }

  const options = {
    threshold: 1.0,
  };

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}?userIdx=${currentUserIdx}`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
      setCommentCnt(response.data.result.commentCnt);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);
        setUserIdx(userData.USER_DATA.idx);
      } else {
        setIsLoggedIn(false);
      }
    }
    getData();
  }, []);

  const post = data?.result;

  const date = new Date(post?.writeDate || "");

  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero if needed
  const day = date.getDate().toString().padStart(2, "0"); // Add leading zero if needed
  const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours and add leading zero if needed
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const postWriteDate = `${year}.${month}.${day}`;
  const postWriteTime = `${hours}:${minutes}`;

  const getCommentData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/${idx}/comment?page=${page}&size=20&order=DESC`
      );
      setCommentData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getCommentResponse)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);

      // 댓글 데이터를 받은 후에 댓글 리스트를 업데이트
      const newComments = response.data.result.items.map((item: any) => ({
        idx: item.idx,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
        userIdx: item.UserInfo.idx,
        boardIdx: item.boardIdx,
        boardState: item.boardState,
        filePath: item.filePath,
        description: item.description,
        replyCnt: item.replyCnt,
        nickname: item.UserInfo.nickname,
        profilePath: item.UserInfo.profilePath,
      }));
      setCommentList((prevCommentList) => [
        ...(prevCommentList || []),
        ...newComments,
      ]);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getCommentData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getCommentData();
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
  }, [getCommentData, existNextPage, loading, options]);

  //댓글 작성 성공 시,
  const mutation = useMutation({
    mutationFn: commentWrite,
    onSuccess: (data) => {
      const newComment: Comment = {
        idx: data.data.result.idx,
        createdAt: data.data.result.createdAt,
        updatedAt: data.data.result.updatedAt,
        deletedAt: data.data.result.deletedAt,
        userIdx: data.data.result.userIdx,
        boardIdx: data.data.result.boardIdx,
        boardState: data.data.result.boardState,
        filePath: null,
        description: data.data.result.description,
        replyCnt: data.data.result.replyCnt,
        nickname: userNickname || "",
        profilePath: userProfilePath || "",
      };
      setCommentList((prevCommentList) => [
        newComment,
        ...(prevCommentList || []),
      ]);
      setCommentCnt(commentCnt + 1);
    },
  });

  if (post !== null && post?.images) {
    const itemlist: Images[] = post.images.map((item) => ({
      idx: item.idx,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      boardIdx: item.boardIdx,
      category: item.category,
      path: item.path,
      mediaSequence: item.mediaSequence,
    }));

    //댓글 작성 버튼 클릭 시
    const handleCommentSubmit = (comment: string) => {
      const requestData = {
        boardIdx: post.idx,
        category: "comment",
        description: comment,
        userAccessToken: userAccessToken || "",
      };

      if (comment !== "") {
        mutation.mutate(requestData);

        setCommentFormValue(""); // 댓글 폼 초기화
        // 댓글 리스트 다시 로딩을 위해 페이지 및 관련 상태 변수를 초기화합니다.
        setPage(1);
        setENP(false);
        setCommentData(null);
      } else {
        // Create the alert message based on missing fields
        let alertMessage = "오류입니다. :\n 다시 시도해주세요.";

        Swal.fire({
          text: alertMessage,
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    };

    const handleCommentDelete = (commentIdx: number) => {
      // Filter out the deleted comment
      const updatedCommentList = commentList?.filter(
        (comment) => comment.idx !== commentIdx
      );

      // Update the comment list in the parent component
      setCommentList(updatedCommentList);
      setCommentCnt(commentCnt - 1);
    };

    const handleReplyWrite = () => {
      setCommentCnt(commentCnt + 1);
    };

    const handleReplyDelete = () => {
      setCommentCnt(commentCnt - 1);
    };

    const isCurrentUserComment = currentUserIdx === post.UserInfo.idx;

    return (
      <div className="mx-1 pt-[30px]">
        {post && (
          <div className="max-w-screen-sm mx-auto">
            <PC>
              <h2 className="text-4xl font-bold pt-10 mt-20">{post.title}</h2>
              <div className="flex items-center my-2 relative">
                <Image
                  className="w-10 h-10 rounded-full border-2 cursor-pointer"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                  onClick={profileMenu}
                />
                {!isCurrentUserComment && (
                  <div className="flex items-center justify-center absolute top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-50">
                    {profileMenuOpen && (
                      <ul>
                        <li
                          onClick={() => {
                            handleChat();
                            profileMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          1:1채팅하기
                        </li>
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-xl font-bold ml-1">
                  {post.UserInfo.nickname}
                </p>
                <p className="ml-2 text-gray-500">{postWriteDate}</p>
                <p className="ml-1 text-gray-500">{postWriteTime}</p>
                <p className="ml-2 text-gray-500">조회 {post.view}</p>
                <div className="relative ml-auto">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 cursor-pointer text-xl"
                  >
                    ⁝
                  </button>
                  {menuOpen && (
                    <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                      {isCurrentUserComment ? (
                        <ul>
                          <li
                            onClick={() => {
                              handleEdit();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            수정
                          </li>
                          <li
                            onClick={() => {
                              handleDelete();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            삭제
                          </li>
                        </ul>
                      ) : (
                        <ul>
                          <li
                            onClick={() => {
                              handleReport();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            신고
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-3">
                <p className="text-lg font-semibold ml-1">판매가격</p>
                <p className="text-xl font-bold ml-auto mr-1">
                  {post.boardCommercial.price.toLocaleString()}원
                </p>
              </div>
              <div className="flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">품종</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">성별</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">크기</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.size}</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center mt-1">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">모프</p>
                  <p className="pb-1 text-lg">{post.boardCommercial.pattern}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">출생</p>
                  <p className="pb-1 text-lg">
                    {post.boardCommercial.birthDate}
                  </p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 text-lg font-bold">상태</p>
                  {post.boardCommercial.state === "reservation" ? (
                    <p className="pb-1 text-lg text-red-600">예약중</p>
                  ) : post.boardCommercial.state === "end" ? (
                    <p className="pb-1 text-lg text-gray-500">판매완료</p>
                  ) : (
                    <p className="pb-1 text-lg text-blue-600">판매중</p>
                  )}
                </div>
              </div>
              <p className="text-lg my-2 break-all">{post.description}</p>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-row justify-between items-center py-3">
                <div className="flex flex-row items-center py-3">
                  <p className="text-lg font-semibold ml-1 mr-2">댓글</p>
                  <p className="text-lg font-semibold mr-2">{commentCnt}개</p>
                </div>
                <div className="flex flex-row items-center py-3">
                {bookmarked ? (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={like_maincolor}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                  ) : (
                    <a onClick={bookmarkClick}>
                      <Image
                        src={unlike_black}
                        width={20}
                        height={20}
                        alt="북마크"
                        className="like_btn m-auto mr-1"
                      />
                    </a>
                  )}
                  <p className="text-lg font-semibold mr-2">{bookmarkCnt}</p>
                </div>
              </div>
              {userAccessToken ? (
                <div>
                  <CommentForm
                    value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                    onSubmit={handleCommentSubmit}
                    onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                  />
                </div>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  로그인 후 댓글을 작성할 수 있습니다.
                </p>
              )}
            </PC>
            <Mobile>
              <BackButton />
              <h2 className="mx-2 text-2xl font-bold pt-5">{post.title}</h2>
              <div className="mx-2 flex items-center my-2 relative">
                <Image
                  className="w-10 h-10 rounded-full border-2 cursor-pointer"
                  src={post.UserInfo.profilePath || "/img/reptimate_logo.png"}
                  alt=""
                  onClick={profileMenu}
                />
                {!isCurrentUserComment && (
                  <div className="flex items-center justify-center absolute top-full mt-1 bg-white border border-gray-200 shadow-lg rounded z-50">
                    {profileMenuOpen && (
                      <ul>
                        <li
                          onClick={() => {
                            handleChat();
                            profileMenu();
                          }}
                          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                        >
                          1:1채팅하기
                        </li>
                      </ul>
                    )}
                  </div>
                )}
                <p className="text-lg font-bold">{post.UserInfo.nickname}</p>
                <p className="ml-2 text-gray-500 text-sm">{postWriteDate}</p>
                <p className="ml-1 text-gray-500 text-sm">{postWriteTime}</p>
                <p className="ml-2 text-gray-500 text-sm">조회 {post.view}</p>
                <div className="relative ml-auto">
                  <button
                    onClick={toggleMenu}
                    className="text-gray-500 cursor-pointer text-xl"
                  >
                    ⁝
                  </button>
                  {menuOpen && (
                    <div className="flex items-center justify-center absolute right-0 mt-1 w-20 bg-white border border-gray-200 shadow-lg rounded z-50">
                      {isCurrentUserComment ? (
                        <ul>
                          <li
                            onClick={() => {
                              handleEdit();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            수정
                          </li>
                          <li
                            onClick={() => {
                              handleDelete();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            삭제
                          </li>
                        </ul>
                      ) : (
                        <ul>
                          <li
                            onClick={() => {
                              handleReport();
                              toggleMenu();
                            }}
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                          >
                            신고
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ImageSlider imageUrls={itemlist} />
              <div className="flex flex-row items-center py-1">
                <p className="font-semibold ml-2">판매가격</p>
                <p className="font-bold ml-auto mr-2">
                  {post.boardCommercial.price.toLocaleString()}원
                </p>
              </div>
              <div className="mx-2 flex flex-row items-center justify-center">
                <div className="w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">품종</p>
                  <p className="pb-1 text-sm">{post.boardCommercial.variety}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">성별</p>
                  <p className="pb-1 text-sm">{post.boardCommercial.gender}</p>
                </div>
                <div className="ml-2 w-52 flex flex-col items-center justify-center rounded border-2 border-gray-300">
                  <p className="pt-1 font-bold">크기</p>
                  <p className="pb-1 text-sm">{post.boardCommercial.size}</p>
                </div>
              </div>
              <p className="mx-2 my-4 break-all">{post.description}</p>
              <hr className="border-t border-gray-300" />
              <div className="flex flex-row justify-between items-center py-3">
                <div className="flex flex-row items-center py-3">
                  <p className="text-lg font-semibold ml-1 mr-2">댓글</p>
                  <p className="text-lg font-semibold mr-2">{commentCnt}개</p>
                </div>
                <div className="flex flex-row items-center py-3">
                {bookmarked ? (
                  <a onClick={bookmarkClick}>
                    <Image
                      src={like_maincolor}
                      width={20}
                      height={20}
                      alt="북마크"
                      className="like_btn m-auto mr-1"
                    />
                  </a>
                  ) : (
                    <a onClick={bookmarkClick}>
                      <Image
                        src={unlike_black}
                        width={20}
                        height={20}
                        alt="북마크"
                        className="like_btn m-auto mr-1"
                      />
                    </a>
                  )}
                  <p className="text-lg font-semibold mr-2">{bookmarkCnt}</p>
                </div>
              </div>
              {userAccessToken ? (
                <div>
                  <CommentForm
                    value={commentFormValue} // 전달할 댓글 폼의 값을 설정합니다.
                    onSubmit={handleCommentSubmit}
                    onChange={(value: string) => setCommentFormValue(value)} // 댓글 폼 값이 변경될 때마다 업데이트합니다.
                  />
                </div>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  로그인 후 댓글을 작성할 수 있습니다.
                </p>
              )}
            </Mobile>
            <ul className="mt-6">
              {commentList !== null && commentList ? (
                commentList.map((comment) => (
                  <li key={comment.idx}>
                    <CommentCard
                      comment={comment}
                      onDelete={handleCommentDelete}
                      onReplyWrite={handleReplyWrite}
                      onReplyDelete={handleReplyDelete}
                    />
                  </li>
                ))
              ) : (
                <li></li>
              )}
            </ul>
            {existNextPage && (
              <div className="flex justify-center">
                <div
                  className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
                  ref={target}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
