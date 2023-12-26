import styled from 'styled-components'
import star from '@/assets/StarIcon.svg'
import like from '@/assets/HeartIcon.svg'
import userImage from '@/assets/userIcon.png'
import { useNavigate } from 'react-router-dom'
import userInfoInLs from '@/utils/userInfoInLs'
import { FontProps } from './CategoryComponent'
import { addFavorite } from '@/api/getLikesData'
import likefill from '@/assets/HeartIconFill.svg'
import { supabase } from '@/utils/supabaseClient'
import useThemeStore from '../store/useThemeStore'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { getProfileImgUrl } from '@/api/profileImgApi'
import { useBookmarkStore } from '@/store/useBookmarkStore'
import { sortReviewDataByDate } from '@/utils/sortReviewDataByDate'
import { ottIcon } from '@/utils/ottIconData'
import defaultOtt from '@/assets/ottIcon/defaultOtt.svg'

interface IsLikedProps {
  id: number
  likes: string[]
}

interface PaddingProps {
  $padding?: string
}

interface TextColorProps {
  $darkMode: boolean
}

type LikeIconProps = {
  $islike?: boolean
  disabled?: boolean
}

/* -------------------------------------------------------------------------- */

function FeedComponent({ reviews }: { reviews: ReviewData[] }) {
  const { $darkMode } = useThemeStore()
  const { bookmarkList, setBookmarkList, deleteBookmarkList } =
    useBookmarkStore()

  const feedContentSectionRef = useRef<HTMLDivElement>(null)

  const [usersId, setUsersId] = useState<string[]>([])
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [myLikesId, setMyLikesId] = useState<number[]>([])
  const [isLikeReviews, setIsLikReviews] = useState<IsLikedProps[] | null>([])
  const [renderProfile, setRenderProfile] = useState<{
    [key: string]: { imgSrc?: string | null }
  }>({})

  const getuserData = userInfoInLs()
  const loginUserId = getuserData.userId

  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  //# 전체 리뷰 가져오기
  useEffect(() => {
    const loadReviewData = async () => {
      try {
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select()

        if (reviewError) {
          throw new Error('Failed to fetch review data')
        }

        // 데이터의 날짜를 최신 순서부터 오래된 순서로 나열합니다.
        const sortedReviewData = sortReviewDataByDate(reviewData)
        // updateReviewData(sortedReviewData);

        // 내가 누른 좋아요
        const myLikes: IsLikedProps[] = sortedReviewData
          .map(item => ({
            id: item.id,
            likes: item.likes
          }))
          .filter(entry => {
            const likesArray = entry.likes || []
            const loginUserIdLiked = likesArray.includes(loginUserId as string)
            return (
              entry.likes !== null &&
              Array.isArray(entry.likes) &&
              loginUserIdLiked
            )
          })

        setIsLikReviews(myLikes)

        const myLikesIdArray = myLikes.map(item => item.id)
        setMyLikesId(myLikesIdArray)

        const usersId = sortedReviewData.map(data => data.user_id)
        setUsersId(usersId)
      } catch (err) {
        console.error(err)
        return null
      }
    }

    loadReviewData()
  }, [isLiked])

  const fetchAndRenderProfileImg = async () => {
    if (loginUserId && usersId.length > 0) {
      try {
        const imgSrc = await Promise.all(
          reviews.map(async item => await getProfileImgUrl(item.user_id))
        )

        const makeObj = imgSrc.map((item, index) => ({
          imgSrc: item,
          userId: usersId[index]
        }))
        setRenderProfile(prevProfile => ({
          ...prevProfile,
          ...makeObj.reduce(
            (acc, { userId, imgSrc }) => ({ ...acc, [userId]: { imgSrc } }),
            {}
          )
        }))
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchAndRenderProfileImg()
  }, [loginUserId, usersId])

  //# 좋아요
  const handleLikes = async (item: ReviewsProps, loginUserId: string) => {
    if (!isAuthenticated) {
      const confirmed = window.confirm(
        '로그인 후 사용 할 수 있습니다. 로그인 페이지로 이동하시겠습니까?'
      )
      if (confirmed) {
        navigate('/login')
      }
      return
    }

    const movieId = item.movie_id
    const userId = item.user_id
    const text = item.text
    const ott = item.ott
    const rating = item.rating
    const title = item.movie_title
    const id = item.id // 리뷰 아이디

    const checkMyLikesId = myLikesId.filter(reviewId => reviewId === id)

    const targetLikes = isLikeReviews
      ?.filter(item => checkMyLikesId.includes(item.id))
      .map(item => item.likes)

    // 2차원 배열을 1차원 배열로 만듭니다
    if (targetLikes) {
      setBookmarkList(targetLikes.flat())
    }

    if (checkMyLikesId.length !== 0 && loginUserId) {
      bookmarkList.filter(item => item !== loginUserId)
      deleteBookmarkList(loginUserId)

      await addFavorite(
        movieId,
        userId,
        text,
        ott,
        rating,
        title,
        id,
        // newBookmarkList,
        loginUserId
      )
    } else {
      const newBookmarkList = [...bookmarkList, loginUserId]
      setBookmarkList(newBookmarkList)

      await addFavorite(
        movieId,
        userId,
        text,
        ott,
        rating,
        title,
        id,
        // newBookmarkList,
        loginUserId
      )
    }

    setIsLiked(prevState => !prevState)
  }

  return (
    <FeedSection>
      <FeedContent ref={feedContentSectionRef}>
        <ContentWrapper>
          {reviews?.map((item: ReviewsProps) => (
            <FeedContentSection key={item.id}>
              <CommonDivWrapper $padding="10px">
                <UserImage
                  src={
                    renderProfile[item.user_id]?.imgSrc
                      ? `https://ufinqahbxsrpjbqmrvti.supabase.co/storage/v1/object/public/userImage/${
                          renderProfile[item.user_id]!.imgSrc
                        }`
                      : userImage
                  }
                  alt="프로필 이미지"
                />
                <TextColor $darkMode={$darkMode}>{item.nickname}</TextColor>
              </CommonDivWrapper>
              <FeedImage
                src={
                  item.img_url
                    ? `https://ufinqahbxsrpjbqmrvti.supabase.co/storage/v1/object/public/movieImage/${item.img_url}`
                    : `https://image.tmdb.org/t/p/original/${item?.default_img?.replace(
                        'public/',
                        ''
                      )}`
                }
                alt={`${item.movie_title} 이미지`}
              />

              <ContentTitleWrapper>
                <ContentTitleSubWrapper>
                  {
                    <OttImg
                      src={
                        ottIcon.ottData.find(
                          iconItem => iconItem.ott === item.ott
                        )?.icon || defaultOtt
                      }
                      alt={`${item.ott} 아이콘`}
                    />
                  }

                  <ContentTitle>{item.movie_title}</ContentTitle>
                </ContentTitleSubWrapper>
                <CommonDivWrapper>
                  {/* <StarIcon /> */}
                  <StarIcon>
                    <StartImg src={star} alt="" />
                  </StarIcon>
                  <span>{item.rating}</span>

                  {loginUserId === item.user_id ? null : (
                    <LikeIcon
                      disabled={loginUserId === item.user_id}
                      onClick={() => handleLikes(item, loginUserId!)}
                      $islike={isLikeReviews?.some(
                        (like: IsLikedProps | null) =>
                          like && like.id === item.id
                      )}
                    >
                      <img src={isLiked ? likefill : like} alt="" />
                    </LikeIcon>
                  )}
                </CommonDivWrapper>
              </ContentTitleWrapper>
              <ContentText $darkMode={$darkMode}>{item.text}</ContentText>
              <CreateDate
                fontSize="12px"
                fontWeight="300"
                $darkMode={$darkMode}
              >
                {item.created_at.substring(0, 10)}
              </CreateDate>
            </FeedContentSection>
          ))}
        </ContentWrapper>
      </FeedContent>
    </FeedSection>
  )
}

export default FeedComponent

const FeedSection = styled.section`
  display: flex;
  flex-flow: column;
  margin-top: 4px;
  overflow-x: hidden;
`

export const StarIcon = styled.button`
  width: 22px;
  height: 22px;
  /* background-image: url(${star}); */
  background-repeat: no-repeat;
  cursor: pointer;
  font-family: GmarketSans;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: inherit;
  align-self: flex-start;
  display: flex;
  padding: 0;
`

const LikeIcon = styled(StarIcon)<LikeIconProps>`
  background-image: ${({ $islike }) =>
    $islike === true ? `url(${likefill})` : `url(${like})`};
`

const CommonDivWrapper = styled.div<PaddingProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding-bottom: ${({ $padding }) => $padding};
  margin: auto 0 auto 0;
`

const UserImage = styled.img`
  height: 36px;
  width: 36px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #dedede;
`
const TextColor = styled.span<TextColorProps>`
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#444444')};
  font-size: 14px;
`
const FeedImage = styled.img`
  width: 420px;
  border: 1px solid #dedede;
  display: block;
  margin: auto;
`
const FeedContent = styled.div`
  display: flex;
  flex-flow: column;
  gap: 4px;
  display: flex;
  align-items: center;
`
const ContentWrapper = styled.div`
  width: 520px;
`

const ContentTitle = styled.span`
  font-weight: bold;
  font-size: 22px;
  margin: auto 0;
  vertical-align: text-bottom;
`
const ContentText = styled.p<TextColorProps>`
  text-align: left;
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#444444')};
  margin: 0;
  font-size: 14px;
`
const ContentTitleWrapper = styled(CommonDivWrapper)`
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;
  align-self: center;
  align-content: center;
`
const CreateDate = styled.span<FontProps>`
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#777777')};

  align-self: flex-start;
  display: flex;
  padding: 0;
  margin-top: 12px;
`
const FeedContentSection = styled.div`
  margin: 12px 0;
  padding: 9.5%;
  border-bottom: 0.5px solid #999999;
`
const OttImg = styled.img`
  width: 30px;
  height: 30px;
  align-self: self-start;
`

const ContentTitleSubWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`
const StartImg = styled.img`
  width: 22px;
  height: 22px;
`
