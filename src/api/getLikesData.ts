import { supabase } from '@/utils/supabaseClient'

export const deleteLikes = async (itemId?: number) => {
  await supabase.from('likes').delete().match({ review_id: itemId })
}

// 내가 누른 좋아요
export const getMyLikes = async (id: string[]) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .contains('likes', id)

    if (error) {
      console.error(error.message)
      return { error }
    } else {
      return { data }
    }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

// 기존의 likes 배열 가져오기
export const getLikes = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('likes')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error.message)
      return { error }
    } else {
      return { data }
    }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

//# 좋아요
export const addFavorite = async (
  movie_id: string,
  user_id: string,
  text: string,
  ott: string,
  rating: number,
  movie_title: string,
  id: Number,
  loginUserId?: string
) => {
  try {
    // 기존 likes 배열 가져오기
    const { data: existingData, error: existingError } = await supabase
      .from('reviews')
      .select('likes')
      .eq('id', id)
      .single()

    if (existingError) {
      console.error(`기존 데이터 조회 실패: ${existingError.message}`)
      throw existingError
    }

    const existingLikes = (await existingData?.likes) || []

    let updatedLikes = existingLikes.includes(loginUserId)
      ? existingLikes.filter((item: string) => item !== loginUserId)
      : [...existingLikes, loginUserId]

    updatedLikes = updatedLikes.length === 0 ? null : updatedLikes

    // 업서트
    const { error } = await supabase.from('reviews').upsert([
      {
        movie_id,
        user_id,
        text,
        ott,
        rating,
        movie_title,
        id,
        likes: updatedLikes // 갱신된 likes 배열 사용
      }
    ])

    if (error) {
      console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error.message}`)
      throw error
    }
  } catch (error) {
    console.error(`데이터 통신에 실패하였습니다..😵‍💫 ${error}`)
  }
}

// 즐겨찾기 리뷰 가져오기
export const getfavorites = async (userId: string) => {
  const { data } = await supabase
    .from('reviews')
    .select('likes_id')
    // .select('*')
    // .eq('likes', userId)
    .match({ likes_id: userId })

  return data
}
