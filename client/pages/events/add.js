import { parseCookies } from '@/helpers/index'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function AddEventPage({ token }) {
  const [values, setValues] = useState({
    name: '',
    address: '',
    date: '',
    time: '',
    description: '',
  })

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )

    if (hasEmptyFields) {
      toast.error('Vui lòng điền hết các trường!')
    }

    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('token không hợp lệ!')
        return
      }
      toast.error('Có vẻ như sự kiện này đã tồn tại!')
    } else {
      const evt = await res.json()
      router.push(`/events/${evt.slug}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <Layout title='Add New Event'>
      <Link href='/events'>Quay lại</Link>
      <h1>Thêm sự kiện</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Tên</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              placeholder="Tên sự kiện"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='address'>Địa điểm</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              placeholder="Địa điểm"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Ngày</label>
            <input
              type='date'
              name='date'
              id='date'
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Giờ</label>
            <input
              type='time'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor='description'>Thông tin mô tả</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Thêm' className='btn' />
      </form>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req)

  return {
    props: {
      token,
    },
  }
}
