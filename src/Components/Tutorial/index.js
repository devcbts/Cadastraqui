import ButtonBase from "Components/ButtonBase";
import Overlay from "Components/Overlay";
import { tutorialAtom } from "context/tutorialAtom";
import useOutsideClick from "hooks/useOutsideClick";
import { useState } from "react";
import YouTube from "react-youtube";
import { useRecoilValue } from "recoil";
import styles from './styles.module.scss'
import { ReactComponent as Play } from 'Assets/icons/player-play.svg'
import Tooltip from "Components/Tooltip";
export default function Tutorial() {
    const value = useRecoilValue(tutorialAtom)
    const [openPalyer, setOpenPlayer] = useState(false)
    const ref = useOutsideClick(() => setOpenPlayer(false))
    if (!value) return null
    return (
        <div style={{ position: 'absolute', right: '24px' }}>

            <div title={"Tutorial disponível"} className={styles.container} onClick={() => { setOpenPlayer(true) }} >
                <div className={styles.tutorial}>
                    <h4>
                        TUTORIAL
                    </h4>
                    <Play className={styles.play} />
                </div>
            </div>
            {
                openPalyer &&
                <Overlay>
                    <div ref={ref}>
                        <YouTube videoId={value} className={styles.player} onReady={(event) => {
                            event.target.playVideo()
                        }} />
                    </div>
                </Overlay>
            }
        </div >
    )
}