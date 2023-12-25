import { Link, useNavigate } from 'react-router-dom'
import AddImage from '@/assets/icon/Add.png'
import UserIcon from '@/assets/icon/User.png'
import HomeImage from '@/assets/icon/Home.png'
import LikeImage from '@/assets/icon/Like.png'
import useThemeStore from '@/store/useThemeStore'
import searchImage from '@/assets/icon/Search.png'
import styled from 'styled-components'
import DarkModeToggleIcon from '@/components/DarkModeIcon'
import { useAuthStore } from '@/store/useAuthStore'
import AddUserIcon from '@/components/mypage/AddUserIcon'
import logo from '@/assets/logo.svg'

function Nav() {
  const { isAuthenticated } = useAuthStore()
  const { $darkMode, toggleDarkMode } = useThemeStore()
  const navication = useNavigate()

  const handleSendToLoginPage = () => {
    alert('로그인 사용자만 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?')
    navication('/login')
  }

  return (
    <NavContain>
      <FLexbox>
        <Link to="/main">
          <MainLogo src={logo} alt="" />
        </Link>
        <List>
          <Item>
            <StyledLink to="/main">
              <Btn>
                <Image src={HomeImage} alt="메인 페이지" />
                <ItemName>홈</ItemName>
              </Btn>
            </StyledLink>
          </Item>

          <Item>
            <StyledLink to="/search">
              <Btn>
                <Image src={searchImage} alt="검색 페이지" />
                <ItemName>검색</ItemName>
              </Btn>
            </StyledLink>
          </Item>

          <Item>
            <StyledLink to="/writing">
              <Btn>
                <Image src={AddImage} alt="글쓰기 페이지" />
                <ItemName>만들기</ItemName>
              </Btn>
            </StyledLink>
          </Item>

          <Item>
            <Btn>
              <Image src={LikeImage} alt="좋아요 페이지" />
              <ItemName>찜 목록</ItemName>
            </Btn>
          </Item>

          <Item>
            <StyledLink to="/mypage">
              <Btn>
                {isAuthenticated ? (
                  <AddUserIcon />
                ) : (
                  <Image
                    src={UserIcon}
                    alt="프로필 페이지"
                    onClick={handleSendToLoginPage}
                  />
                )}
                <ItemName>프로필</ItemName>
              </Btn>
            </StyledLink>
          </Item>
        </List>
      </FLexbox>

      <Wrapper>
        <DarkModeToggleIcon
          $isDarkMode={$darkMode}
          toggleDarkModeAni={toggleDarkMode}
        />
      </Wrapper>
    </NavContain>
  )
}

export default Nav

const NavContain = styled.nav<{ theme: { bgColor: string } }>`
  width: 100%;
  height: 56px;
  border-right: 2.5px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  background-color: ${props => props.theme.bgColor};
  z-index: 100;
  @media (max-width: 700px) {
    min-width: 390px;
  }
  @media (min-width: 701px) {
    position: sticky;
    top: 0;
    left: 0;
    height: 100vh;
    width: 245px;
    padding: 0 15px;
    background-color: ${props => props.theme.bgColor};
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 2.5px solid rgba(0, 0, 0, 0.1);
    gap: 200px;
  }
  @media (min-width: 701px) and (max-width: 1260px) {
    width: 57px;
    padding-left: 10px;
  }
`

const FLexbox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Wrapper = styled.div`
  @media (max-width: 1260px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const MainLogo = styled.img`
  width: 103px;
  margin: 0 auto;
  margin-bottom: 40px;
  color: ${props => props.theme.color};
  @media (max-width: 700px) {
    display: none;
  }
  @media (min-width: 701px) and (max-width: 1260px) {
    width: 60px;
    font-size: 18px;
    margin: 0;
    text-align: center;
    margin-bottom: 40px;
  }
  @media (min-width: 1261px) {
    font-size: 30px;
  }
`

const Image = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`

const List = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  @media (max-width: 700px) {
    justify-content: space-between;
  }
  @media (min-width: 701px) {
    flex-direction: column;
    width: 100%;
  }
`

const Item = styled.li`
  height: 60px;
  list-style-type: none;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${props => props.theme.bgColor};

  @media (max-width: 700px) {
    justify-content: center;
    &:nth-child(n + 6) {
      display: none;
    }
  }

  @media (min-width: 701px) {
    &:hover {
      background-color: ${props =>
        props.theme.bgColor === '#1E1E1E' ? '#333' : '#f2f2f2'};
      border-radius: 8px;
      color: ${props =>
        props.theme.bgColor === '#1E1E1E' ? '#fff' : '#1E1E1E'};
    }
  }
`

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.theme.bgColor};

  & > img {
    filter: ${props =>
      props.theme.bgColor === '#1E1E1E' ? 'invert(1)' : 'none'};
  }

  @media (min-width: 701px) {
    gap: 16px;
    width: 100%;
    height: 100%;
    justify-content: start;
    border-radius: 8px;

    &:hover {
      background-color: ${props =>
        props.theme.bgColor === '#1E1E1E' ? '#333' : '#f2f2f2'};
    }
  }
`

const ItemName = styled.span`
  font-weight: 500;
  letter-spacing: 1.2px;
  font-size: 20px;
  color: ${props => props.theme.color};
  @media (max-width: 1261px) {
    display: none;
  }
`

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
