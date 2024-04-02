import React from 'react'
import './loading.css'
const LoadingCadastroCandidato = () => {
    return (
        <div className="fill-box" style={{ flexDirection: 'column' }}>
            <div className='survey-box'>
                <div className="skeleton skeleton-text" style={{ marginLeft: '140px' }} />

                <div className="skeleton skeleton-input" />
            </div>
            <div className='survey-box'>
                <div className="skeleton skeleton-text" style={{ marginLeft: '140px' }} />

                <div className="skeleton skeleton-input" />
            </div>

            <div className='survey-box'>
                <div className="skeleton skeleton-text" style={{ marginLeft: '140px' }} />

                <div className="skeleton skeleton-input" />
            </div>
            <div className='survey-box'>
                <div className="skeleton skeleton-text" style={{ marginLeft: '140px' }} />

                <div className="skeleton skeleton-input" />
            </div>
            <div className='survey-box'>
                <div className="skeleton skeleton-text" style={{ marginLeft: '140px' }} />

                <div className="skeleton skeleton-input" />
            </div>
        </div>
    )
}

export default LoadingCadastroCandidato