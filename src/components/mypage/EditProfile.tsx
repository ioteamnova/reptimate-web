"use client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSetRecoilState } from "recoil";

import {
  editAccountInfo,
  UserInfo,
  changePassword,
  deleteUser,
} from "@/api/my/editUserInfo";
import { userAtom, isLoggedInState } from "@/recoil/user";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";

import {
  validateEmail,
  validatePassword,
  validateNickname,
} from "../join/JoinExp";
import { emailSend, nickNameChk } from "@/api/join/join";
import axios from "axios";
import PasswordPromptModal from "../UserDeleteModal";

import Swal from "sweetalert2";

export default function EditProfileInput() {
  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const reGenerateTokenMutation = useReGenerateTokenMutation();

  const router = useRouter();

  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [prevEmail, setPrevEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prevPassword, setPrevPassword] = useState("");
  const [nickname, setNickName] = useState("");
  const [prevNickname, setPrevNickname] = useState("");
  const [warningMsg, setWarningMsg] = useState(false);
  const [image, setImage] = useState("/img/reptimate_logo.png");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [agreeWithMarketing, setAgreeWithMarketing] = useState(false);

  const [isNicknameChanged, setIsNicknameChanged] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [pwChange, setPwChange] = useState(false);
  const [canEdit, setEmailEdit] = useState(true);
  const [canEdit2, setEmailEdit2] = useState(true);
  const [socialLog, setSocialLog] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeChk, setEmailCodeChk] = useState("");
  const [checkPassword, setCechkPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userInfo, setUserInfo] = useState(UserInfo);
  const pathName = usePathname() || "";

  const getUserInfo = async (accessToken: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        config
      );
      setUserInfo(response.data.result);
    } catch (error: any) {
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
                  getUserInfo(data);
                },
                onError: () => {
                  router.replace("/");
                  setIsLoggedIn(false);
                  //
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
            setIsLoggedIn(false);
          }
        }
      } else {
        // console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    if (
      userInfo.loginMethod == "KAKAO" ||
      userInfo.loginMethod == "APPLE" ||
      userInfo.loginMethod == "GOOGLE"
    ) {
      setEmailEdit(false);
    }
    setEmail(userInfo.email);
    setNickName(userInfo.nickname);
    if (userInfo.profilePath != null) {
      setImage(userInfo.profilePath);
    }
    if (userInfo.agreeWithMarketing) {
      setAgreeWithMarketing(userInfo.agreeWithMarketing);
    }
    setPrevEmail(userInfo.email);
    setPrevNickname(userInfo.nickname);
  }, [userInfo]);

  const mutationEmailSend = useMutation({
    mutationFn: emailSend,
    onSuccess: (data) => {
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setEmailCode(resultb.signupVerifyToken);
      setEmailEdit(false);
    },
  });

  const mutationNicknameSend = useMutation({
    mutationFn: nickNameChk,
    onSuccess: (data) => {
      Swal.fire({
        text: "사용 가능한 닉네임입니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      setIsNicknameChanged(true);
    },
    onError: (err: { response: { status: number } }) => {
      if (err.response.status == 401) {
        const storedData = localStorage.getItem("recoil-persist");
        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken != null) {
            const extractedARefreshToken = userData.USER_DATA.refreshToken;
            reGenerateTokenMutation.mutate(
              {
                refreshToken: extractedARefreshToken,
              },
              {
                onSuccess: (data) => {
                  const a = JSON.stringify(data.data.result);
                  const resulta = JSON.parse(a);
                  setAccessToken(resulta.accessToken);
                  mutationNicknameSend.mutate({
                    accessToken: accessToken,
                    nickname: nickname,
                  });
                },
                onError: () => {
                  router.replace("/");
                  setIsLoggedIn(false);
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
          }
        }
      } else if (err.response.status == 409) {
        Swal.fire({
          text: "이미 사용중인 닉네임입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    },
  });

  const handleImageClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    // 파일 읽기 완료 후의 동작을 정의합니다.
    reader.onload = (event) => {
      if (event && event.target && event.target.result) {
        // 파일을 미리보기하기 위해 이미지 URL을 상태로 설정합니다.
        setImage(event.target.result as string);
      }
    };
    // 파일 읽기 작업을 수행합니다.
    reader.readAsDataURL(file);
    // formData에 이미지 파일을 추가합니다.
    setSelectedFile(file);
    setIsImageChanged(true);
  };

  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmail(value);
  };
  const onEmailCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmailCodeChk(value);
  };
  const onNickNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setNickName(value);
  };
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setPassword(value);
  };
  const onCheckPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setCechkPassword(value);
  };
  const onPrevPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setPrevPassword(value);
  };
  function onagreeWithMarketingHandler() {
    setAgreeWithMarketing(!agreeWithMarketing);
  }

  function onPwChangeBtnClick() {
    setPwChange(true);
  }
  function onPwChangeBtnCancel() {
    setPwChange(false);
  }
  function onEmailSend() {
    if (
      userInfo.loginMethod == "KAKAO" ||
      userInfo.loginMethod == "APPLE" ||
      userInfo.loginMethod == "GOOGLE"
    ) {
    } else {
      if (validateEmail(email)) {
        Swal.fire({
          text: "이메일이 발송 되었습니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
        mutationEmailSend.mutate({ email: email, type: "NEWUSER" });
      }
    }
  }
  function onEmailCodeValidateHandler() {
    if (emailCode == emailCodeChk) {
      Swal.fire({
        text: "이메일이 인증 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      setEmailEdit2(false);
    } else {
      Swal.fire({
        text: "유효하지 않은 인증 코드입니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  }

  function onNicknameSend() {
    mutationNicknameSend.mutate({
      nickname: nickname,
      accessToken: accessToken,
    });
  }

  const mutation = useMutation({
    mutationFn: editAccountInfo,
    onSuccess: (data) => {
      Swal.fire({
        text: "회원정보가 수정 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      // console.log(data)
      router.replace("/my");
      
    },
    onError: (err: { response: { status: number, data: {errorCode: string, message: string} } }) => {
      if (err.response.status == 401) {
        const storedData = localStorage.getItem("recoil-persist");
        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken != null) {
            const extractedARefreshToken = userData.USER_DATA.refreshToken;
            reGenerateTokenMutation.mutate(
              {
                refreshToken: extractedARefreshToken,
              },
              {
                onSuccess: (data) => {
                  const formData = new FormData();

                  const a = JSON.stringify(data.data.result);
                  const resulta = JSON.parse(a);
                  setAccessToken(resulta.accessToken);
                  mutation.mutate({
                    accessToken: accessToken,
                    formData,
                  });
                },
                onError: () => {
                  router.replace("/");
                  setIsLoggedIn(false);
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
          }
        }
      } else if(err.response.status == 409) {
        Swal.fire({
          text: err.response.data.message,
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      } else {
        // console.log(err.response);
      }
    },
  });

  const userDelmutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      // console.log(data);
      Swal.fire({
        text: "회원 탈퇴가 완료되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      router.replace("/");
      setIsLoggedIn(false);
    },
    onError: (err: {
      response: { status: number; data: { message: string } };
    }) => {
      // console.log(err.response.data.message);
      Swal.fire({
        text: err.response.data.message,
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    },
  });

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기

    if (validateEmail(email) && validateNickname(nickname)) {
      const formData = new FormData();
      if (!canEdit2) {
        formData.append("email", email);
      }
      if (isNicknameChanged) {
        formData.append("nickname", nickname);
      }
      if (isImageChanged && selectedFile) {
        formData.append("file", selectedFile);
      }
      mutation.mutate({
        accessToken: accessToken,
        formData: formData,
      });
    } else {
      Swal.fire({
        text: "정보 수정에 실패했습니다. 입력란을 확인 후 다시 시도해주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  const mutationPwChange = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setPrevPassword("");
        setCechkPassword("");
        setPassword("");
        setPwChange(false);
      if (data.data.status == 200) {
        Swal.fire({
          text: "비밀번호가 변경 되었습니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
      setPrevPassword("");
      setCechkPassword("");
      setPassword("");
      setPwChange(false);
    },
    onError: (err: { response: { status: number } }) => {
      if (err.response.status == 401) {
        const storedData = localStorage.getItem("recoil-persist");
        if (storedData) {
          const userData = JSON.parse(storedData);
          if (userData.USER_DATA.accessToken != null) {
            const extractedARefreshToken = userData.USER_DATA.refreshToken;
            reGenerateTokenMutation.mutate(
              {
                refreshToken: extractedARefreshToken,
              },
              {
                onSuccess: (data) => {
                  const a = JSON.stringify(data.data.result);
                  const resulta = JSON.parse(a);
                  setAccessToken(resulta.accessToken);

                  mutationPwChange.mutate({
                    accessToken: accessToken,
                    currentPassword: prevPassword,
                    newPassword: password,
                  });
                },
                onError: () => {
                  router.replace("/");
                  setIsLoggedIn(false);
                  Swal.fire({
                    text: "로그인 만료\n다시 로그인 해주세요",
                    confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                    confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
                  });
                },
              }
            );
          } else {
            router.replace("/");
            Swal.fire({
              text: "로그인이 필요한 기능입니다.",
              confirmButtonText: "확인", // confirm 버튼 텍스트 지정
              confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
            });
          }
        }
      } else {
        // console.log(err.response);
      }
    },
  });
  const onPwChangeSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기
    if (validatePassword(password) && password === checkPassword) {
      mutationPwChange.mutate({
        accessToken: accessToken,
        currentPassword: prevPassword,
        newPassword: password,
      });
    } else {
      Swal.fire({
        text: "입력란을 확인 후 다시 시도해주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmPassword = (password: string) => {
    if (password) {
      userDelmutation.mutate({
        accessToken: accessToken,
        password: password,
      });
    }
    if (password == "") {
      Swal.fire({
        text: "비밀번호를 입력해주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("recoil-persist");
    if (storedData) {
      const userData = JSON.parse(storedData);
      if (userData.USER_DATA.accessToken) {
        const extractedAccessToken = userData.USER_DATA.accessToken;
        setAccessToken(extractedAccessToken);

        //mutation.mutate({ accessToken: extractedAccessToken });
        getUserInfo(extractedAccessToken);
      } else {
        router.replace("/");
        Swal.fire({
          text: "로그인이 필요한 기능입니다.",
          confirmButtonText: "확인", // confirm 버튼 텍스트 지정
          confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
        });
      }
    }
  }, [accessToken]);

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={onSubmitHandler}>
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
          <div className="m-auto pb-[20px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">
            {/* <h2 className="text-[32px] tracking-[-.48px] pb-[46px] text-center">내 정보 수정</h2> */}

            <a
              className="flex justify-center align-middle items-center"
              onClick={handleImageClick}
            >
              <img
                className="h-[250px] w-[250px] rounded-[50%] border-2 mb-[50px]"
                src={image}
                alt=""
                ref={imgRef}
              />
              <input
                type="file"
                name="image_URL"
                id="input-file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생할 수 있다
                // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
                ref={fileInput}
              />
            </a>

            <div className={` pb-[32px] relative`}>
              <h3 className="font-bold text-[13px] tracking-[-.07px] leading-[18px]">
                이메일 주소*
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="email"
                  placeholder="예) repti@mate.co.kr"
                  onChange={onEmailHandler}
                  value={email}
                  readOnly={canEdit ? false : true}
                  className={`${
                    canEdit ? "" : "text-gray-400"
                  } focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full`}
                />
                
                {canEdit ? (
                  <button
                    type="button"
                    onClick={onEmailSend}
                    className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color"
                  >
                  인증 발송
                  </button>
                ) : 
                  <button
                    type="button"
                    onClick={onEmailSend}
                    className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color"
                  >
                  재발송
                  </button>
                  }
              </div>
              {!validateEmail(email) && (
                <p className="text-xs text-main-color">
                  올바른 형식의 이메일을 작성해 주세요.
                </p>
              )}
              <div className={`${socialLog ? "" : "hidden"} `}>
                <p className={` text-[11px] text-main-color`}>
                  소셜 로그인 회원은 이메일 변경이 불가능합니다.{" "}
                </p>
              </div>
            </div>

            <div className={`${canEdit ? "hidden" : ""} pb-[32px] relative`}>
              <h3 className="font-bold text-[13px] tracking-[-.07px] leading-[18px]">
                인증코드
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="text"
                  placeholder=""
                  onChange={onEmailCodeHandler}
                  readOnly={canEdit2 ? false : true}
                  className={`${
                    canEdit2 ? "" : "text-gray-400"
                  } focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full`}
                />
                <button
                  type="button"
                  onClick={onEmailCodeValidateHandler}
                  disabled={canEdit2 ? false : true}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center hover:text-main-color"
                >
                  인증
                </button>
              </div>
            </div>

            <div className="pb-[32px] relative">
              <h3 className="font-bold text-[13px] tracking-[-.07px] leading-[18px]">
                닉네임
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="nickname"
                  placeholder="2-8자 이내"
                  onChange={onNickNameHandler}
                  value={nickname}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
                <button
                  type="button"
                  onClick={onNicknameSend}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div className="pb-[40px]">
              <div className="mt-[16px] block">
                <div className="relative">
                  <div className="relative text-[0px]">
                    <input
                      id="advertise"
                      type="checkbox"
                      name=""
                      className="overflow-hidden w-[1px] h-[1px] absolute border-0 p-0 bg-clip-border"
                    />
                    <label
                      htmlFor="advertise"
                      onClick={onagreeWithMarketingHandler}
                      className="relative cursor-pointer inline-flex"
                    >
                      {!agreeWithMarketing && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/unchecked.png"
                          alt=""
                        />
                      )}
                      {agreeWithMarketing && (
                        <img
                          className="h-[24px] w-[24px]"
                          src="/join/checked.png"
                          alt=""
                        />
                      )}
                      <span className="pl-[8px] tracking-[-.07px] text-[14px] align-text-top ml-3">
                        [선택] 광고성 정보 수신하기 (이메일, 문자)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]"
            >
              수정하기{" "}
            </button>
          </div>
        </div>
      </form>

      {!socialLog && (
        <form className="w-full" onSubmit={onPwChangeSubmitHandler}>
          <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
            <div className="m-auto pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">
              <button
                type="button"
                onClick={onPwChangeBtnClick}
                className={`${
                  pwChange ? "hidden" : ""
                } mb-[25px] items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]`}
              >
                비밀번호 변경{" "}
              </button>

              <div className={`${pwChange ? "" : "hidden"} pb-[32px] relative`}>
                <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                  현재 비밀번호
                </h3>
                <div className="relative m-0 p-0">
                  <input
                    type="password"
                    placeholder="영문, 숫자, 특수문자 조합 8-16자"
                    onChange={onPrevPasswordHandler}
                    value={prevPassword}
                    className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                  />
                </div>
              </div>
              <div className={`${pwChange ? "" : "hidden"} pb-[32px] relative`}>
                <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                  새 비밀번호
                </h3>
                <div className="relative m-0 p-0">
                  <input
                    type="password"
                    placeholder="영문, 숫자, 특수문자 조합 8-16자"
                    onChange={onPasswordHandler}
                    value={password}
                    className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                  />
                </div>
              </div>

              <div className={`${pwChange ? "" : "hidden"} pb-[32px] relative`}>
                <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                  새 비밀번호 확인
                </h3>
                <div className="relative m-0 p-0">
                  <input
                    type="password"
                    onChange={onCheckPasswordHandler}
                    value={checkPassword}
                    className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`${
                  pwChange ? "" : "hidden"
                } mb-[15px] items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]`}
              >
                변경하기
              </button>

              <button
                type="button"
                onClick={onPwChangeBtnCancel}
                className={`${
                  pwChange ? "" : "hidden"
                } mb-[15px] items-center cursor-pointer inline-flex justify-center text-center align-middle bg-white text-main-color border-[1px] border-main-color font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]`}
              >
                취소하기
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="w-full items-center inline-flex justify-center text-center align-middle mt-10 mb-5">
        <button
          className="cursor-pointer text-red-600 tracking-[-.16px] font-semibold"
          onClick={handleOpenModal}
        >
          회원탈퇴{" "}
        </button>
      </div>
      <PasswordPromptModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPassword}
      />
    </div>
  );
}
