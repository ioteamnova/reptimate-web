"use client";

import { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import { useRecoilState } from "recoil";
import { recentSearchKeywordsAtom } from "@/recoil/user";
import { useRouter } from 'next/navigation';

interface SearchProps {
  isHidden: Boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_LENGTH = 10;

const Search: React.FC<SearchProps> = ({ isHidden, setHidden }) => {

  const [inputValue, setInputValue] = useState('');
  const [recentSearchKeywords, setrecentSearchKeywords] = useRecoilState(recentSearchKeywordsAtom);
  const [filteredRecentSearchKeywords, setfilteredRecentSearchKeywords] = useState<string[]>([]);
  const [isModalShown, setisModalShown] = useState(false);
  const router = useRouter();

  const filterRecentKeywords = (recentKeywords:string[]) => {

    const filteredRecentKeywords = recentKeywords.map(keyword => {

      if (keyword.length > MAX_LENGTH) {
        return keyword.substring(0, MAX_LENGTH) + "...";
      } else {
        return keyword;
      }
    })

    return filteredRecentKeywords;

  }

  // recentSearchKeywords 필터링
  useEffect(() => {

    setfilteredRecentSearchKeywords(filterRecentKeywords(recentSearchKeywords));

  }, [recentSearchKeywords]);


  const hideSearchModal = () => {
    setHidden(true)
  }

  // 검색어 입력할때마다 state 변경
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 엔터 이벤트
  const handleEnterPress = () => {
                
        if(inputValue.length !== 0){

          router.push(`/searchresult/integrated?keyword=${inputValue}`)

          setHidden(true);
          
          setrecentSearchKeywords((prevKeywords) => [...prevKeywords, inputValue]);
        }
  };

  // 최근 검색어 클릭
  const handleRecentKeywordPress = (indexOfPressedKeyword:number) => {    

    const pressedKeyword = recentSearchKeywords[indexOfPressedKeyword];
    
    setInputValue(pressedKeyword)

    router.push(`/searchresult/integrated?keyword=${pressedKeyword}`)

    setHidden(true);

  }

  // 검색어 개별 삭제
  const deleteRecentKeyword = (indexToDelete:number) => {

    const updatedKeywords = recentSearchKeywords.filter((_, i) => i !== indexToDelete);
    setrecentSearchKeywords(updatedKeywords);
    
  }

  // 검색어 전체삭제 모달창 띄우기
  const showModal = () => {
    setisModalShown(true)
  }

  // 검색어 전체삭제
  const deleteAllRecentKeywords = () => {
    setrecentSearchKeywords([])
    setfilteredRecentSearchKeywords([])
    setisModalShown(false)
  }

  return (

    <>
      <PC>

        {/* 검색어 전체삭제 모달창 */}
        {isModalShown && (
          <div className="fixed inset-0 flex items-center justify-center z-[10001] bg-gray-800 bg-opacity-75" onClick={() => setisModalShown(false)}>
            <div className="bg-white py-8 px-12 rounded-md w-80" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col relative flex justify-center items-center">
                <p className="text-lg"><strong>최근 검색어 삭제</strong></p>
                <p className="text-gray-500 text-sm">검색기록을 모두 삭제하시겠습니까?</p>
              </div>
            
            <div className="flex mt-4">
              <button className="bg-gray-300 text-white font-bold py-2 px-4 rounded flex-auto" onClick={() => {setisModalShown(false)}}>
                취소
              </button>
              <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-2 flex-auto" onClick={deleteAllRecentKeywords}>
                확인
              </button>
            </div>
          </div>
        </div>
        )}

        <div className={`fixed inset-0 z-[10000] bg-white overflow-y-auto ${isHidden ? 'hidden' : ''}`} >

        {/* 검색 모달창 종료 버튼 */}
        <div className="fixed right-0" onClick={() => {hideSearchModal()}}>
          <img src="/img/delete.png" className="w-9 h-9 m-5 hover:cursor-pointer" />
        </div>

        {/* 검색어 입력창 */}
        <div className="flex flex-col items-center mt-16">

          <div className="flex w-2/5 items-center">

          <form
            onSubmit={(e) => {
              e.preventDefault(); // 폼의 기본 동작(새로고침) 방지
              handleEnterPress();
            }} 
            className="w-full">

            <input 
                className="w-full text-xl py-3 focus:outline-none"
                type="text"
                placeholder="검색 키워드를 입력해주세요."
                value={inputValue}
                onChange={handleInputChange}
              />
          </form>
            
          {
            inputValue.length === 0
            ? null
            : <img src="/img/delete.png" className="w-5 h-5 ml-5" onClick={() => {setInputValue('')}}/>
          }
              
          </div>
          
          <div className=" bg-black w-2/5 pt-1" />

        </div>

        {/* 최근 검색어 목록 */}
        <div className="flex flex-col items-center justify-center mt-5">

          <div className="w-2/5">
            <span className="font-bold">최근 검색어</span>
            {recentSearchKeywords.length === 0
            ? null
            : <span className="text-sm text-gray-400 ml-1 underline hover:cursor-pointer" onClick={showModal}>지우기</span>}
            
          </div>

          <div className=" w-2/5 mt-2 hover:cursor-pointer">
            {filteredRecentSearchKeywords.map((recentKeyword, index) => (
              <div key={index} className="inline-block border border-gray-300 rounded-full py-1 px-3 mb-2 mr-2">
                <span className="text-gray-500 text-sm" onClick={() => handleRecentKeywordPress(index)}>
                  {recentKeyword}
                </span>
                <span className="ml-1 text-gray-400 text-xs" onClick={() => deleteRecentKeyword(index)}>
                  ✕
                </span>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      </PC>
      {/* 모바일 화면(반응형) */}
      <Mobile>
          {/* 검색어 전체삭제 모달창 */}
          {isModalShown && (
            <div className="fixed inset-0 flex items-center justify-center z-[10001] bg-gray-800 bg-opacity-75" onClick={() => setisModalShown(false)}>
              <div className="bg-white py-8 px-12 rounded-md w-80" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col relative flex justify-center items-center">
                  <p className="text-lg"><strong>최근 검색어 삭제</strong></p>
                  <p className="text-gray-500 text-sm">검색기록을 모두 삭제하시겠습니까?</p>
                </div>
              
              <div className="flex mt-4">
                <button className="bg-gray-300 text-white font-bold py-2 px-4 rounded flex-auto" onClick={() => {setisModalShown(false)}}>
                  취소
                </button>
                <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-2 flex-auto" onClick={deleteAllRecentKeywords}>
                  확인
                </button>
              </div>
            </div>
          </div>
          )}

          <div className={`fixed inset-0 z-[10000] bg-white overflow-y-auto ${isHidden ? 'hidden' : ''}`} >

          {/* 검색 모달창 종료 버튼 */}
          <div className="fixed right-0" onClick={() => {hideSearchModal()}}>
            <img src="/img/delete.png" className="w-9 h-9 m-5 hover:cursor-pointer" />
          </div>

          {/* 검색어 입력창 */}
          <div className="flex flex-col items-center mt-16">

            <div className="flex w-4/5 items-center">

            <form
              onSubmit={(e) => {
                e.preventDefault(); // 폼의 기본 동작(새로고침) 방지
                handleEnterPress();
              }} 
              className="w-full">

              <input 
                  className="w-full text-xl py-3 focus:outline-none"
                  type="text"
                  placeholder="검색 키워드를 입력해주세요."
                  value={inputValue}
                  onChange={handleInputChange}
                />
            </form>
              
            {
              inputValue.length === 0
              ? null
              : <img src="/img/delete.png" className="w-5 h-5 ml-5" onClick={() => {setInputValue('')}}/>
            }
                
            </div>
            
            <div className=" bg-black w-4/5 pt-1" />

          </div>

          {/* 최근 검색어 목록 */}
          <div className="flex flex-col items-center justify-center mt-5">

            <div className="w-4/5">
              <span className="font-bold">최근 검색어</span>
              {recentSearchKeywords.length === 0
              ? null
              : <span className="text-sm text-gray-400 ml-1 underline hover:cursor-pointer" onClick={showModal}>지우기</span>}
              
            </div>

            <div className=" w-4/5 mt-2">

              {filteredRecentSearchKeywords.map((recentKeyword, index) => (
                <div key={recentKeyword} className="inline-block border border-gray-300 rounded-full py-1 px-3 mb-2 mr-2">
                  <span className="text-gray-500 text-sm">{recentKeyword}</span>
                  <span className="ml-1 text-gray-400 text-xs" onClick={() => deleteRecentKeyword(index)}>✕</span>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </Mobile>
      
      </>
  );
}

export default Search