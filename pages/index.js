import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Button from '@material-ui/core/Button'
import { useMobileDetector } from '../hooks/useMobileDetector'

export default function Home() {
  const { isMobile } = useMobileDetector()

  return (
    <div className={styles.container}>
      <Head>
        <title>FlockTogether</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h2 className={styles[`title${isMobile ? '_mobile' : ''}`]}>
          Itching to get out?
        </h2>
        <p className={styles[`description${isMobile ? '_mobile' : ''}`]}>
          Plan your weekend getaway with FlockTogether
        </p>
        <Link href='/create'>
          <Button variant='contained' color='primary'>
            Start planning
          </Button>
        </Link>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}
