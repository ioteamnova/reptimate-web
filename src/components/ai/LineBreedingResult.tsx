import axios from "axios";
import { useState } from "react";
import MorphCard from "../MorphCard";
import { Mobile, PC } from "../ResponsiveLayout";
import Swal from "sweetalert2";


export default function LineBreedingResult(props:any) {
    
    const [isLoading, setIsLoading] = useState(false);

    const lineBreedingResultData = props.lineBreedingResult.data;
    const setValueAnalysisResult = props.setValueAnalysisResult;
    const morphInfo = props.morphInfo;

    const topImgPath = lineBreedingResultData.recommend_data ? lineBreedingResultData.recommend_data.top_img : '';
    const leftImgPath = lineBreedingResultData.recommend_data ? lineBreedingResultData.recommend_data.left_img : '';
    const rightImgPath = lineBreedingResultData.recommend_data ? lineBreedingResultData.recommend_data.right_img : '';

    const explanation = lineBreedingResultData.explanation;
    const morphRecommendList = lineBreedingResultData.morph_recommend_list;
    

    // 가치판단 실행버튼 클릭이벤트
    const handleUpload = async () => {

        setIsLoading(true);

        axios({
            method:'post',
            url:`${process.env.NEXT_PUBLIC_AI_URL}/image_ai/value_analyzer_nosave`,
            data: morphInfo.formData,
            params: {
            morph: morphInfo.morph,
            gender: morphInfo.gender,
            },
            headers: { // 요청 헤더
            'Content-Type': 'multipart/form-data',
            },
            })
            .then((result)=>{console.log('요청성공')
            console.log(result)
            setIsLoading(false);  
            setValueAnalysisResult(result);
        
            })
            .catch((error)=>{console.log('요청실패')
            console.log(error)  
            setIsLoading(false);
            Swal.fire({
                text: "요청에 실패했습니다. 이미지를 변경하거나, 다시 시도해주세요.",
                confirmButtonText: "확인", // confirm 버튼 텍스트 지정
                confirmButtonColor: "#7A75F7", // confrim 버튼 색깔 지정
              });

        })

    };

    return(
        <div>
            <PC>
                <div className="mt-[150px] ">
                    {/* 로딩바 */}
                    {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
                    </div>
                    )}

                    <div className='max-w-4xl mx-auto mb-10'>

                        <h2 className="text-3xl font-bold mt-10">브리딩 추천 결과</h2>

                        <div className={`${lineBreedingResultData.recommend_data ? '' : 'hidden'}`}>
                            <div className = 'mt-10'>
                                <span className="text-2xl font-bold ">추천 개체</span>

                                <div className="flex mt-2.5">
                                    <div className="flex-auto">
                                        <MorphCard imgPath={topImgPath} type="result"/>
                                    </div>
                                    <div className="flex-auto">
                                        <MorphCard imgPath={leftImgPath} type="result"/>
                                    </div>
                                    <div className="flex-auto">
                                        <MorphCard imgPath={rightImgPath} type="result"/>
                                    </div>
                                    
                                    
                                </div>
                            </div>

                            <div className="mt-10">
                                <span className="text-2xl font-bold mt-5">교배 추천 개체</span>
                                <p className="mt-2.5">{morphRecommendList}</p>
                            </div>

                            <div className="mt-10">
                                <span className="text-2xl font-bold ">분석 설명</span>
                                <p className="mt-2.5">{explanation}</p>
                            </div>
                        </div>

                        <p className={`mt-4 text-center text-xl ${lineBreedingResultData.recommend_data ? 'hidden' : ''}`}>추천 가능한 개체가 없습니다.</p>

                    </div>

                    <div className="flex justify-center mt-10">
                        <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-1" onClick={handleUpload}>가치판단 결과 보기</button>
                    </div>

                </div>

            </PC>
            <Mobile>
                <div>
                    {/* 로딩바 */}
                    {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main-color"></div>
                    </div>
                    )}

                    <div className="p-4">

                        <h2 className="text-2xl font-bold mt-10">브리딩 추천 결과</h2>
                        <div className={`${lineBreedingResultData.recommend_data ? '' : 'hidden'}`}>
                            <div className="mt-8">
                                <span className="text-xl font-bold ">추천 개체</span>

                                <div className="flex mt-2.5">
                                <div
                                    style={{
                                        display: 'flex',
                                        overflowX: 'auto',
                                    }}
                                    >
                                    <div className="flex-auto">
                                        <MorphCard imgPath={topImgPath} type="result" />
                                    </div>
                                    <div className="flex-auto">
                                        <MorphCard imgPath={leftImgPath} type="result" />
                                    </div>
                                    <div className="flex-auto">
                                        <MorphCard imgPath={rightImgPath} type="result" />
                                    </div>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div className="mt-10">
                                <span className="text-xl font-bold  mt-5">교배 추천 개체</span>
                                <p className="mt-2.5">{morphRecommendList}</p>
                            </div>

                            <div className="mt-10">
                                <span className="text-xl font-bold ">분석 설명</span>
                                <p className="mt-2.5">{explanation}</p>
                            </div>
                        </div>

                        <p className={`mt-4 text-center text-xl ${lineBreedingResultData.recommend_data ? 'hidden' : ''}`}>추천 가능한 개체가 없습니다.</p>
                        
                        <div className="flex justify-center mt-10">
                        <button className="bg-main-color text-white font-bold py-2 px-4 rounded ml-1" onClick={handleUpload}>가치판단 결과 보기</button>
                        </div>
                        
                    </div>
                </div>
            </Mobile>
        </div>
    );
}