import styled from 'styled-components'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react'

function GoingUpBtn() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 스크롤 이벤트를 감지하여 버튼을 표시 또는 숨김
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop
      setIsVisible(scrolled > 300) // 스크롤이 300px 이상 되었을 때 버튼을 표시
    }

    window.addEventListener('scroll', handleScroll)

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 페이지 최상단으로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드러운 스크롤 효과
    })
  }

  return (
    <Btn
      onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </Btn>
  )
}

export default GoingUpBtn

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: fixed;
  bottom: 20px;
  /* right: 420px; */
  background-color: #3498db;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 22px;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 700px) {
    bottom: 70px;
    right: 30px;
  }

  @media (min-width: 701px) and (max-width: 1024px) {
    right: 30px;
  }
  @media (min-width: 1025px) {
    right: 30px;
    z-index: 10;
  }
`
