import styled from 'styled-components'
import star from '@/assets/StarIcon.svg'
import like from '@/assets/HeartIcon.svg'
import likefill from '@/assets/HeartIconFill.svg'
import useThemeStore from '../store/useThemeStore'
import { FontProps } from './CategoryComponent'
import { createClient } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addFavorite,
  addLike,
  deleteLikes,
  getLikes,
  getMyLikes,
  matchLike
} from '@/api/getLikesData'
import { useBookmarkStore } from '@/store/useBookmarkStore'
import userInfoInLs from '@/utils/userInfoInLs'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { getProfileImgUrl } from '@/api/profileImgApi'
import userImage from '@/assets/userIcon.png'

const supabase = createClient(
  `${import.meta.env.VITE_SUPABASE_URL}`,
  `${import.meta.env.VITE_SUPABASE_KEY}`
)

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

function FeedComponent() {
  const { $darkMode } = useThemeStore()
  const [reviews, setReviews] = useState<ReviewsProps[]>([])
  const [reviewsId, setReviewsId] = useState<string[]>([])
  const [reviewId, setReviewId] = useState<number>()
  const [usersId, setUsersId] = useState<string[]>([])
  const [isDisabledLikeBtn, setIsDisabledLikeBtn] = useState<boolean>(false) // true는 본인
  const [isLiked, setIsLiked] = useState<boolean>(false)
  console.log('isLiked: ', isLiked)

  const [isLikeReviews, setIsLikReviews] = useState<IsLikedProps[] | null>([])
  const [myLikesId, setMyLikesId] = useState<number[]>([])

  const [likesReview, setLikesReview] = useState<Record<number, boolean>>({})
  const { bookmarkList, setBookmarkList, deleteBookmarkList } =
    useBookmarkStore()
  const [renderProfileImg, setRenderProfileImg] = useState<(string | null)[]>(
    []
  )

  // console.log('reviews: ', reviews)
  // console.log('reviewId: ', reviewId)
  console.log('bookmarkList: ', bookmarkList)
  console.log('likesReview: ', likesReview)

  const getuserData = userInfoInLs()
  const loginUserId = getuserData.userId

  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  const queryClient = useQueryClient()
  const queryKey = ['user_id', reviewId]

  const { data: likeItems } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const result = await matchLike(loginUserId)
      return result
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  //# 전체 리뷰 가져오기
  useEffect(() => {
    const loadReviewData = async () => {
      try {
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select()

        if (reviewError) throw new Error()

        const sortedReviewData = reviewData.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setReviews(sortedReviewData)
        // console.log('sortedReviewData: ', sortedReviewData)

        // 내가 누른 좋아요
        const myLikes: IsLikedProps[] = sortedReviewData
          .map(item => ({
            id: item.id,
            likes: item.likes
          }))
          .filter(entry => {
            const likesArray = entry.likes || []
            const loginUserIdLiked = likesArray.includes(loginUserId)
            return (
              entry.likes !== null &&
              Array.isArray(entry.likes) &&
              loginUserIdLiked
            )
          })
        setIsLikReviews(myLikes)
        // console.log('myLikes: ', myLikes)

        const myLikesIdArray = myLikes.map(item => item.id)
        setMyLikesId(myLikesIdArray)
        // console.log('myLikesIdArray: ', myLikesIdArray)

        const reviewsId = sortedReviewData.map(item => item.user_id)
        setReviewsId(reviewsId)

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
          usersId.map(async userId => await getProfileImgUrl(userId))
        )
        setRenderProfileImg(imgSrc)
        // setRenderProfileImg(imgSrc as (string | null)[])
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchAndRenderProfileImg()
  }, [loginUserId, usersId])

  // useEffect(() => {
  //   const likeItemReviewId = likeItems?.map(item => item.review_id)

  //   if (likeItemReviewId) {
  //     setBookmarkList(likeItemReviewId)
  //   }
  // }, [likeItems])

  // const handleLikes = async (item: LikeData, itemId: number) => {
  //   if (!isAuthenticated) {
  //     const confirmed = window.confirm(
  //       '로그인 후 사용 할 수 있습니다. 로그인 페이지로 이동하시겠습니까?'
  //     )
  //     if (confirmed) {
  //       navigate('/login')
  //     }
  //     return
  //   }
  //   if (itemId) {
  //     const newLikes: LikesType = {
  //       user_id: loginUserId,
  //       review_id: itemId
  //     }
  //     setReviewId(itemId)

  //     const updatedLikesReview = {
  //       ...likesReview,
  //       [itemId]: !(likesReview[itemId] ?? false)
  //     }

  //     setLikesReview(updatedLikesReview)
  //     const hasReviewId = likeItems?.some(
  //       likeItem => likeItem.review_id === itemId
  //     )

  //     try {
  //       if (hasReviewId) {
  //         await deleteLikes(itemId)
  //       } else {
  //         await addLike(newLikes, itemId)
  //       }
  //       queryClient.invalidateQueries({ queryKey: ['user_id', reviewId] })

  //       setLikesReview(prev => ({ ...prev, [itemId]: !hasReviewId }))
  //     } catch (error) {
  //       setLikesReview(prev => ({ ...prev, [itemId]: !prev[itemId] }))
  //       console.error('북마크 에러 발생:', error)
  //     }
  //   }
  // }

  //# 좋아요
  const handleLikes = async (
    event: React.MouseEvent,
    item: ReviewsProps,
    loginUserId: string
  ) => {
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
    const id = item.id
    // console.log('item: ', item)

    const checkMyLikesId = myLikesId.filter(reviewId => reviewId === id)
    // console.log('checkMyLikesId', checkMyLikesId)

    if (checkMyLikesId.length !== 0 && loginUserId) {
      const newBookmarkList = bookmarkList.filter(item => item !== loginUserId)
      deleteBookmarkList(loginUserId)

      console.log('중복: ', newBookmarkList)

      await addFavorite(
        movieId,
        userId,
        text,
        ott,
        rating,
        title,
        id,
        newBookmarkList
      )
    } else {
      const newBookmarkList = [...bookmarkList, loginUserId]
      setBookmarkList(newBookmarkList)

      console.log('중복아님', newBookmarkList)

      await addFavorite(
        movieId,
        userId,
        text,
        ott,
        rating,
        title,
        id,
        newBookmarkList,
        loginUserId
      )
    }

    setIsLiked(prevState => !prevState)
  }

  return (
    <FeedSection>
      <FeedContent>
        <ContentWrapper>
          {reviews?.map((item: ReviewsProps, index: number) => (
            <FeedContentSection key={item.id}>
              <CommonDivWrapper $padding="10px">
                <UserImage
                  src={
                    renderProfileImg[index]
                      ? `https://ufinqahbxsrpjbqmrvti.supabase.co/storage/v1/object/public/userImage/${renderProfileImg[index]}`
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
                <ContentTitle>{item.movie_title}</ContentTitle>
                <CommonDivWrapper>
                  <StarIcon />
                  <span>{item.rating}</span>
                  <LikeIcon
                    disabled={loginUserId === item.user_id}
                    onClick={event => handleLikes(event, item, loginUserId!)}
                    $islike={isLikeReviews?.some(
                      (like: IsLikedProps | null) => like && like.id === item.id
                    )}
                  />
                </CommonDivWrapper>
              </ContentTitleWrapper>
              <ContentText $darkMode={$darkMode}>{item.text}</ContentText>
              <Button fontSize="12px" fontWeight="300" $darkMode={$darkMode}>
                더보기
              </Button>
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
  margin-top: 26px;
`

export const StarIcon = styled.button`
  width: 22px;
  height: 22px;
  background-image: url(${star});
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
  border: 1px solid black;
`
const TextColor = styled.span<TextColorProps>`
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#444444')};
  font-size: 14px;
`
const FeedImage = styled.img`
  width: 310px;
  border: 1px solid black;
  display: block;
`
const FeedContent = styled.div`
  display: flex;
  flex-flow: column;
  gap: 4px;
  display: flex;
  align-items: center;
`
const ContentWrapper = styled.div`
  width: 19.375rem;
`

const ContentTitle = styled.span`
  font-weight: bold;
  font-size: 20px;
`
const ContentText = styled.p<TextColorProps>`
  text-align: left;
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#444444')};
  margin: 0;
  font-size: 12px;
`
const ContentTitleWrapper = styled(CommonDivWrapper)`
  justify-content: space-between;
  margin: 10px 0;
  align-items: center;
  align-self: center;
  align-content: center;
`
const Button = styled.button<FontProps>`
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: inherit;
  cursor: pointer;
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
  padding: 10px 0;
`
