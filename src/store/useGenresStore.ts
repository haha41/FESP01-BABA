import { create } from 'zustand'

interface GenreDataState {
  movieGenresState: {
    id: number
    name: string
  }[]
  tvGenresState: {
    id: number
    name: string
  }[]
  setMovieGenresState: (data: { id: number; name: string }[]) => void // => void : 반환 X
  setTvGenresState: (data: { id: number; name: string }[]) => void
}

export const useGenresStore = create<GenreDataState>(set => ({
  movieGenresState: [],
  tvGenresState: [],
  setMovieGenresState: data => set({ movieGenresState: data }),
  setTvGenresState: data => set({ tvGenresState: data })
}))
