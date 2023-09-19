import { GetAdoptionPostsView } from "@/service/my/adoption";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Mobile, PC } from "../ResponsiveLayout";
import { useMutation } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil/user";
import { Comment, getCommentResponse } from "@/service/comment";
import { adoptionEdit } from "@/api/adoption/adoption";
import { useRouter } from "next/navigation";
import { useDrag, useDrop } from "react-dnd";

interface FileItem {
  file: File;
  id: number;
}

interface Option {
  value: string;
  label: string;
}

const uploadUri = "https://www.reptimate.store/conv/board/upload";

const varietyOptions: Option[] = [
  { value: "품종을 선택하세요", label: "품종을 선택하세요" },
  { value: "크레스티드 게코", label: "크레스티드 게코" },
  { value: "레오파드 게코", label: "레오파드 게코" },
  { value: "가고일 게코", label: "가고일 게코" },
  { value: "리키 에너스", label: "리키 에너스" },
  { value: "기타", label: "기타" },
];

const patternOptions: Record<string, Option[]> = {
  "품종을 선택하세요": [
    { value: "모프를 선택하세요", label: "모프를 선택하세요" },
  ],
  // Define patterns for each variety option
  "크레스티드 게코": [
    { value: "", label: "모프를 선택하세요" },
    { value: "노멀", label: "노멀" },
    { value: "릴리 화이트", label: "릴리 화이트" },
    { value: "아잔틱", label: "아잔틱" },
    { value: "릴잔틱", label: "릴잔틱" },
    { value: "헷 아잔틱", label: "헷 아잔틱" },
    { value: "릴리 헷 아잔틱", label: "릴리 헷 아잔틱" },
    { value: "세이블", label: "세이블" },
    { value: "카푸치노", label: "카푸치노" },
    { value: "프라푸치노", label: "프라푸치노" },
    { value: "슈퍼 카푸", label: "슈퍼 카푸" },
    { value: "기타", label: "기타" },
  ],
  "레오파드 게코": [
    { value: "", label: "모프를 선택하세요" },
    { value: "갤럭시", label: "갤럭시" },
    { value: "고스트", label: "고스트" },
    { value: "그린", label: "그린" },
    { value: "노멀", label: "노멀" },
    { value: "다크", label: "다크" },
    { value: "데빌", label: "데빌" },
    { value: "라벤더", label: "라벤더" },
    { value: "레드", label: "레드" },
    { value: "만다린", label: "만다린" },
    { value: "블랙 나이트", label: "블랙 나이트" },
    { value: "블러드", label: "블러드" },
    { value: "블리자드", label: "블리자드" },
    { value: "사이퍼", label: "사이퍼" },
    { value: "스노우", label: "스노우" },
    { value: "기타", label: "기타" },
  ],
  "가고일 게코": [
    { value: "노멀", label: "노멀" },
    { value: "레드", label: "레드" },
    { value: "레티큐어 베이컨", label: "레티큐어 베이컨" },
    { value: "블로치드", label: "블로치드" },
    { value: "스켈레톤", label: "스켈레톤" },
    { value: "스트라이프드", label: "스트라이프드" },
    { value: "옐로우", label: "옐로우" },
    { value: "오렌지", label: "오렌지" },
    { value: "화이트", label: "화이트" },
    { value: "기타", label: "기타" },
  ],
  "리키 에너스": [
    { value: "", label: "모프를 선택하세요" },
    { value: "노멀", label: "노멀" },
    { value: "누아나", label: "누아나" },
    { value: "누아미", label: "누아미" },
    { value: "다스 모울", label: "다스 모울" },
    { value: "다크", label: "다크" },
    { value: "레드바", label: "레드바" },
    { value: "리버만", label: "리버만" },
    { value: "멜라니스 스페셜", label: "멜라니스 스페셜" },
    { value: "모로", label: "모로" },
    { value: "얏트", label: "얏트" },
    { value: "코기스", label: "코기스" },
    { value: "트로거", label: "트로거" },
    { value: "트루 컬러", label: "트루 컬러" },
    { value: "파인 아일랜드", label: "파인 아일랜드" },
    { value: "프리델", label: "프리델" },
    { value: "하키토", label: "하키토" },
    { value: "헬 멜라니스틱", label: "헬 멜라니스틱" },
    { value: "GT", label: "GT" },
    { value: "기타", label: "기타" },
  ],
  기타: [
    { value: "", label: "모프를 선택하세요" },
    { value: "기타", label: "기타" },
  ],
};

export default function AdoptionEdit() {
  const router = useRouter();
  const params = useParams();
  const idx = params?.idx;

  const [data, setData] = useState<GetAdoptionPostsView | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ file: File; id: number }>
  >([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string>("");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [variety, setVariety] = useState<string>("품종을 선택하세요");
  const [pattern, setPattern] = useState<string>("모프를 선택하세요");

  const [boardCommercialIdx, setBoardCommercialIdx] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  window.onbeforeunload = function (event) {
    const confirmationMessage =
      "변경 내용이 저장되지 않습니다.\n뒤로 가시겠습니까?";

    (event || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };

  function BackButton() {
    const handleGoBack = () => {
      window.history.back(); // Go back to the previous page using window.history
    };

    return (
      <button onClick={handleGoBack} className="cursor-poiter px-2 font-bold">
        &lt;
      </button>
    );
  }

  let userAccessToken: string | null = null;
  let currentUserIdx: number | null = null;
  let userProfilePath: string | null = null;
  let userNickname: string | null = null;
  if (typeof window !== "undefined") {
    // Check if running on the client side
    const storedData = localStorage.getItem("recoil-persist");
    const userData = JSON.parse(storedData || "");
    currentUserIdx = userData.USER_DATA.idx;
    userAccessToken = userData.USER_DATA.accessToken;
    userProfilePath = userData.USER_DATA.profilePath;
    userNickname = userData.USER_DATA.nickname;
  }

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.reptimate.store/board/${idx}?userIdx=${currentUserIdx}`
      );
      // Assuming your response data has a 'result' property
      setData(response.data);
      const post = response.data.result;
      setTitle(post?.title || "");
      setVariety(post?.boardCommercial.variety || "품종을 선택하세요");
      setPattern(post?.boardCommercial.pattern || "모프를 선택하세요");
      setBirthDate(post?.boardCommercial.birthDate || "연도-월-일");
      setSelectedGender(post?.boardCommercial.gender || "");
      setSelectedSize(post?.boardCommercial.size || "");
      setPrice(post?.boardCommercial.price.toString() || "");
      setDescription(post?.description || "");
      setBoardCommercialIdx(post?.boardCommercial.idx || "");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const handleVarietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVariety = e.target.value;
    setVariety(selectedVariety);

    // Reset pattern when variety changes
    setPattern("모프를 선택하세요");
  };

  const handleGenderClick = (gender: string) => {
    setSelectedGender(gender);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setBirthDate(newDate);
  };

  const [showFileLimitWarning, setShowFileLimitWarning] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileItem[] = Array.from(files)
        .slice(0, 5 - selectedFiles.length)
        .map((file) => ({
          file,
          id: Date.now() + Math.random(),
        }));

      if (selectedFiles.length + newFiles.length > 5) {
        setShowFileLimitWarning(true);
      } else {
        setSelectedFiles((prevSelectedFiles) => [
          ...prevSelectedFiles,
          ...newFiles,
        ]);
      }
    }
  };

  const handleRemoveItem = (id: number) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.filter((item) => item.id !== id)
    );
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const draggedFile = selectedFiles[dragIndex];
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(dragIndex, 1);
    updatedFiles.splice(hoverIndex, 0, draggedFile);
    setSelectedFiles(updatedFiles);
  };

  const FileItem = ({
    fileItem,
    index,
  }: {
    fileItem: { file: File; id: number };
    index: number;
  }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "FILE",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: "FILE",
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveFile(item.index, index);
          item.index = index;
        }
      },
    });

    useEffect(() => {
      // Preload images when component mounts
      selectedFiles.forEach((fileItem) => {
        const img = new Image();
        img.src = URL.createObjectURL(fileItem.file);
      });
    }, [selectedFiles]);

    const imageUrl = useMemo(
      () => URL.createObjectURL(fileItem.file),
      [fileItem]
    ); // Memoize the image URL

    return (
      <div ref={(node) => drag(drop(node))}>
        <div
          key={fileItem.id}
          className="relative w-32 h-32 mx-2 border-2 border-gray-200"
          onClick={(e) => e.preventDefault()}
        >
          {fileItem.file.type.startsWith("image/") ? (
            <img
              src={imageUrl}
              alt={`Image ${fileItem.id}`}
              className="object-cover w-full h-full"
            />
          ) : fileItem.file.type.startsWith("video/") ? (
            <video className="object-cover w-full h-full">
              <source src={imageUrl} type={fileItem.file.type} />
              현재 브라우저는 비디오 태그를 지원하지 않습니다.
            </video>
          ) : (
            <p>지원하지 않는 파일 형태</p>
          )}
          <button
            onClick={() => handleRemoveItem(fileItem.id)}
            className="absolute -top-2 -right-2 transform translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-red-500 text-white rounded-full"
          >
            X
          </button>
        </div>
      </div>
    );
  };
  const mutation = useMutation({
    mutationFn: adoptionEdit,
    onSuccess: (data) => {
      console.log("============================");
      console.log("Successful Editing of post!");
      console.log(data);
      console.log(data.data);
      console.log("============================");
      alert("게시글 수정이 완료되었습니다.");
      router.replace(`/community/adoption/posts/${idx}`);
    },
  });
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const requestData = {
      boardIdx: idx,
      boardCommercialIdx: boardCommercialIdx,
      userIdx: currentUserIdx || 0,
      title: title,
      category: "adoption",
      description: description,
      price: price,
      gender: selectedGender || "",
      size: selectedSize || "",
      variety: variety,
      pattern: pattern,
      birthDate: birthDate,
      userAccessToken: userAccessToken || "",
      fileUrl: "",
    };

    if (
      title !== "" &&
      price !== "" &&
      selectedGender !== "" &&
      selectedSize !== "" &&
      variety !== "" &&
      pattern !== "" &&
      birthDate !== ""
    ) {
      if (selectedFiles.length === 0) {
        mutation.mutate(requestData);
      } else {
        console.log(selectedFiles);

        const formData = new FormData();
        selectedFiles.forEach((fileItem) => {
          formData.append("files", fileItem.file);
        });

        try {
          // Send files to the first server
          const response = await axios.post(uploadUri, formData, {
            headers: {
              Authorization: `Bearer ${userAccessToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 201) {
            const responseData = response.data;

            console.log(responseData);
            // Now, you can send additional data to the API server
            const requestData1 = {
              boardIdx: idx,
              boardCommercialIdx: boardCommercialIdx,
              userIdx: currentUserIdx || 0,
              title: title,
              category: "adoption",
              description: description,
              price: price,
              gender: selectedGender || "",
              size: selectedSize || "",
              variety: variety,
              pattern: pattern,
              birthDate: birthDate,
              userAccessToken: userAccessToken || "",
              fileUrl: responseData.result, // Use the response from the first server
            };

            console.log(requestData1);

            mutation.mutate(requestData1);
          } else {
            console.error("Error uploading files to the first server.");
            alert("Error uploading files. Please try again later.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred. Please try again later.");
        }
      }
    } else {
      // Create a list of missing fields
      const missingFields = [];
      if (title === "") missingFields.push("제목");
      if (variety === "") missingFields.push("품종");
      if (pattern === "") missingFields.push("모프");
      if (birthDate === "") missingFields.push("생년월일");
      if (selectedGender === "" || "null") missingFields.push("성별");
      if (selectedSize === "" || "null") missingFields.push("크기");
      if (price === "") missingFields.push("가격");

      // Create the alert message based on missing fields
      let alertMessage = "아래 입력칸들은 공백일 수 없습니다. :\n";
      alertMessage += missingFields.join(", ");

      alert(alertMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-screen-md mx-auto">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
        </div>
      )}
      <PC>
        <h2 className="flex flex-col items-center justify-center text-4xl font-bold p-10">
          분양 게시글
        </h2>
      </PC>
      <Mobile>
        <BackButton />
        <h2 className="flex flex-col items-center justify-center text-xl font-bold p-4">
          분양 게시글
        </h2>
      </Mobile>
      <div className="">
        <input
          type="file"
          accept="image/*, video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="mediaInput"
          max="5"
        />
        <label
          className="flex overflow-x-auto border-2 border-gray-300 items-center justify-center py-3 cursor-pointer mx-auto"
          htmlFor="mediaInput"
        >
          {selectedFiles.length === 0 && (
            <div className="w-32 h-32 flex flex-col items-center justify-center">
              <img
                src="/img/camera.png"
                alt="Camera Icon"
                className="w-16 h-16"
              />
              <span className="">사진 업로드</span>
            </div>
          )}
          {selectedFiles.map((fileItem, index) => (
            <FileItem key={fileItem.id} fileItem={fileItem} index={index} />
          ))}
        </label>
      </div>
      <div className="mt-4 flex flex-col">
        <p className="font-bold text-xl my-2">제목</p>
        <input
          type="text"
          placeholder="제목을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="font-bold text-xl my-2">품종</p>
        <select
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={variety}
          onChange={handleVarietyChange}
        >
          {varietyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="font-bold text-xl my-2">모프</p>
        {variety !== "품종을 선택하세요" && patternOptions[variety] && (
          <select
            className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            {patternOptions[variety].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        <p className="font-bold text-xl my-2">생년월일</p>
        <input
          type="date"
          placeholder="선택해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={birthDate}
          onChange={handleDateChange}
        />
        <p className="font-bold text-xl my-2">성별</p>
        <div className="flex flex-row items-center justify-center">
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "수컷"
                ? "bg-gender-male-dark-color"
                : "bg-gender-male-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("수컷")}
          >
            수컷
          </button>
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "암컷"
                ? "bg-gender-female-dark-color"
                : "bg-gender-female-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("암컷")}
          >
            암컷
          </button>
          <button
            className={`w-52 py-2 rounded ${
              selectedGender === "미구분"
                ? "bg-gender-none-dark-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleGenderClick("미구분")}
          >
            미구분
          </button>
        </div>
        <p className="font-bold text-xl my-2">크기</p>
        <div className="flex flex-row items-center justify-center">
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "베이비"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("베이비")}
          >
            베이비
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "아성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("아성체")}
          >
            아성체
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "준성체"
                ? "bg-main-color"
                : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("준성체")}
          >
            준성체
          </button>
          <button
            className={`w-36 py-2 mx-0.5 rounded ${
              selectedSize === "성체" ? "bg-main-color" : "bg-gender-none-color"
            } text-lg text-white font-bold`}
            onClick={() => handleSizeClick("성체")}
          >
            성체
          </button>
        </div>
        <p className="font-bold text-xl my-2">가격</p>
        <input
          type="number"
          placeholder="가격을 입력해주세요. (원)"
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <p className="font-bold text-xl my-2">내용</p>
        <input
          type="text"
          placeholder="내용을 입력해주세요."
          className="focus:outline-none py-[8px] border-b-[1px] text-[17px] w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <form onSubmit={onSubmitHandler}>
        <button
          type="submit"
          className=" items-center cursor-pointer inline-flex justify-center text-center align-middle bg-main-color text-white font-bold rounded-[12px] text-[16px] h-[52px] w-full my-10"
        >
          게시글 수정
        </button>
      </form>
    </div>
  );
}