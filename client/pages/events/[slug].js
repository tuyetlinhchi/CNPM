import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'

export default function EventPage({ evt }) {

  return (
    <Layout>
      <div className={styles.event}>
        <span>
          {evt.time} ngày {new Date(evt.date).toLocaleDateString('en-GB')} 
        </span>
        <h1>{evt.name}</h1>
        <ToastContainer />
        {evt.image && (
          <div className={styles.image}>
            <Image
              src = {evt.image.formats.medium.url}
              width={960}
              height={600}
            />
          </div>
        )}

        <p>{evt.description}</p>
        <h3>Địa điểm: {evt.address}</h3>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Quay lại</a>
        </Link>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ query: { slug } }) {
  const res = await fetch(`${API_URL}/events?slug=${slug}`)
  const events = await res.json()

  return {
    props: {
      evt: events[0],
    },
  }
}
