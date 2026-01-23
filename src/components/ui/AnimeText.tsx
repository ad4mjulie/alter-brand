"use client"

import { useEffect, useRef } from 'react'
import { createTimeline, splitText, stagger, Timeline } from 'animejs'

interface AnimeTextProps {
    text: string
    className?: string
}

export default function AnimeText({ text, className }: AnimeTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<Timeline | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Wait a tick to ensure DOM is ready
        const timeout = setTimeout(() => {
            const container = containerRef.current
            if (!container) return

            try {
                // Select the paragraph element
                const p = container.querySelector('p')
                if (!p) return

                // Split text logic from user's snippet
                const split = splitText(p, { debug: false })
                const $accessible = split.$target.firstChild as HTMLElement

                if ($accessible) {
                    $accessible.style.cssText = `
                        opacity: 0;
                        position: absolute;
                        color: var(--hex-green-1);
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        /* outline: currentColor dotted 1px; */
                    `
                }

                // Create timeline
                const tl = createTimeline({
                    defaults: { ease: 'inOutQuad' },
                })

                if ($accessible) {
                    tl.add($accessible, {
                        opacity: 1,
                        z: '-2rem',
                    }, 0)
                }

                tl.add(p, {
                    rotateX: 0,
                    rotateY: 60
                }, 0)

                tl.add(split.words, {
                    z: '6rem',
                    opacity: .75,
                    outlineColor: { from: '#FFF0' },
                    duration: 750,
                    // @ts-ignore - mismatch in types for beta
                    delay: stagger(40, { from: 'random' })
                }, 0)

                tl.init()
                timelineRef.current = tl

            } catch (error) {
                console.error("Anime.js initialization error:", error)
            }
        }, 100)

        return () => {
            clearTimeout(timeout)
            // Cleanup if necessary
        }
    }, [text])

    // Toggle function (optional, can be attached to a click handler if needed)
    const toggleAnimation = () => {
        if (timelineRef.current) {
            timelineRef.current.alternate().resume()
        }
    }

    return (
        <div
            ref={containerRef}
            className={className}
            onClick={toggleAnimation}
            style={{ perspective: '600px' }}
        >
            <div className="large centered row" style={{ transformStyle: 'preserve-3d' }}>
                <p className="text-xl" style={{ transformStyle: 'preserve-3d' }}>
                    {text}
                </p>
            </div>

            {/* Hidden accessibility/fallback content if needed by SplitText */}
        </div>
    )
}
