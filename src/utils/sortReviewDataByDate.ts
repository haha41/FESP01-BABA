// interface ReviewData {
//   id: number
//   created_at: string
//   likes: string[]
//   user_id: string
// }

// 데이터의 날짜들을 받아와 최신순으로 나열합니다.
export const sortReviewDataByDate = (data: ReviewData[]) => {
  return data.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
