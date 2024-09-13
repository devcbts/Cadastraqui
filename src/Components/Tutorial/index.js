import ButtonBase from "Components/ButtonBase";
import Overlay from "Components/Overlay";
import { tutorialAtom } from "context/tutorialAtom";
import useOutsideClick from "hooks/useOutsideClick";
import { useState } from "react";
import YouTube from "react-youtube";
import { useRecoilValue } from "recoil";
import styles from './styles.module.scss'
export default function Tutorial() {
    const value = useRecoilValue(tutorialAtom)
    const [openPalyer, setOpenPlayer] = useState(false)
    const ref = useOutsideClick(() => setOpenPlayer(false))
    if (!value) return null
    return (
        <div style={{ position: 'absolute', right: '24px' }}>
            <ButtonBase label={'Tutorial'} onClick={() => { setOpenPlayer(true) }} />
            {openPalyer &&
                <Overlay>
                    <div ref={ref}>
                        <YouTube videoId={value} className={styles.player} onReady={(event) => {
                            event.target.playVideo()
                        }} />
                    </div>
                </Overlay>}
        </div>
    )
}