'use client'

import { useSearchParams } from 'next/navigation'

export default function PinTemplate() {
    const params = useSearchParams()
    const title = params.get('title') || 'Product Review'
    const category = params.get('category') || 'Review'
    const rating = params.get('rating') || '4.0'
    const image = params.get('image') || ''
    const score = parseFloat(rating)
    const fullStars = Math.round(score)

    return (
        <div style={{
            width: '1000px',
            height: '1500px',
            background: '#1B2A4A',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Georgia, serif',
            overflow: 'hidden',
        }}>
            {/* Product image area */}
            <div style={{
                width: '100%',
                height: '720px',
                background: '#f5f0eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                {image && (
                    <img src={image} alt={title} style={{
                        maxHeight: '640px',
                        maxWidth: '640px',
                        objectFit: 'contain',
                        padding: '40px',
                    }} />
                )}
                {/* Category badge */}
                <div style={{
                    position: 'absolute',
                    top: '32px',
                    left: '32px',
                    background: '#C98B1A',
                    color: '#fff',
                    fontSize: '28px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '12px 32px',
                    borderRadius: '60px',
                }}>
                    {category}
                </div>
            </div>

            {/* Body */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '60px',
                gap: '32px',
            }}>
                {/* Verified label */}
                <div style={{
                    fontSize: '28px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#C98B1A',
                }}>
                    Verified Review
                </div>

                {/* Title */}
                <div style={{
                    fontSize: '56px',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.35,
                    flex: 1,
                }}>
                    {title}
                </div>

                {/* Stars + score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} style={{
                                fontSize: '48px',
                                color: i <= fullStars ? '#C98B1A' : 'rgba(255,255,255,0.2)',
                            }}>★</span>
                        ))}
                    </div>
                    <div style={{
                        fontSize: '44px',
                        fontWeight: 700,
                        color: '#C98B1A',
                        fontFamily: 'Arial, sans-serif',
                    }}>
                        {score.toFixed(1)} / 5
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{
                            fontSize: '52px',
                            fontWeight: 700,
                            color: '#fff',
                            fontFamily: 'Georgia, serif',
                        }}>Verdict</div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '8px',
                        }}>
                            <div style={{
                                width: '16px', height: '16px',
                                borderRadius: '50%',
                                background: '#2A7D4F',
                            }} />
                            <span style={{
                                fontSize: '24px',
                                color: 'rgba(255,255,255,0.45)',
                                fontFamily: 'Arial, sans-serif',
                            }}>Unbiased reviews</span>
                        </div>
                    </div>
                    <div style={{
                        background: '#C98B1A',
                        color: '#fff',
                        fontSize: '28px',
                        fontWeight: 700,
                        padding: '20px 48px',
                        borderRadius: '60px',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                    }}>
                        Read Review
                    </div>
                </div>
            </div>
        </div>
    )
}