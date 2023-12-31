"use client";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { login } from "@/api/login/login";
import { validateEmail, validatePassword } from "../join/JoinExp";
import { isLoggedInState, userAtom, fcmState } from "@/recoil/user";

import { useReGenerateTokenMutation } from "@/api/accesstoken/regenerate";

export default function LoginInput() {
  const setUser = useSetRecoilState(userAtom);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const [fcm, setfcm] = useRecoilState(fcmState);
  const reGenerateTokenMutation = useReGenerateTokenMutation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [warningMsg, setWarningMsg] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const a = JSON.stringify(data.data);
      const resulta = JSON.parse(a);
      const b = JSON.stringify(resulta.result);
      const resultb = JSON.parse(b);
      setUser({
        accessToken: resultb.accessToken,
        refreshToken: resultb.refreshToken,
        idx: resultb.idx,
        profilePath: resultb.profilePath,
        nickname: resultb.nickname,
      });
      setIsLoggedIn(true);
      router.replace("/");
    },
    onError: (err: { response: { status: number } }) => {
      if (err.response.status < 600) {
        setWarningMsg(true);
      }
      // if(err.response.status == 401) {
      //     reGenerateTokenMutation.mutate({
      //         refreshToken: ""
      //     }, {
      //         onSuccess: () => {
      //           mutation.mutate({  });
      //         },
      //         onError: () => {
      //             router.replace("/");
      //             alert("로그인 만료\n다시 로그인 해주세요");
      //         }
      //     });
      // }
    },
  });

  const onEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setEmail(value);
  };
  const onPasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as any;
    setPassword(value);
  };
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리프레시 막기
    if (
      !email ||
      !password ||
      !validateEmail(email) ||
      !validatePassword(password)
    ) {
      setWarningMsg(true);
    } else {
      mutation.mutate({ email: email, password: password, fbToken: fcm });
    }
  };
  const appleConfig = {
    client_id: "store.reptimate.web", // This is the service ID we created.
    redirect_uri: "https://web.reptimate.store/api/applelogin/callback", // As registered along with our service ID
    response_type: "code id_token",
    state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
    scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
    response_mode: "form_post",
  };
  const queryString = Object.entries(appleConfig)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  const url = `https://appleid.apple.com/auth/authorize?${queryString}`;

  return (
    <div className="m-o m-auto pt-16 px-0 pb-40 w-[400px] mt-20">
      <form onSubmit={onSubmitHandler}>
        <div className="relative pt-2.5 pb-3.5">
          <h3 className="text-lg tracking-thighter">이메일</h3>
          <div className="relative">
            <input
              className="w-full leading-5 text-base border-b-2 focus:border-b-3 border-b-gray-200 focus:border-b-main-color focus:pb-2 py-2 focus:outline-none"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onEmailHandler}
              placeholder="예) repti@mate.co.kr"
            ></input>
          </div>
          <p className="hidden text-xs leading-4 absolute">
            이메일 주소를 정확히 입력해주세요.
          </p>
        </div>
        <div className="relative pt-2.5 pb-3.5">
          <h3 className="text-lg tracking-thighter">비밀번호</h3>
          <div className="relative">
            <input
              className="w-full leading-5 text-base border-b-2 focus:border-b-3 border-b-gray-200 focus:border-b-main-color focus:pb-2 py-2 focus:outline-none"
              type="password"
              id="password"
              onChange={onPasswordHandler}
            ></input>
          </div>
          <p className="hidden text-main-color text-xs leading-4 absolute">
            영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)
          </p>
        </div>
        <div className="relative pt-5">
          <div>
            <button
              className="text-white inline-flex cursor-pointer items-center justify-items-center justify-center align-middle text-center bg-main-color font-bold w-full text-base trackting-[-.16px] h-14 rounded-xl"
              type="submit"
            >
              로그인
            </button>
          </div>
          {warningMsg ? (
            <p className="text-main-color text-xs leading-4 pt-2.5 justify-items-center justify-center text-center">
              이메일과 비밀번호를 확인후 다시 시도해 주세요
            </p>
          ) : (
            <p className="hidden text-main-color text-xs leading-4 pt-2.5 justify-items-center justify-center text-center">
              이메일과 비밀번호를 확인후 다시 시도해 주세요
            </p>
          )}
        </div>
      </form>

      <ul className="flex justify-evenly mt-5">
        <li className="inline-flex flex-1">
          <a
            href="/join"
            className="inline-flex text-[13px] tracking-[-.07px] m-auto px-[10px]"
          >
            {" "}
            이메일 가입{" "}
          </a>
        </li>
        <li className=" bg-[#d3d3d3] inline-block h-[13px] mt-[3px] w-[1px]"></li>
        <li className="inline-flex flex-1">
          <a
            href="/login/find_password"
            className="inline-flex text-[13px] tracking-[-.07px] m-auto px-[10px]"
          >
            {" "}
            비밀번호 찾기{" "}
          </a>
        </li>
      </ul>

      <div className="mt-[40px]">
        <form method="POST" action="/api/kakaologin">
          <button
            type="submit"
            className="relative text-[#222] border-[#ebebeb] inline-flex cursor-pointer items-center justify-center align-middle text-center bg-[#fff] w-full text-[16px] tracking-[-.16px] h-14 rounded-xl border-[1px] mb-[8px]"
          >
            <img
              className="h-[24px] left-[15px] absolute top-[13px] w-[24px]"
              src="/login/pngegg.png"
              alt=""
            ></img>
            카카오로 로그인
          </button>
        </form>
        <form method="POST" action="/api/googlelogin">
          <button
            type="submit"
            className="relative text-[#222] border-[#ebebeb] inline-flex cursor-pointer items-center justify-center align-middle text-center bg-[#fff] w-full text-[16px] tracking-[-.16px] h-14 rounded-xl border-[1px] mb-[8px]"
          >
            <img
              className="h-[24px] left-[15px] absolute top-[13px] w-[24px]"
              src="/login/ic_google.png"
              alt=""
            ></img>
            Google로 로그인
          </button>
        </form>
        <Link
          href={url}
          className="relative text-[#222] border-[#ebebeb] inline-flex cursor-pointer items-center justify-center align-middle text-center bg-[#fff] w-full text-[16px] tracking-[-.16px] h-14 rounded-xl border-[1px] mb-[8px]"
        >
          <img
            className="h-[24px] left-[15px] absolute top-[13px] w-[24px]"
            src="/login/ic_apple.png"
            alt=""
          ></img>
          Apple로 로그인
        </Link>
      </div>
    </div>
  );
}
