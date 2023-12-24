import { create } from 'zustand'
import { supabase } from 'utils/supabaseClient'
import { getProfileImgUrl } from '@/api/profileImgApi'

interface UserData {
  email?: string
  username: string | undefined
  nickname: string
  profileIcon: string | null
}

interface AuthStore {
  isAuthenticated: boolean
  user: null | UserData
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const initialAuthState = (() => {
  const storedData = localStorage.getItem('userData')
  if (storedData) {
    return { isAuthenticated: true, user: JSON.parse(storedData) }
  } else {
    return { isAuthenticated: false, user: null }
  }
})()

export const useAuthStore = create<AuthStore>(set => ({
  ...initialAuthState,
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (data && data.user) {
        const userIconImage = await getProfileImgUrl(data.user.id)

        const userData: UserData = {
          username: data.user.email,
          nickname: 'user_nickname',
          profileIcon: userIconImage
        }

        set({ isAuthenticated: true, user: userData })
        alert('로그인에 성공하였습니다!')
        // 여기에서 페이지 이동을 호출하지 않음
      } else if (error) {
        console.error('로그인 실패:', error.message)
        localStorage.removeItem('userData')
        set({ isAuthenticated: false, user: null })
        alert('아이디 또는 비밀번호가 잘못되었습니다.') // 로그인 실패 시 알림
        // 여기에서 페이지 이동을 호출하지 않음
      }
    } catch (error) {
      console.error('❌ Error:', error)
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
    localStorage.removeItem('userData')
  }
}))

// onAuthStateChange 이벤트 등록
// onAuthStateChange 이벤트 등록
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const userData: UserData = {
      username: session.user.email,
      nickname: 'user_nickname',
      profileIcon: null
    }

    // Zustand store 업데이트
    useAuthStore.setState({ isAuthenticated: true, user: userData })

    // 로컬 스토리지에 사용자 정보 저장
    localStorage.setItem('userData', JSON.stringify(userData))
  } else if (event === 'SIGNED_OUT') {
    // 로그아웃인 경우
    // 세션을 완전히 종료
    await supabase.auth.signOut()

    // 상태와 로컬 스토리지 업데이트
    useAuthStore.setState({ isAuthenticated: false, user: null })
    localStorage.removeItem('userData')
  }
})
