import { ReactComponent as Help } from 'Assets/icons/question-mark.svg';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function DocumentHint({
    hint
}) {
    const [toggleHint, setToggleHint] = useState(false)
    const handleHint = () => {
        setToggleHint((prev) => !prev)
    }
    return (
        <div style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'flex-start' }}>
            {hint && <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleHint}>
                <Help width={30} height={30} />
                {!toggleHint && <strong style={{ fontSize: '12px' }}>mais informações</strong>}
            </div>
            }
            <AnimatePresence>
                {toggleHint ? <motion.div
                    style={{
                        padding: '12px', backgroundColor: '#ddd', fontSize: '12px',
                        width: 'fit-content', display: 'flex', borderRadius: 8, listStylePosition: 'inside', flex: 1
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10, height: 0 }}
                >
                    <strong>{hint}</strong>
                </motion.div> : null}


            </AnimatePresence>
        </div>
    )
}