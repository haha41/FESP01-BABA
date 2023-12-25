import styled from 'styled-components'
import useThemeStore from '../store/useThemeStore'
import { SelectHTMLAttributes, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { movieGenres, tvGenres } from '@/utils/genresData'
import { useGenresStore } from '@/store/useGenresStore'
import { motion } from 'framer-motion'

export interface FontProps {
  fontSize?: string
  fontWeight?: string
  $darkMode?: boolean
}

interface SizeProps {
  size?: string
  $darkMode: boolean
}

export interface DarkModeSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  $darkMode?: boolean
}

const movieCategories = [
  { color: '#8ee7e7', text: '전체' },
  { color: '#F56A1E', text: '액션' },
  { color: '#FFE100', text: '모험' },
  { color: '#3FD6A6', text: '애니메이션', fontSize: '11px' },
  { color: '#FF99AF', text: '코미디' },
  { color: '#DF461F', text: '범죄' },
  { color: '#496BF2', text: '다큐' },
  { color: '#77B1B9', text: '드라마' },
  { color: '#CEE319', text: '가족' },
  { color: '#69A7E7', text: '판타지' },
  { color: '#7B5F48', text: '역사' },
  { color: '#AD2625', text: '공포' },
  { color: '#A28CB7', text: '음악' },
  { color: '#177649', text: '미스터리' },
  { color: '#F4D6D4', text: '로맨스' },
  { color: '#513582', text: 'SF' },
  { color: '#F5E2A7', text: 'TV 영화', fontSize: '11px' },
  { color: '#F03F36', text: '스릴러' },
  { color: '#015097', text: '전쟁' },
  { color: '#857b15', text: '서부' }
]
const dramaCategories = [
  { color: '#8ee7e7', text: '전체' },
  { color: '#F56A1E', text: '액션&어드벤쳐', fontSize: '11px' },
  { color: '#3FD6A6', text: '애니메이션', fontSize: '12px' },
  { color: '#FF99AF', text: '코미디' },
  { color: '#DF461F', text: '범죄' },
  { color: '#496BF2', text: '다큐' },
  { color: '#77B1B9', text: '드라마' },
  { color: '#CEE319', text: '가족' },
  { color: '#69A7E7', text: '키즈' },
  { color: '#177649', text: '미스터리' },
  { color: '#F4D6D4', text: '뉴스' },
  { color: '#513582', text: '리얼리티' },
  { color: '#F5E2A7', text: '판타지' },
  { color: '#F03F36', text: '오페라' },
  { color: '#015097', text: '토크' },
  { color: '#015097', text: '전쟁&정치' },
  { color: '#857b15', text: '서부' }
]

function CategoryComponent() {
  const { $darkMode } = useThemeStore()
  const [selectCategory, setSelectCategory] = useState('영화')
  const { movieGenresState, setMovieGenresState } = useGenresStore()
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const select = e.currentTarget.value

    setSelectCategory(select)
  }

  const handleFilterCategory = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const selectCategoryButton = e.currentTarget.nextElementSibling?.textContent

    if (selectCategory === '영화') {
      const filterCategory = movieGenres.genres.filter(
        item => item.name === selectCategoryButton
      )

      setMovieGenresState(filterCategory)
    } else {
      const filterCategory = tvGenres.genres.filter(
        item => item.name === selectCategoryButton
      )

      setMovieGenresState(filterCategory)
    }
  }

  useEffect(() => {}, [movieGenresState])

  return (
    <CategorySection>
      <CategoryTitle>
        <SectionHeader size="62px" $darkMode={$darkMode}>
          카테고리
        </SectionHeader>
        <form action="#">
          <label htmlFor="영화/드라마" aria-label="선택하세요"></label>
          <SelectLabel
            $darkMode={$darkMode}
            name="languages"
            id="영화/드라마"
            onChange={handleChange}
          >
            <option value="영화">영화</option>
            <option value="드라마">드라마</option>
          </SelectLabel>
        </form>
      </CategoryTitle>
      <SwiperWrapper
        scrollbar={{
          hide: true
        }}
        slidesPerView={5}
        spaceBetween={2}
        modules={[Pagination, Scrollbar]}
        className="mySwiper"
        breakpoints={{
          520: {
            slidesPerView: 6,
            spaceBetween: 0
          },
          768: {
            slidesPerView: 9,
            spaceBetween: 0
          },
          1020: {
            slidesPerView: 8,
            spaceBetween: 0
          },
          1280: {
            slidesPerView: 10,
            spaceBetween: 0
          }
        }}
      >
        {selectCategory === '영화'
          ? movieCategories.map(({ color, text, fontSize }, index) => (
              <SwiperSlideWrapper key={index} style={{ width: 'auto' }}>
                <CategoryWrapper>
                  <motion.button
                    whileHover={{
                      rotate: [0, 360],
                      transition: {
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0
                      }
                    }}
                    initial={{ rotate: 360 }}
                    animate={{ rotate: 360 }}
                    style={{
                      boxSizing: 'border-box',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'inherit',
                      cursor: 'pointer'
                    }}
                    onClick={handleFilterCategory}
                  >
                    <CategoryCircle color={color}></CategoryCircle>
                  </motion.button>
                  <CategroyList fontSize={fontSize} $darkMode={$darkMode}>
                    {text}
                  </CategroyList>
                </CategoryWrapper>
              </SwiperSlideWrapper>
            ))
          : dramaCategories.map(({ color, text, fontSize }, index) => (
              <SwiperSlideWrapper key={index} style={{ width: 'auto' }}>
                <CategoryButton onClick={handleFilterCategory}>
                  <CategoryCircle color={color}></CategoryCircle>
                  <CategroyList fontSize={fontSize} $darkMode={$darkMode}>
                    {text}
                  </CategroyList>
                </CategoryButton>
              </SwiperSlideWrapper>
            ))}
      </SwiperWrapper>
    </CategorySection>
  )
}

export default CategoryComponent

const CategorySection = styled.section`
  margin: 36px auto 0 auto;
  max-width: 1020px;
`

const SectionHeader = styled.h2<SizeProps>`
  color: ${({ $darkMode }) => ($darkMode ? '#FFFFFF' : '#303032')};
  font-size: 16px;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: column;
  align-items: flex-start;

  &:after {
    content: '';
    display: block;
    width: ${({ size }) => size};
    border-bottom: 5px solid #303032;
    border-color: ${({ $darkMode }) => ($darkMode ? '#FFFFFF' : '#303032')};
  }
`

const CategoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  align-content: center;
  line-height: 100%;
`

const SelectLabel = styled.select<DarkModeSelectProps>`
  border: none;
  font-family: GmarketSans;
  color: #28c7c7;
  background-color: ${({ $darkMode }) => ($darkMode ? '#1E1E1E' : '#ffffff')};
`

const CategroyList = styled.div<FontProps>`
  text-align: center;
  color: ${({ $darkMode }) => ($darkMode ? '#FFFFFF' : '#444444')};

  text-align: center;
  font-weight: 300;
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  margin-top: 10px;
`
const CategoryCircle = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 20%;
  background-color: ${({ color }) => color};
  align-self: center;
  margin-bottom: 4px;
  margin: 4px auto;
`

const CategoryButton = styled.button`
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: inherit;
  cursor: pointer;
`

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const SwiperWrapper = styled(Swiper)`
  display: flex;
  flex-direction: column;
  margin: 0 6px;
  position: absolute;

  @media (min-width: 1921px) {
    max-width: 720px;
    min-width: 610px;
    width: 100%;
    flex-shrink: 2;
  }
  @media (min-width: 1280px) and (max-width: 1920px) {
    max-width: 620px;
    min-width: 610px;
    width: 100%;
    flex-shrink: 2;
  }
  @media (min-width: 1025px) and (max-width: 1280px) {
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
    min-width: 320px;
  }

  .swiper-horizontal > .swiper-pagination-progressbar,
  .swiper-pagination-progressbar.swiper-pagination-horizontal,
  .swiper-vertical
    > .swiper-pagination-progressbar.swiper-pagination-progressbar-opposite {
    height: var(--swiper-pagination-progressbar-size, 2px);
  }

  .swiper-pagination-progressbar {
    background-color: #bcbcbc;
  }

  .swiper-pagination-progressbar-fill {
    --swiper-theme-color: #8ee7e7;
  }
  & .swiper-scrollbar.swiper-scrollbar-horizontal {
    background-color: #bcbcbc;
    opacity: 1;
    bottom: 0;
    & .swiper-scrollbar-drag {
      background: #8ee7e7;
    }
  }
`

export const SwiperSlideWrapper = styled(SwiperSlide)`
  z-index: -999;
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 10px 0 15px;
  position: relative;
`
