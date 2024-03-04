import { MovieInfo } from '@/types'
import { runtime } from '@/utils/runtime'
import { yearCalc } from '@/utils/yearCalc'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTrailer } from '@/api/getTrailer'
import GoingUpBtn from '@/components/GoingUpBtn'
import useThemeStore from '@/store/useThemeStore'
import Iframe from '@/components/movieInfo/Iframe'
import { getMovieCrew } from '@/api/tmdbDetailData'
import DetailReview from '@/components/DetailReview'
import CastInfo from '@/components/movieInfo/CastInfo'
import styled, { ThemeProvider } from 'styled-components'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getDetailData } from '@/api/tmdbDetailData'
import { getReviewDataWithUserInfo, getTheReviews } from '@/api/getReviewData'
// import { getReviewData, getReviewDataWithUserInfo } from '@/api/getReviewData'

function MovieInfo() {
  const { id: movieID } = useParams()

  const { $darkMode } = useThemeStore()

  const [reviewData, setReviewData] = useState<any[] | null>(null)
  // console.log('reviewData: ', reviewData)

  const [nicknames, setNicknames] = useState<any[] | null | undefined>(null)
  const [movieinfoData, setMovieInfoData] = useState<MovieInfo | null>(null)

  // const [, setMovieCreditData] = useState<string | undefined>('')
  // const [, setIsLoading] = useState<boolean>(false)

  const [showMore, setShowMore] = useState(false)
  const [castData, setCastData] = useState<any[] | undefined>()
  const [trailers, setTrailers] = useState<any[] | null>([])

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  useEffect(() => {
    const getMovieInfoData = async () => {
      try {
        const response = await getDetailData(movieID as string)
        // const director = await findMovieDirector(movieID as string)

        if (response) {
          const data = response.data
          setMovieInfoData(data)
          // setMovieCreditData(director)

          const trailerData = await getTrailer(`${data.title} 예고편`)
          setTrailers(trailerData)
        }
      } catch (error) {
        console.error(
          `상세정보 데이터를 가져오는데 실패하였습니다...🥲: ${error}`
        )
      }
    }

    getMovieInfoData()
  }, [movieID])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true)
        // const data = await getReviewData()
        const data = await getTheReviews(movieID!)
        const nicknameData = await getReviewDataWithUserInfo()

        if (data) {
          setReviewData(data)
          setNicknames(nicknameData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        // setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMovieCrew(movieID as string)

        setCastData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [movieID])

  // 감독정보 & 로딩구현

  // cross-origin issue in Iframe
  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      const {} = event
      // const { data } = event
      // console.log('Received message in MovieInfo:', data)
    }

    window.addEventListener('message', receiveMessage)

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [])

  return (
    <ThemeProvider
      theme={{
        bgColor: $darkMode ? '#1E1E1E' : '#FFF',
        color: $darkMode ? '#fff' : '#1E1E1E'
      }}
    >
      {movieinfoData && (
        <Container>
          <Wrapper>
            <Img
              src={`https://image.tmdb.org/t/p/original${movieinfoData?.poster_path}`}
              alt={movieinfoData?.title}
            />
            <GradientOverlay />
            <InfoContainer>
              <Title>{movieinfoData?.title}</Title>
              <InfoWrapper>
                <Average>
                  <span>평균</span> ·
                  <Star>
                    <FontAwesomeIcon
                      icon={faStar}
                      style={{ color: '#FFC61A' }}
                    />
                    {Math.floor(movieinfoData?.vote_average as number)}
                  </Star>
                </Average>
                <Description>
                  <span>{yearCalc(movieinfoData?.release_date)}</span> ·{' '}
                  <span>{runtime(movieinfoData?.runtime)}</span> ·{' '}
                  <span>코미디</span> · <span>로맨스</span>
                </Description>
              </InfoWrapper>

              <OverviewWrapper>
                {showMore
                  ? movieinfoData?.overview
                  : `${movieinfoData?.overview.slice(0, 100)}...`}
              </OverviewWrapper>

              <MoreButton onClick={toggleShowMore}>더 보기</MoreButton>
            </InfoContainer>
          </Wrapper>
          <RelatedVideos>
            <h3>관련 영상</h3>
            {trailers?.map(item => (
              <Iframe key={item.id.videoId} videoId={item.id.videoId} />
            ))}
          </RelatedVideos>
          <CastAndCrew>
            <h3>감독 및 출연</h3>
            {castData?.map(info => (
              <CastInfo
                key={info.id}
                profile={info.profile_path}
                name={info.name}
                character={info.character}
              />
            ))}
          </CastAndCrew>
          <ReviewWrapper>
            <TitleWrapper>
              <h3>BABA 사용자 평</h3>
              <span>{reviewData?.length}</span>
            </TitleWrapper>
            {reviewData?.map((reviewItem, index) => {
              const matchingNicknames = nicknames
                ?.filter(n => n.user_email === reviewItem.user_id)
                .map(n => n.nickname)

              return (
                <DetailReview
                  key={`${reviewItem.user_id}-${index}`}
                  userId={reviewItem.user_id}
                  nickname={matchingNicknames?.[0] || 'Default Nickname'}
                  rating={reviewItem.rating}
                  text={reviewItem.text}
                />
              )
            })}
          </ReviewWrapper>
          <GoingUpBtn />
        </Container>
      )}
    </ThemeProvider>
  )
}

export default MovieInfo

const Container = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  margin: 0 10px;
  margin-top: 40px;
  position: relative;
`

const Wrapper = styled.div`
  position: relative;
  height: 550px;
  width: 86%;
  display: flex;

  @media (max-width: 700px) {
    flex-direction: column;
    height: 100%;
  }
`

const Title = styled.h2`
  font-size: 34px;
`

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(
    to top,
    rgb(255, 255, 255) 26%,
    rgba(255, 255, 255, 0.7) 30%,
    rgba(255, 255, 255, 0.45) 40%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(0, 0, 0, 0) 100%
  ); */
  pointer-events: none;
  z-index: 1;

  @media (min-width: 701px) {
    /* background: linear-gradient(
      to left,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1)
    ); */
    /* background: linear-gradient(
      to right,
      rgb(255, 255, 255) 5%,
      rgba(255, 255, 255, 0.7) 30%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.2) 80%,
      rgba(0, 0, 0, 0) 100%
    ); */
  }
`

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  z-index: 0;

  @media (min-width: 701px) {
    order: 2;
    flex: 1; /* 데스크탑에서는 Img가 남은 공간을 모두 차지하도록 조절 */
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`

const InfoContainer = styled.section`
  position: relative;
  z-index: 2;
  padding: 20px;
  background-color: ${props => props.theme.bgColor};

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #2c2c2c;

  margin-top: -60px; /* 이미지와 겹치도록 조절 */

  @media (max-width: 700px) {
    border-radius: 10px;
  }

  @media (min-width: 701px) {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    order: 1;
    margin-top: 0; /* 데스크탑에서는 margin-top 조절이 필요 없음 */
    flex: 2; /* 데스크탑에서는 InfoContainer가 Img보다 두 배의 너비를 갖도록 조절 */
  }
`

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RelatedVideos = styled.div`
  margin: 20px 0;
`

const CastAndCrew = styled.div`
  margin-top: 20px;

  @media (min-width: 1030px) {
    display: none;
  }
`

const MoreButton = styled.button`
  background-color: #0070f3;

  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
`

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
`

const OverviewWrapper = styled.p`
  width: 75%;
  font-size: 18px;
  line-height: 1.5;
  margin-top: 20px;
  color: ${props => props.theme.color};
`

const Average = styled.div`
  display: flex;
  gap: 8px;
  margin: 5px 0;

  @media (min-width: 1120px) {
    font-size: 20px;
    font-weight: 600;
  }
`

const Description = styled.div`
  display: flex;
  gap: 8px;
  margin: 5px 0;

  @media (min-width: 1120px) {
    font-size: 18px;
    font-weight: 500;
  }
`

const Star = styled.div`
  display: flex;
  gap: 5px;
`
