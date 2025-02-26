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
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
            {hint && <Help style={{ cursor: 'pointer' }} width={30} height={30} onClick={handleHint} />}
            <AnimatePresence>
                {toggleHint ? <motion.div
                    style={{ padding: '12px', backgroundColor: 'white', fontSize: '12px', width: 'fit-content', display: 'flex', borderRadius: 8, listStylePosition: 'inside' }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                >
                    <strong>{hint}</strong>
                </motion.div> : null}


            </AnimatePresence>
        </div>
    )
}