import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist(); // 페이지가 변경되더라도 상태관리를 유지하기 위해 사용된다.

interface loginResponse {
  status: number;
  message: string;
  result: User;
}
interface User {
  accessToken: string;
  refreshToken: string;
  idx: number;
  profilePath: string;
  nickname: string;
}
interface fcm {
  body: string;
  title: string;
}

export interface UserData {
  USER_DATA: {
    accessToken: string;
    refreshToken: string;
    id: number;
  };
}

export const userAtom = atom<User | null>({
  key: "USER_DATA",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const recentSearchKeywordsAtom = atom<string[]>({
  key: "recentSearchKeywords",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false, // Initially, the user is not logged in
});

export const chatVisisibleState = atom({
  key: "chatVisibleState",
  default: false,
});

export const fcmState = atom({
  key: "fcmState",
  default: "",
});

export const fcmNotificationState = atom<fcm>({
  key: "fcmNotificationState",
  default: {
    body: "",
    title: "",
  },
});

export const notiVisisibleState = atom({
  key: "notiVisisibleState",
  default: false,
});
