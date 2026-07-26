import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <Link href="/test" className={styles.buttonLink}>
        Ir al testing
      </Link>
      <Link href="/ranking" className={styles.buttonLink}>
        Ir al ranking
      </Link>
    </div>
  )
}