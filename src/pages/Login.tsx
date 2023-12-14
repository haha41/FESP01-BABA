import { useState } from 'react'
import { StyledLink } from './Home'
import Logo from '@/components/Logo'
import styled from 'styled-components'
import Input from '@/components/Input'
import { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'
import { useAuthStore } from '@/store/useAuthStore'
import CheckAccount from '@/components/CheckAccount'
import { userLogin, gitHubLogin } from '@/utils/userData'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SignUpWrapperDiv, SrOnlyH2, FormWrapper } from '@/pages/SignUp'

interface PasswordInputProps extends HTMLAttributes<HTMLDivElement> {
  $inputColor?: boolean
}

function Login() {
  const { isAuthenticated, login, logout } = useAuthStore()

  const [inputColor, setInputColor] = useState(false)
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
      await userLogin(formData)
      login()
    } catch (error) {
      console.error(`❌ Error: ${error}`)
    }
  }

  const handleGithubLogin = () => {
    gitHubLogin()
  }

  const handleLogOut = () => {
    logout()
  }

  return (
    <SignUpWrapperDiv>
      <SrOnlyH2>로그인</SrOnlyH2>
      <LogoWrapper>
        <StyledLink to="/">
          <Logo />
        </StyledLink>
      </LogoWrapper>
      {isAuthenticated ? (
        <div>
          <div>로그인되었습니다.</div>
          <button onClick={handleLogOut}>로그아웃</button>
        </div>
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
              text="로그인"
              width="360px"
              onClick={handleUserLogin}
            />
          </StyledLink>
          <Button
            $bgcolor="#FFDC00"
            color="#1E1E1E"
            text="KaKao 로그인"
            width="360px"
          />
          <Button
            $bgcolor="#1e1e1e"
            color="white"
            text="GitHub 로그인"
            width="360px"
            onClick={handleGithubLogin}
          />
        </LoginFormWrapper>
      )}

      <Link to="/signup">
        <CheckAccount text1="계정이 없으신가요?" text2="가입하기" />
      </Link>
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
