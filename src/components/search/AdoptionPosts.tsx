"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import PostCard from "../PostCard";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
import { useSearchParams } from 'next/navigation'
import { Adpotion, getSearchResponse } from "@/service/my/adoption";

interface Option {
  value: string;
  label: string;
}

const sortOption: Option[] = [
  { value: "order=DESC&orderCriteria=created", label: "최신순" },
  { value: "order=ASC&orderCriteria=created", label: "오래된 순" },
  { value: "order=DESC&orderCriteria=view", label: "조회 높은 순" },
  { value: "order=ASC&orderCriteria=view", label: "조회 낮은 순" },
  { value: "order=DESC&orderCriteria=price", label: "가격 높은 순" },
  { value: "order=ASC&orderCriteria=price", label: "가격 낮은 순" },
];

export default function AdoptionPosts() {
  const [data, setData] = useState<getSearchResponse | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("order=DESC&orderCriteria=created");
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLogin = useRecoilValue(userAtom);
  const target = useRef(null);
  
  const searchParams = useSearchParams();

  const searchKeyword = searchParams ? searchParams.get('keyword') : '';

  const options = {
    threshold: 1.0,
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    setPage(1);
    setData(null);
  };

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/search/category/${searchKeyword}?page=${page}&size=20&${sort}&category=adoption`
      );

      setData(
        (prevData) =>
          ({
            result: [
                ...(prevData?.result || []),
                ...response.data.result,
              ]
          } as getSearchResponse)
      );

      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, [sort]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && existNextPage) {
          getItems();
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
  }, [getItems, existNextPage, loading, options]);

  const handleWriteClick = () => {
    // Handle the logic for opening the write page
    location.href = `community/adoption/write`;
  };

  const itemlist: Adpotion[] =
    data !== null && data.result
      ? data.result.map((item) => ({
        idx: 1,
        userIdx: 123,
        title: '예시 입양',
        category: 'adoption',
        writeDate: new Date('2023-01-01T12:00:00Z'),
        thumbnail: '예시 썸네일.jpg',
        nickname: '예시 닉네임',
        profilePath: '예시 프로필 경로',
        price: 100,
        gender: '수컷',
        size: '중형',
        variety: '예시 종류',
        state: '입양 가능',
        view: 1,
        }))
      : [];

  return (
    <section>
       {/* 솔트링 콤보 박스 PC */}
      <PC>
        <div className="flex items-center relative ml-[40px] mr-[40px] mt-36">
          <p className="font-bold text-[20px]">{searchKeyword}</p>
          <div className="relative ml-auto">
            <select
              className="text-black bg-white p-1 border-[1px] rounded-md focus:outline-none text-sm my-2 "
              value={sort}
              onChange={handleSortChange}
            >
              {sortOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </PC>
      {/* 솔트링 콤보 박스 모바일 */}
      <Mobile>
        <div className="flex items-center relative ml-[16px] mr-[16px] mt-36">
          <p className="font-bold text-[20px]">{searchKeyword}</p>
          <div className="relative ml-auto">
            <select
              className="text-black bg-white p-1 border-[1px] rounded-md focus:outline-none text-sm my-2 "
              value={sort}
              onChange={handleSortChange}
            >
              {sortOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Mobile>
      {/* 게시글 목록 PC */}
      <PC>
        {data !== null && data.result ? (
          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 ml-[40px] mr-[40px]">
            {itemlist.map((post) => (
              <li key={post.idx}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
          </div>
        )}
      </PC>
       {/* 게시글 목록 모바일 */}
      <Mobile>
        {data !== null && data.result ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-4 pl-[16px] pr-[16px]">
              {itemlist.map((post) => (
                  <PostCard  key={post.idx} post={post} />
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
            </div>
          )}
      </Mobile>

      {existNextPage && (
        <div className="flex justify-center">
          <div
            className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
            ref={target}
          ></div>
        </div>
      )}
      <PC>
        {isLogin && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              className="w-16 h-16 rounded-full bg-main-color text-white flex justify-center items-center text-5xl"
              onClick={handleWriteClick}
            >
              +
            </button>
          </div>
        )}
      </PC>
      <Mobile>
        {isLogin && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              className="w-12 h-12 rounded-full bg-main-color text-white flex justify-center items-center text-5xl"
              onClick={handleWriteClick}
            >
              +
            </button>
          </div>
        )}
      </Mobile>
    </section>
  );
}
