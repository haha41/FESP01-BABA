import styled from 'styled-components'
import useThemeStore from '@/store/useThemeStore'
import { usePopularDataStore } from '@/store/usePopularDataStore'
import { SelectHTMLAttributes, useEffect } from 'react'
import getPopularData from '@/api/getPopularData'
import { movieGenres } from '@/utils/genresData'
import { Link } from 'react-router-dom'

interface TextColorProps {
  $darkMode: boolean
}

interface DarkModeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  $darkMode?: boolean
}

function SideBar() {
  const { populardata, setPopularData } = usePopularDataStore()
  const { $darkMode } = useThemeStore()

  useEffect(() => {
    const popularDataFetching = async () => {
      const response = await getPopularData()
      setPopularData(response)
    }
    popularDataFetching()
  }, [])

  return (
    <SideBarWrapper $darkMode={$darkMode}>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300;400;500;600;700;900&family=Playfair+Display:ital@1&display=swap');
      </style>
      <Title>🍿 오늘의 추천 영화 🎬</Title>
      {populardata?.results.slice(0, 10).map((item, index) => (
        <SideContentWrapper key={item.id} to={`/info/${item.id}`}>
          <ContentNumber>{index + 1}</ContentNumber>
          <RecommendImage
            src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
            alt={`${item.title} 포스터`}
          />
          <Movie>
            <MovieTitle $darkMode={$darkMode}>{item.title}</MovieTitle>
            <MovieInfo>
              <List>
                {item.genre_ids.slice(0, 3).map((id: number, index: number) => {
                  const genre = movieGenres.genres.find(
                    genre => genre.id === id
                  )
                  return (
                    <GenreSpan key={index} $darkMode={$darkMode}>
                      {genre?.name}
                    </GenreSpan>
                  )
                })}
              </List>
            </MovieInfo>
          </Movie>
        </SideContentWrapper>
      ))}
    </SideBarWrapper>
  )
}

export default SideBar

const SideBarWrapper = styled.aside<DarkModeSelectProps>`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  border-left: 0.5px solid #939393;
  background-color: ${({ $darkMode }) => ($darkMode ? '#1E1E1E' : '#ffffff')};
  gap: 4px;
  width: 350px;
  padding: 8px;
  z-index: 1;

  @media (max-width: 1030px) {
    display: none;
  }
`

const SideContentWrapper = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: black;
  margin: 4px;
`

const ContentNumber = styled.span`
  width: 14px;
  color: ${props => props.theme.color};
`

const Title = styled.h5`
  font-size: 22px;
`

const RecommendImage = styled.img`
  width: 75px;
  height: 94px;
  aspect-ratio: 2/3;
  object-fit: fill;
  border-radius: 3px;
`

const Movie = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MovieTitle = styled.div<TextColorProps>`
  font-weight: 600;
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#303032')};
  width: 210px;
`

const MovieInfo = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  font-size: 12px;
  margin-top: 6px;
`

const List = styled.li`
  list-style-type: none;
  display: flex;
`

const GenreSpan = styled.span<TextColorProps>`
  margin: 0;
  color: ${({ $darkMode }) => ($darkMode ? '#E0E0E0' : '#777777')};
  margin-right: 4px;
`
