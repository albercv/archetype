import Image from 'next/image'
import Link from 'next/link'

export function FloatingLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="logo-float">
      <Image
        src="/images/logo.png"
        alt="Archetype"
        width={200}
        height={28}
        style={{ width: 'auto', height: '100%' }}
        priority
      />
    </Link>
  )
}
