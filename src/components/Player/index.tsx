import { useEffect, useRef, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLooping,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer()

    const episode =  episodeList[currentEpisodeIndex]

    useEffect(() => {
        if(audioRef.current === null) {
            return
        }

        if(isPlaying) {
            audioRef.current.play()
        }else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () =>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext) {
            playNext()
        } else {
            clearPlayerState()
        }
    }

    return (
       <div className={styles.playerContainer}>
           <header>
               <img src="/playing.svg" alt="Tocando agora"/>
               <strong>Tocando agora</strong>
           </header>

          {episode
            ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            )
            : 
            (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                 </div>
            )}
           
           <footer className={!episode ? styles.empty : ''}>
               <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                onChange={handleSeek}
                                max={episode.duration}
                                value={progress}
                                trackStyle={{ backgroundColor: '#04d361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04d361'}}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
               </div>
                            
                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setupProgressListener}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}            

               <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                       <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                       <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                       { isPlaying
                        ? <img src="/pause.svg" alt="Pausar"/>
                        : <img src="/play.svg" alt="Tocar"/>
                       }
                   </button>
                   <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                       <img src="/play-next.svg" alt="Tocar próxima"/>
                   </button>
                   <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLooping}
                        className={isLooping ? styles.isActive : '' }
                    >
                       <img src="/repeat.svg" alt="Repetir"/>
                   </button>
               </div>
           </footer>
       </div>
    )
}

export default Player