import { StyledLink } from './Home'
import Logo from '@/components/Logo'
import styled from 'styled-components'
import Input from '@/components/Input'
import { HTMLAttributes } from 'react'
import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useUserStore } from '@/store/useUserStore'
import { useAuthStore } from '@/store/useAuthStore'
import CheckAccount from '@/components/CheckAccount'
import { Link, useNavigate } from 'react-router-dom'
import { gitHubLogin } from '@/utils/userData'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SignUpWrapperDiv, SrOnlyH2, FormWrapper } from '@/pages/SignUp'

interface PasswordInputProps extends HTMLAttributes<HTMLDivElement> {
  $inputColor?: boolean
}

function Login() {
  const navigate = useNavigate()
  const { login, logout } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState(null)
  const [username, setUsername] = useState(null)
  const [profileImg, setProfileImg] = useState(null)
  const [inputColor, setInputColor] = useState(false)
  const [session, setSession] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputColorChange = () => {
    setInputColor(prevFocus => !prevFocus)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleUserLogin = async (event: React.MouseEvent) => {
    event.preventDefault()
    try {
      // login 함수를 await로 비동기 호출
      await login(formData.email, formData.password)

      // 로그인 성공 시 navigate 실행
      // navigate('/main')
    } catch (error) {
      // 로그인 실패
      console.error(`❌ Error: ${error}`)
      // 실패 시 특별히 처리해야 하는 로직이 있다면 여기에 추가
    }
  }

  const handleGithubLogin = () => {
    gitHubLogin()
    navigate('/main')
  }

  const handleLogOut = (event: React.MouseEvent) => {
    event.preventDefault()

    logout()
    supabase.auth.signOut().then(() => alert('다음에 또만나요~ 🙏🏻'))
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    let ignore = false

    async function getProfile() {
      try {
        setLoading(true)

        if (session && session.user) {
          const { user } = session

          const { data, error } = await supabase
            .from('users')
            .select(`username, nickname, profile_img`)
            .eq('user_email', user.id)
            .single()

          if (!ignore) {
            if (error) {
              console.warn(error)
            } else if (data) {
              setUsername(data.username)
              setNickname(data.nickname)
              setProfileImg(data.profile_img)
              useUserStore
                .getState()
                .setUserData(data.username, data.nickname, data.profile_img)
            }
          }
        }
      } catch (error) {
        console.error('Error in getProfile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  return (
    <SignUpWrapperDiv>
      <SrOnlyH2>로그인</SrOnlyH2>
      <LogoWrapper>
        <StyledLink to="/">
          <Logo />
        </StyledLink>
      </LogoWrapper>
      {session ? (
        <LoginFormWrapper>
          <div></div>
          <Img
            src={`https://ufinqahbxsrpjbqmrvti.supabase.co/storage/v1/object/public/userImage/${profileImg}`}
          ></Img>
          <Username>{username} 님, 환영합니다! 🤗</Username>
          <Nickname>닉네임 : {nickname}</Nickname>

          <Button
            onClick={handleLogOut}
            text={'로그아웃'}
            width={'360px'}
          ></Button>
        </LoginFormWrapper>
      ) : (
        <LoginFormWrapper>
          <InputWrapper>
            <label htmlFor="email"></label>
            <Input
              id="email"
              type="input"
              placeholder="이메일"
              width="345px"
              name="email"
              onChange={handleInputChange}
            />
            <label htmlFor="=password"></label>
            <PasswordInputWrapper $inputColor={inputColor}>
              <PasswordInput
                id="password"
                type="password"
                placeholder="패스워드"
                width={'345px'}
                name="password"
                onFocus={handleInputColorChange}
                onChange={handleInputChange}
              />
              <HideBtn type="button">
                <FontAwesomeIcon icon={faEye} />
              </HideBtn>
            </PasswordInputWrapper>
          </InputWrapper>
          <StyledLink to="/main">
            <Button
              type="submit"
              text={loading ? 'Loading ...' : '로그인'}
              width="360px"
              onClick={handleUserLogin}
            />
          </StyledLink>
          <Button
            $bgcolor="#1e1e1e"
            color="white"
            text="GitHub 로그인"
            width="360px"
            onClick={handleGithubLogin}
          />
        </LoginFormWrapper>
      )}

      {session ? null : (
        <Link to="/signup">
          <CheckAccount text1="계정이 없으신가요?" text2="가입하기" />
        </Link>
      )}
    </SignUpWrapperDiv>
  )
}

export default Login

const LogoWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  width: 100%;
`

const LoginFormWrapper = styled(FormWrapper)`
  border-top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`

const HideBtn = styled.button`
  width: 10%;
  border: none;
  background-color: white;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PasswordInputWrapper = styled.div<PasswordInputProps>`
  max-width: 360px;
  display: flex;
  border: 1.5px solid
    ${({ $inputColor }) => ($inputColor ? '#3797EF' : '#bcbcbc')};
  border-radius: 5px;
  transition: border-color 0.3s ease;
`

const PasswordInput = styled.input`
  width: ${props => props.width || '100%'};
  height: 44px;
  border: none;
  border-radius: 5px;
  padding-left: 10px;

  &::placeholder {
    color: #bcbcbc;
    font-family: 'GmarketSans';
  }
  &:focus {
    outline: none;
    border-color: #3797ef;
  }
`

const Img = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
`

const Username = styled.h4`
  font-size: 30px;
`

const Nickname = styled.h5`
  font-size: 22px;
`
