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
import headerAtom from "Components/Header/atoms/header-atom";
import { AnimatePresence, motion } from 'framer-motion'
export default function Tutorial() {
    const value = useRecoilValue(tutorialAtom)
    const [openPalyer, setOpenPlayer] = useState(false)
    const ref = useOutsideClick(() => setOpenPlayer(false))
    // if sidebar is visible (UserHeader) invert colors
    const { hiddenSidebar } = useRecoilValue(headerAtom)
    // if (!value) return null
    return (
        <AnimatePresence>

            {value && <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{ position: 'relative', right: '24px' }}>

                <div

                    title={"Tutorial disponível"}
                    className={styles.container}
                    onClick={() => { setOpenPlayer(true) }}
                    data-theme={hiddenSidebar ? "default" : "secondary"}
                >
                    <div className={styles.tutorial}>
                        <h4>
                            TUTORIAL
                        </h4>
                        <Play className={styles.play} />
                    </div>
                </div>
                <AnimatePresence>
                    {
                        openPalyer &&
                        <Overlay>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                style={{ backgroundColor: 'black', overflow: 'hidden' }}
                                ref={ref}>
                                <YouTube
                                    opts={{
                                        playerVars: {
                                            rel: 0,
                                        },

                                    }}
                                    videoId={value}
                                    className={styles.player}
                                    onReady={(event) => {
                                        event.target.playVideo()
                                    }} />
                            </motion.div>
                        </Overlay>
                    }
                </AnimatePresence>
            </motion.div >}
        </AnimatePresence>

    )
}