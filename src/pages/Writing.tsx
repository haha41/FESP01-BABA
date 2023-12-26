import { motion } from 'framer-motion'
import Button from '@/components/Button'
import ottIcons from '@/utils/ottIconImage'
import { useNavigate } from 'react-router-dom'
import userInfoInLs from '@/utils/userInfoInLs'
import StarRating from '@/components/StarRating'
import useThemeStore from '@/store/useThemeStore'
import { ottIconNames } from '@/utils/ottIconImage'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import getSearchMovies from '@/api/getSearchMovies'
import { Icon, Image, Input } from './SearchPage'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { ResultBar, Warppaer } from '@/components/search/SearchResultBar'
import {
  addReview,
  addReviewWithImgUrl,
  uploadFile,
  uploadImage
} from '@/api/reviewApi'
import { getNickname } from '@/api/getReviewData'
import debounce from '@/utils/debounce'
import styled, { keyframes } from 'styled-components'

interface ResultBarContainProps {
  $darkMode: boolean
}

function Writing() {
  const { $darkMode } = useThemeStore()
  const naviagte = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [nickname, setNickname] = useState<string>('')
  const [searchList, setSearchList] = useState<SearchListProps[]>([])
  const [isSearchBtnDisabled, setIsSearchBtnDisabled] = useState(true)
  const [isSearched, setIsSearched] = useState(false) // 검색이 수행되었는지 나타내는 상태
  const [selectMovie, setSelectMovie] = useState<SearchResultProps | null>(null)
  const [isSelectImg, setIsSelectImg] = useState<boolean>(true)
  const [imgSrc, setImgSrc]: any = useState(null)
  const [defaultImg, setDefaultImg] = useState<string | null>('')
  const [image, setImage] = useState<File | null>(null)
  // const [selectedOtt, setSelectedOtt] = useState<string[]>([])
  const [selectedOtt, setSelectedOtt] = useState<string>('')

  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')

  //# 로그인 여부 확인
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      const confirmed = window.confirm(
        '로그인 후 사용 할 수 있습니다. 로그인 페이지로 이동하시겠습니까?'
      )
      if (confirmed) {
        navigate('/login')
      } else {
        window.history.back()
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    const userIdInLs = userInfoInLs()
    setUserEmail(userIdInLs.userId) // local storage의 id = user Table의 email

    const fetchNickname = async () => {
      const nickname = await getNickname(userIdInLs.userId!)
      setNickname(nickname[0].username)
    }
    fetchNickname()
  }, [])

  //# 검색
  // const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.target.value = e.target.value.toLowerCase()
  //   setIsSearchBtnDisabled(e.target.value.length === 0) // input value가 변경될 때마다 검색 버튼의 활성화 상태 갱신
  // }

  // TitleDiv를 클릭했을 때 inputRef로 포커스 이동합니다.
  const handleTitleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSearchBtn = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSearched(true) // 검색 버튼을 클릭하면 검색이 수행되었다고 상태를 갱신

    try {
      const searchData = await getSearchMovies(inputRef.current?.value || '')
      const searchResults = searchData.results.map(
        (result: SearchResultProps) => ({
          id: result.id,
          media_type: result.media_type,
          title: result.title,
          name: result.name,
          poster_path: result.poster_path,
          genre_ids: result?.genre_ids
        })
      )
      setSearchList(searchResults)
      setIsSearched(true)
      setIsSearchBtnDisabled(true)
    } catch (error) {
      console.error(error)
    } finally {
      inputRef.current!.value = '' // 검색 후에는 검색 버튼을 다시 비활성화
    }
  }

  // 기본 이미지 삽입
  const handleSelectMovie = (selectedResult: SearchListProps) => {
    setSelectMovie(selectedResult)
    setSearchList([])
    setIsSearchBtnDisabled(false)
    setDefaultImg(selectedResult?.poster_path)
    setIsSearched(false) // 영화를 선택하면 검색이 완료된 상태를 false로 설정
  }

  //# 이미지 선택
  const handleSelectImg = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleSelectDefaultImg = () => {
    setIsSelectImg(true)
  }

  const handleSelectUserImg = () => {
    setIsSelectImg(false)
  }

  // 이미지 미리보기
  const handleUpload = (e: any) => {
    const file = e.target.files[0]

    setImage(file) // api로 보내려고...
    const reader = new FileReader()
    reader.readAsDataURL(file)

    return new Promise<void>(resolve => {
      reader.onload = () => {
        setImgSrc(reader.result || null)
        resolve()
      }
    })
  }

  const handleDeleteImg = () => {
    const confirmed = window.confirm('이미지를 삭제하시겠습니까?')
    if (confirmed) {
      setImage(null)
      setImgSrc(null)
    }
  }

  //# OTT 선택
  const handleCheck = (iconName: string) => {
    setSelectedOtt(iconName)
  }

  //# 별점
  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleFocus = () => {
    if (text === 'Enter your text here...') {
      setText('')
    }
  }

  const handleBlur = () => {
    if (text === '') {
      setText('Enter your text here...')
    }
  }

  //# 내용 작성
  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value)
    },
    500
  )

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '100px'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  //# 리뷰 등록
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const ottValue = selectedOtt
    const textValue = text === 'Enter your text here...' ? '' : text
    const defaultImgUrl = await uploadFile(defaultImg!)

    if (
      !selectMovie ||
      ottValue.length === 0 ||
      rating === 0 ||
      textValue === ''
    ) {
      alert('제목, ott, 평점, 내용을 작성해주세요')
      return
    }

    try {
      if (selectMovie && !imgSrc) {
        await addReview(
          selectMovie.id,
          userEmail!,
          text,
          selectedOtt,
          rating,
          selectMovie.title || selectMovie.name || 'Unknown Title',
          nickname,
          defaultImgUrl!,
          null,
          selectMovie.genre_ids
        )
      } else if (selectMovie && imgSrc) {
        const imgUrl = await uploadImage(image!)
        await addReviewWithImgUrl(
          selectMovie.id,
          userEmail!,
          text,
          selectedOtt,
          rating,
          selectMovie.title || selectMovie.name || 'Unknown Title',
          imgUrl!,
          nickname,
          defaultImgUrl!,
          selectMovie.genre_ids
        )
      }
      alert('리뷰가 등록되었습니다!😊')
      naviagte('/main')
    } catch (error) {
      console.error(error)
      alert('리뷰 등록에 실패했습니다..😭')
    }
  }

  return (
    <Container>
      <FormStyle encType="multipart/form-data">
        <SearchContainerWrapper>
          <FlexContainer>
            <SearchBarWrapper $isSearchBtnDisabled={isSearchBtnDisabled}>
              <SearchBar>
                <Icon>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Icon>
                <Input
                  type="text"
                  placeholder="리뷰하고싶은 영화를 이곳에서 찾으세요!"
                  // onChange={handleSearchInput}
                  ref={inputRef}
                />
              </SearchBar>
              <Btn onClick={handleSearchBtn}>검색</Btn>
            </SearchBarWrapper>

            <ResultWrapper
              $isSearched={isSearched}
              $isSearchBtnDisabled={isSearchBtnDisabled}
            >
              <SearchContainer>
                {searchList.map(result => (
                  <ResultBarContain
                    key={result.id}
                    onClick={() => handleSelectMovie(result)}
                    $darkMode={$darkMode}
                  >
                    <Contain>
                      <Image
                        src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
                        alt={`${result.title} 이미지`}
                      />
                      <Warppaer>
                        <ResultBar>
                          {result.media_type === 'movie' ? '영화' : 'TV'} -{' '}
                          {result.media_type === 'movie'
                            ? result.title
                            : result.name}
                        </ResultBar>
                      </Warppaer>
                    </Contain>
                  </ResultBarContain>
                ))}
              </SearchContainer>
            </ResultWrapper>
          </FlexContainer>
        </SearchContainerWrapper>

        <WebContainer>
          <ImageBox>
            <BtnWrapper onClick={handleSelectImg}>
              <ImgSelectBtn
                color={isSelectImg ? '#3797EF' : ''}
                $hasBorder
                onClick={handleSelectDefaultImg}
              >
                기본 이미지
              </ImgSelectBtn>
              <ImgSelectBtn
                color={isSelectImg ? '' : '#3797EF'}
                onClick={handleSelectUserImg}
              >
                사용자 이미지
              </ImgSelectBtn>
            </BtnWrapper>
            <OriginalImage>
              {selectMovie && isSelectImg ? (
                <MoviePoster
                  src={`https://image.tmdb.org/t/p/original/${selectMovie.poster_path}`}
                  alt={`${selectMovie.title || selectMovie.name} 포스터`}
                />
              ) : (
                <>
                  {imgSrc ? ( // 사용자가 이미지를 업로드한 경우
                    <MoviePoster
                      src={imgSrc}
                      alt={`${
                        selectMovie?.title || selectMovie?.name
                      } 관련 이미지`}
                      onClick={handleDeleteImg}
                    />
                  ) : (
                    // 사용자가 이미지를 업로드하지 않았거나 selectMovie가 없는 경우
                    <PlzSelectImgDiv>
                      <FontAwesomeIcon icon={faImage} />
                    </PlzSelectImgDiv>
                  )}
                  {!isSelectImg && (
                    <div>
                      <label htmlFor="photo">사진</label>
                      <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        name="photo"
                        id="photo"
                        onChange={handleUpload}
                      />
                    </div>
                  )}
                </>
              )}
            </OriginalImage>
          </ImageBox>

          <Description>
            <TitleDiv onClick={handleTitleClick}>
              {!selectMovie && `컨텐츠의 제목을 검색해주세요 🔎`}
              {(selectMovie && selectMovie.title) || selectMovie?.name}
            </TitleDiv>

            <OttTitle>시청하신 OTT를 선택해주세요 🙋‍♂️</OttTitle>
            <Wrapper>
              {ottIcons.map((icon, index) => (
                <OttWrapper key={index}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Style>
                      <OttIcon
                        src={icon}
                        alt={ottIconNames[index]}
                        title={ottIconNames[index]}
                        $isSelected={selectedOtt.includes(ottIconNames[index])}
                        onClick={() => handleCheck(ottIconNames[index])}
                      />
                    </Style>
                    <OttLabel htmlFor={`ott${index}`}></OttLabel>
                    <OttInput
                      type="checkbox"
                      name={`ott${index}`}
                      id={`ott${index}`}
                      checked={selectedOtt.includes(ottIconNames[index])}
                      readOnly
                      // onChange={() => handleCheck(ottIconNames[index])}
                    />
                  </motion.div>
                </OttWrapper>
              ))}
            </Wrapper>

            <StarContainer>
              <p>이 컨텐츠의 점수를 표시해주세요! ⭐️</p>
              <StarRating onRatingChange={handleRatingChange} />
            </StarContainer>

            <FeedText
              ref={textareaRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="이 컨텐츠에 대한 생각을 자유롭게 공유해보세요!🎬✨"
              onChange={handleInputChange}
            ></FeedText>

            <Button
              $bgcolor={'#3797EF'}
              text={'작성하기'}
              type={'submit'}
              color={'white'}
              onClick={handleSubmit}
            />
          </Description>
        </WebContainer>
      </FormStyle>
    </Container>
  )
}

export default Writing

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  margin-bottom: 80px;
  @media (max-width: 700px) {
    width: 98%;
  }
`

const FormStyle = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* gap: 20px; */
  /* width: 90%; */

  @media (min-width: 701px) {
    width: 70%;
  }

  @media (min-width: 1031px) {
    justify-content: space-between;
  }

  @media (max-width: 700px) {
    width: 100%;
  }
`

const ImageBox = styled.div`
  width: 100%;
  margin: 0 auto;

  img {
    width: 100%;
    object-fit: cover;
  }

  @media (max-width: 450px) {
    width: 90%;
  }
`

const SearchBarWrapper = styled.div<{ $isSearchBtnDisabled: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* height: 100%; */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: ${props =>
    props.$isSearchBtnDisabled ? '8px' : 'none'};
  border-bottom-right-radius: ${props =>
    props.$isSearchBtnDisabled ? '8px' : 'none'};
  background-color: #e8e8e8;

  @media (min-width: 701px) {
    flex-direction: row;
  }
`

const WebContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;

  @media (max-width: 700px) {
    width: 80%;
  }
`

const ResultBarContain = styled.div<ResultBarContainProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 95%; /* Adjust width for better responsiveness */
  padding: 0 5px; /* Adjust padding for better responsiveness */
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ $darkMode }) => ($darkMode ? '#28C7C7' : '#fffc9f')};
  }
`

const SearchBar = styled.div`
  display: flex;

  align-items: center;
  height: 30px;
  padding: 10px;

  border-radius: 8px;
  width: 86%;
`

const ResultWrapper = styled.div<{
  $isSearched: boolean
  $isSearchBtnDisabled: boolean
}>`
  width: 100%;
  position: absolute;
  z-index: 101;
  top: 50px;
`

const Contain = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;

  @media (max-width: 390px) {
    margin: 0 -5px; /* Adjust margin for smaller screens */
  }
`

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 20px;
`

const OttWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* Change width to a percentage */
  height: 40%;
  flex: 1;
  margin: 10px 8px;
`

const OttLabel = styled.label``

const OttInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
  cursor: pointer;
  pointer-events: none;
`

const Style = styled.div`
  width: 60px;
  height: 60px;
`

const OttIcon = styled.img<{ $isSelected: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  border: ${({ $isSelected }) => ($isSelected ? '2px solid #3797EF' : 'none')};

  &:hover {
    transform: scale(1.1);
  }
`

const TitleDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 100%;
  height: 80px;
  font-size: 28px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 10px;

  @media (min-width: 1031px) {
    font-size: 23px;
  }
`

const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`

const ImgSelectBtn = styled.button<{ $hasBorder?: boolean; color?: string }>`
  flex: 1;
  height: 44px;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: ${({ color }) => color || 'white'};
  transition: background-color 0.3s ease-in-out;

  &:first-child {
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-top-right-radius: 8px;
  }

  &.selected {
    background-color: ${({ color }) => color || 'white'};
    cursor: default;
  }

  &:not(.selected):hover {
    background-color: #fffc9f;
    color: black;
  }
`

const OriginalImage = styled.div`
  width: 100%;
  height: 980px;
  background-color: #d9d9d9;
  position: relative;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 1262px) {
    height: 600px;
  }
`

const MoviePoster = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const PlzSelectImgDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
`

const StarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  font-size: 18px;
`

const FeedText = styled.textarea`
  width: 99%;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease-in-out;
  resize: none;
  margin-bottom: 30px;

  &:hover {
    border-color: #3797ef;
  }

  &:focus {
    outline: none;
    border-color: #2674c6;
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Btn = styled.button`
  width: 100%;
  max-width: 200px; // Set a maximum width for the button
  height: 46px;
  border-radius: 8px;
  background-color: #3797ef;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #2674c6;
  }

  &:disabled {
    background-color: #d3d3d3;
    color: #a1a1a1;
    cursor: not-allowed;
  }

  animation: ${fadeIn} 0.5s ease-in-out;
`

const OttTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  align-self: start;
`

const SearchContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;

  background-color: #e8e8e8;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 1;
  flex: 1;
`

const SearchContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  @media (max-width: 700px) {
    width: 78%;
  }
  @media (max-width: 450px) {
    width: 70%;
  }
`

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
`
