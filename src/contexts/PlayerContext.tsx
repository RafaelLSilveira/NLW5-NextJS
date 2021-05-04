import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    hasPrevious: boolean
    hasNext: boolean
    play: (episode: Episode) => void
    playList:(list: Episode[], index: number) => void
    playNext: () => void
    playPrevious: () => void
    togglePlay: () => void
    setPlayingState: (state: boolean) => void
    isLooping: boolean
    toggleLooping: () => void
    isShuffling: boolean
    toggleShuffle: () => void
    clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({children}:PlayerContextProviderProps){
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLooping() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }
      
    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    const hasPrevious = isShuffling || currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function playNext() {
        if (isShuffling) {
            const nexRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nexRandomEpisodeIndex)
        } else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious() {
        if (isShuffling) {
            const nexRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nexRandomEpisodeIndex)
        } else if(hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }
      
    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                hasPrevious,
                hasNext,
                play,
                playList,
                playPrevious,
                playNext,
                isPlaying,
                togglePlay,
                setPlayingState,
                isLooping,
                toggleLooping,
                toggleShuffle,
                isShuffling,
                clearPlayerState
            }}>
            { children }
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}