"use client";

import { getResponse, Adpotion } from "@/service/adoption";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import { Mobile, PC } from "../ResponsiveLayout";

export default function CommunityHomePosts() {
  const [data, setData] = useState<getResponse | null>(null);
  const [page, setPage] = useState(1);
  const [existNextPage, setENP] = useState(false);
  const [loading, setLoading] = useState(false);
  const target = useRef(null);

  const options = {
    threshold: 1.0,
  };

  const getItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://3.35.87.48:3000/board?page=${page}&size=20&order=DESC&category=adoption`
      );
      setData(
        (prevData) =>
          ({
            result: {
              items: [
                ...(prevData?.result.items || []),
                ...response.data.result.items,
              ],
              existsNextPage: response.data.result.existsNextPage,
            },
          } as getResponse)
      );
      setENP(response.data?.result.existsNextPage);
      setPage((prevPage) => prevPage + 1);
      // console.log(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    getItems();
  }, []);

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
  };

  if (data !== null && data.result.items) {
    const itemlist: Adpotion[] = data.result.items.map((item) => ({
      idx: item.idx,
      view: item.view,
      userIdx: item.userIdx,
      title: item.title,
      category: item.category,
      writeDate: new Date(item.writeDate),
      coverImage: item.images[0]?.coverImgPath || "",
      nickname: item.UserInfo.nickname,
      profilePath: item.UserInfo.profilePath,
      price: item.boardCommercial.price,
      gender: item.boardCommercial.gender,
      size: item.boardCommercial.size,
      variety: item.boardCommercial.variety,
      state: item.boardCommercial.state,
    }));

    return (
      <section>
        <PC>
          <h2 className="text-2xl font-bold p-10">분양글</h2>
        </PC>
        <Mobile>
          <h2 className="text-xl font-bold pl-12 pt-4 pb-4">분양글</h2>
        </Mobile>
        <ul className="pl-10 pr-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {itemlist.map((post) => (
            <li key={post.userIdx}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        {existNextPage && (
          <div className="flex justify-center">
            <div
              className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"
              ref={target}
            ></div>
          </div>
        )}
        <div
          className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleWriteClick}
        >
          글쓰기
        </div>
        <div className="fixed bottom-5 right-5">
          <button
            className="w-12 h-12 rounded-full bg-blue-500 text-white flex justify-center items-center text-2xl shadow-lg focus:outline-none"
            onClick={handleWriteClick}
          >
            +
          </button>
        </div>
      </section>
    );
  } else {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-t-4 border-main-color border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
}
