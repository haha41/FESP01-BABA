import styled from 'styled-components'
import FeedComponent from '@/components/FeedComponent'
import CategoryComponent from '@/components/CategoryComponent'
import RecommendContentsSection from '@/layout/RecommendContentsSection'
import { useEffect, useState } from 'react'
import { useGenresStore } from '@/store/useGenresStore'
import { getGenreReviewData, getReviewData } from '@/api/getReviewData'
import GoingUpBtn from '@/components/GoingUpBtn'

function Main() {
  const [, setWindowWidth] = useState(window.innerWidth)
  const { movieGenresState, tvGenresState } = useGenresStore()
  const movieGenresStateId = movieGenresState[0]?.id
  const tvGenresStateId = tvGenresState[0]?.id
  const [reviews, setReviews] = useState<ReviewData[]>([])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const loadReviewData = async () => {
      try {
        let reviewData: ReviewData[] = []
        if (movieGenresStateId) {
          const genreReviewData = await getGenreReviewData(movieGenresStateId)

          if (!genreReviewData) {
            throw new Error('해당 카테고리의 리뷰가 없습니다.')
          }

          reviewData = genreReviewData
        } else if (tvGenresStateId) {
          const genreReviewData = await getGenreReviewData(tvGenresStateId)

          if (!genreReviewData) {
            throw new Error('해당 카테고리의 리뷰가 없습니다.')
          }

          reviewData = genreReviewData
        } else if (
          movieGenresStateId === undefined &&
          tvGenresStateId === undefined
        ) {
          const getAllReviewData = await getReviewData()
          if (!getAllReviewData) {
            throw new Error('리뷰 데이터를 불러올 수 없습니다.')
          }

          reviewData = getAllReviewData
        }

        setReviews(reviewData)
      } catch (err) {
        console.error('데이터 불러오기 실패')
        return null
      }
    }

    loadReviewData()

    window.scrollTo(0, 0)
  }, [movieGenresState, tvGenresState])

  return (
    <>
      <MainPageTitle aria-label="메인페이지">메인 페이지</MainPageTitle>
      <Wrapper>
        <CategoryComponent />
        {window.innerWidth < 1030 ? <RecommendContentsSection /> : ''}

        {(movieGenresStateId === undefined && tvGenresStateId === undefined) ||
        reviews.length > 0 ? (
          <FeedComponent reviews={reviews} />
        ) : (
          <NoDataNotice>
            선택한 카테고리에 해당하는 리뷰가 없습니다.😢
          </NoDataNotice>
        )}
      </Wrapper>
      <GoingUpBtn />
    </>
  )
}

export default Main

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow: hidden;
`

const MainPageTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`
const NoDataNotice = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
`
