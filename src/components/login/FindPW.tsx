"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  validateEmail,
  validatePassword,
  validateNickname,
} from "../join/JoinExp";
import { patchPassWord, emailSend, findPassWordEmail } from "@/api/join/join";
import Swal from "sweetalert2";

export default function FindPWInput() {
  const router = useRouter();

  const [canEdit, setEmailEdit] = useState(true);

  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCechkPassword] = useState("");

  const [emailCode, setEmailCode] = useState("");
  const [emailCodeChk, setEmailCodeChk] = useState("");

  const [newPW, setNewPW] = useState(false);

  const [emailcode, setagreement] = useState(false);
  const [privacy, setprivacy] = useState(false);
  const [agreeWithMarketing, setAgreeWithMarketing] = useState(false);

  const [emailErrM, setemailErrM] = useState(false);
  const [nickErrM, setnickErrM] = useState(false);
  const [isJoinTry, setJoinTry] = useState(false);

  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmail(value);
    setemailErrM(false);
  };
  const onEmailCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmailCodeChk(value);
  };
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setPassword(value);
  };
  const onCurrentPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setCurrentPassword(value);
  };
  const onCheckPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setCechkPassword(value);
  };

  const mutation = useMutation({
    mutationFn: patchPassWord,
    onSuccess: (data) => {
      // status code 분기 처리
      Swal.fire({
        text: "비밀번호가 수정 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      router.replace("/login");
    },
    onError: (err: {
      response: { status: number; data: { errorCode: string } };
    }) => {
      if (err.response.status == 409) {
        if (err.response.data.errorCode == "EXIST_EMAIL") {
          setemailErrM(true);
        } else {
          setnickErrM(true);
          setJoinTry(true);
        }
      } else if(err.response.status == 400) {
        if (err.response.data.errorCode == "CANNOT_UPDATE_SOCIAL_USER") {
            Swal.fire({
                text: "소셜 회원은 비밀번호를 변경할 수 없습니다.",
                confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                confirmButtonColor: "#7A75F7", // confrim 버튼 색깔
              });
          } else {
          }
        
      }
    },
  });
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기
    if (
      validatePassword(password) &&
      password === checkPassword
    ) {
      mutation.mutate({
          password: password,
          email: email
      });
    } else {
      Swal.fire({
        text: "비밀번호 변경에 실패했습니다. 입력란을 확인 후 다시 시도해주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  };

  const mutationEmailSend = useMutation({
    mutationFn: findPassWordEmail,
    onSuccess: (data) => {
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setEmailCode(resultb.signupVerifyToken);
      setEmailEdit(!canEdit);
    },
  });
  function onEmailSendHandler() {
    if (validateEmail(email)) {
      Swal.fire({
        text: "이메일이 전송 되었습니다.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
      mutationEmailSend.mutate({ email: email });
    } else {
      Swal.fire({
        text: "이메일 형식에 맞게 작성해 주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  }
  function onEmailCodeValidateHandler() {
    if (emailCode == emailCodeChk) {
        setNewPW(true);
    } else {
      Swal.fire({
        text: "이메일 인증 코드를 다시 확인해주세요.",
        confirmButtonText: "확인", // confirm 버튼 텍스트 지정
        confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
      });
    }
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="mt-20">
        <div className=" ml-auto mr-auto max-xl:pl-[40px] max-xl:pr-[40px] max-w-7xl">
          <div className="m-auto pt-[48px] pb-[160px] w-[400px] max-[374px]:w-full max-[374px]:pt-[23px] max-[374px]:pb-[40px]">
            <h2 className="text-[32px] tracking-[-.48px] pb-[46px] text-center">
                비밀번호 찾기
            </h2>

            {!newPW && (
                <>
            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                이메일 주소*
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="email"
                  placeholder="예) repti@mate.co.kr"
                  onChange={onEmailHandler}
                  readOnly={canEdit ? false : true}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
                <button
                  type="button"
                  onClick={onEmailSendHandler}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-cente hover:text-main-color"
                >
                  인증 발송
                </button>
              </div>
              {!validateEmail(email) && (
                <p className="text-xs text-main-color">
                  올바른 형식의 이메일을 작성해 주세요.
                </p>
              )}
              {/* <p className=" text-[11px] text-[#f15746]"> 에러메시지 </p> */}
            </div>
            <div className="pb-[32px] relative">
              <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                인증코드
              </h3>
              <div className="relative m-0 p-0">
                <input
                  type="text"
                  placeholder=""
                  onChange={onEmailCodeHandler}
                  className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full"
                />
                <button
                  type="button"
                  onClick={onEmailCodeValidateHandler}
                  className="text-[13px] absolute right-0 t-1/2 translate-y-1/2 items-center cursor-pointer inline-flex justify-center align-middle text-center hover:text-main-color"
                >
                  인증
                </button>
              </div>
            </div>
                </>
            )}
            {newPW && (
                <>
                <div className="pb-[32px] relative">
                    <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                      새 비밀번호
                    </h3>
                    <div className="relative m-0 p-0">
                        <input
                            type="password"
                            onChange={onPasswordHandler}
                            placeholder="영문, 숫자, 특수문자 조합 8-16자"
                            className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full" />
                    </div>
                    {!validatePassword(password) && (
                        <p className="block absolute leading-[16px] text-xs text-main-color">
                            영문, 숫자, 특수문자를 조합하여 입력해주세요.
                        </p>
                    )}
                </div>
                <div className="pb-[82px] relative">
                        <h3 className="text-[13px] tracking-[-.07px] leading-[18px]">
                            새 비밀번호 확인
                        </h3>
                        <div className="relative m-0 p-0">
                            <input
                                type="password"
                                onChange={onCheckPasswordHandler}
                                className="focus:outline-none py-[8px] border-b-[1px] text-[15px] leading-[22px] tracking-[-.15px] w-full" />
                        </div>
                        {checkPassword != password && (
                          <p className="text-xs text-main-color">
                            비밀번호가 일치하지 않습니다.
                          </p>
                        )}
                    </div>
                    </>
            )}
            <button
              type="submit"
              className={`${
                newPW ? "bg-main-color" : "hidden"
              } items-center cursor-pointer inline-flex justify-center text-center align-middle  text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full tracking-[-.16px]`}
            >{" "}변경하기{" "}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
