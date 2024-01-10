import styled from 'styled-components'
import useThemeStore from '../store/useThemeStore'
import {
  SwiperSlideWrapper,
  SwiperWrapper
} from '@/components/CategoryComponent'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import starIcon from '@/assets/StarIcon.svg'
import { usePopularDataStore } from '@/store/usePopularDataStore'
import { Link } from 'react-router-dom'

interface SectionHeaderWidth {
  width?: string
  $darkMode: boolean
}

function RecommendContentsSection() {
  const { populardata } = usePopularDataStore()

  const { $darkMode } = useThemeStore()

  function ratingStar(value: number) {
    const roundedValue = (Math.round(value * 2) / 2).toFixed(1)

    if (roundedValue.endsWith('.5') && value % 1 < 0.5) {
      return Math.floor(value).toString()
    }

    return roundedValue
  }

  return (
    <SectionWrapper>
      <SectionHeader width="32px" $darkMode={$darkMode}>
        추천
      </SectionHeader>
      <SwiperWrapper
        slidesPerView={5}
        spaceBetween={2}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          type: 'progressbar'
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 3.5,
            spaceBetween: 0
          },
          520: {
            slidesPerView: 6
          },
          768: {
            slidesPerView: 7
          },
          1020: {
            slidesPerView: 8
          },
          1280: {
            slidesPerView: 10
          }
        }}
      >
        {populardata?.results.map(item => (
          <SwiperSlideWrapper key={item.id}>
            <HoverWrapper to={`/info/${item.id}`}>
              <RecommendImage
                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                alt={`${item.title} 포스터`}
              />
              <RecommendContent>
                <RecommendItem>{item.title}</RecommendItem>
                <RecommendItem color="#FFC61A">
                  <StarIcon src={starIcon} alt="평점" />
                  {ratingStar(item.vote_average)}
                </RecommendItem>
              </RecommendContent>
            </HoverWrapper>
          </SwiperSlideWrapper>
        ))}
      </SwiperWrapper>
    </SectionWrapper>
  )
}

export default RecommendContentsSection

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  @media (min-width: 1280px) and (max-width: 1920px) {
    max-width: 720px;
    min-width: 610px;
    width: 100%;
  }
  @media (min-width: 1025px) and (max-width: 1279px) {
    max-width: 610px;
    min-width: 580px;
    width: 100%;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 680px;
    width: 100%;
    min-width: 620px;
  }
  @media (min-width: 520px) and (max-width: 767px) {
    max-width: 520px;
    width: 100%;
  }
  @media (min-width: 320px) and (max-width: 519px) {
    max-width: 320px;
    width: 100%;
  }
`

const SectionHeader = styled.h2<SectionHeaderWidth>`
  font-size: 16px;
  margin: 0;
  height: 30px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;

  &:after {
    content: '';
    display: block;
    width: ${({ width }) => width};
    border-bottom: 5px solid #303032;
    border-color: ${({ $darkMode }) => ($darkMode ? '#FFFFFF' : '#303032')};
  }
`

const RecommendItem = styled.span`
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: ${({ color }) => (color ? color : '#FFFFFF')};
`

const RecommendContent = styled.div`
  width: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  word-break: keep-all;
  text-align: center;
  visibility: hidden;
  display: flex;
  flex-direction: column;
`
const HoverWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  &:hover {
    > img {
      filter: saturate(0%) brightness(40%);
      transition: 0.5s;
    }
    > div {
      color: white;
      visibility: visible;
    }
  }
`

export const RecommendImage = styled.img`
  width: 80px;
  height: 120px;
  border-radius: 5px;
  margin-left: 4px;
  margin-right: 4px;
  position: relative;
`
const StarIcon = styled.img`
  width: 16px;
  height: 16px;
`
