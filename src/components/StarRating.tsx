import { useEffect, useState } from 'react'
import yellowStar from '@/assets/StarIcon.svg'
import useThemeStore from '@/store/useThemeStore'
import whiteStar from '@/assets/WhiteStarIcon.svg'
import darkModeWhiteStar from '@/assets/DarkModeWhiteStar.svg'
import darkModeYellowStar from '@/assets/DarkModeYellowStar.svg'
import styled, { css } from 'styled-components'

interface StarRatingProps {
  onRatingChange: (newRating: number) => void
  initialRating?: number
}

interface StarIconProps {
  selected: boolean
  $darkMode: boolean
}

const StarRating = ({ onRatingChange, initialRating = 0 }: StarRatingProps) => {
  const { $darkMode } = useThemeStore()

  const [rating, setRating] = useState(initialRating)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleStarClick = (selectedRating: number) => {
    if (rating === selectedRating) {
      setRating(initialRating)
      onRatingChange(initialRating)
    } else {
      setRating(selectedRating)
      onRatingChange(selectedRating)
    }
  }

  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map(index => (
        <StarIcon
          key={index}
          onClick={() => handleStarClick(index)}
          selected={index <= rating}
          $darkMode={$darkMode}
        >
          <img
            src={
              index <= rating
                ? $darkMode
                  ? darkModeYellowStar
                  : yellowStar
                : $darkMode
                  ? darkModeWhiteStar
                  : whiteStar
            }
          />
        </StarIcon>
      ))}
    </StarContainer>
  )
}

export default StarRating

const StarContainer = styled.div`
  display: flex;
`

const StarIcon = styled.div<StarIconProps>`
  width: 22px;
  height: 22px;
  cursor: pointer;
  margin-right: 5px;
  transition: transform 0.2s ease-in-out;

  @media (min-width: 1031px) {
    width: 28px;
    height: 28px;
    margin: 0 7px;
  }

  /* ${props => css`
    background-image: url(${props.selected
      ? props.$darkMode
        ? darkModeYellowStar
        : yellowStar
      : props.$darkMode
        ? darkModeWhiteStar
        : whiteStar});
  `} */

  &:hover {
    transform: scale(1.2);
  }
`
