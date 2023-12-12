export interface getResponse {
  status: number;
  message: string;
  result: {
    pageSize: number;
    totalCount: number;
    totalPage: number;
    existsNextPage: boolean;
    items: Array<{
      idx: number;
      view: number;
      userIdx: number;
      title: string;
      category: string;
      description: string;
      writeDate: string;
      thumbnail: string;
      images: Array<{
        idx: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        boardIdx: number;
        category: string;
        mediaSequence: number;
        path: string;
        coverImgPath: string | null;
      }>;
      UserInfo: {
        idx: number;
        nickname: string;
        profilePath: string;
      };
      boardCommercial: {
        idx: number;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        boardIdx: number;
        price: number;
        gender: string;
        size: string;
        variety: string;
        state: string;
      };
    }>;
  };
}

export interface getSearchResponse {
  status: number;
  message: string;
  result:Array<{
    _index:string;
    _type:string;
    _id:string;
    _score:number;
    _source:{
      idx: number,
      userIdx: number,
      title: string,
      category: string,
      description: string,
      thumbnail: string,
      deletedAt: string | null,
      updatedAt: string,
      view:string | null,
      writeDate:Date | null,
      nickname: string | null,
      profilePath: string | null
      boardCommercial: {
          idx: number,
          boardIdx: number,
          gender: string,
          size: string,
          price: number,
          variety: string,
          pattern: string,
          birthDate: string,
          state: string,
          deletedAt: string | null,
          updatedAt: string
      },
      keywords: string
    }
  }>;
}

export type Adpotion = {
  idx: number;
  view: number;
  userIdx: number;
  title: string;
  category: string;
  writeDate: Date;
  nickname: string;
  profilePath: string;
  price: number;
  gender: string;
  size: string;
  variety: string;
  state: string;
  thumbnail: string;
};

export interface GetAdoptionPostsView {
  status: number;
  message: string;
  result: {
    idx: number;
    view: number;
    userIdx: number;
    title: string;
    category: string;
    description: string;
    writeDate: string;
    images: Array<{
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      boardIdx: number;
      category: string;
      mediaSequence: number;
      path: string;
      coverImgPath: string | null;
    }>;
    commentCnt: number;
    UserInfo: {
      idx: number;
      nickname: string;
      profilePath: string;
    };
    boardCommercial: {
      idx: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      boardIdx: number;
      price: number;
      gender: string;
      size: string;
      pattern: string;
      variety: string;
      state: string;
      birthDate: string;
    };
  };
}

export type Images = {
  idx: number;
  createdAt: string;
  updatedAt: string;
  boardIdx: number;
  category: string;
  mediaSequence: number;
  path: string;
};
