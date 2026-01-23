import clsx from 'clsx'
import Image from 'next/image'

export default function BrandLogo({ className }: { className?: string }) {
    return (
        <div className={clsx("relative h-32 w-64 transition-colors z-50", className)}>
            <Image
                src="/brand-logo-v2.png"
                alt="ALTER Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
