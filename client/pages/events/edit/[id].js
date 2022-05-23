import moment from 'moment'
import { FaImage } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { parseCookies } from '@/helpers/index'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function EditEventPage({ evt, token }) {
  const [values, setValues] = useState({
    name: evt.name,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  })
  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  )
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )

    if (hasEmptyFields) {
      toast.error('Vui lòng điền hết các trường')
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('Chưa xác thực')
        return
      }
      toast.error('Đang lỗi tí, đợi xíu')
    } else {
      const evt = await res.json()
      router.push(`/events/${evt.slug}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}`)
    const data = await res.json()
    setImagePreview(data.image.formats.thumbnail.url)
    setShowModal(false)
  }

  return (
    <Layout title='Thêm sự kiện'>
      <Link href='/events'>  Quay lại  </Link>
      <h1>Sự kiện của bạn</h1>
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
              value={moment(values.date).format('yyyy-MM-DD')}
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
          <label htmlFor='description'>Mô tả chi tiết</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Cập nhật' className='btn' />
      </form>

      <h2>Ảnh của sự kiện</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>Ảnh chưa được tải lên</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowModal(true)}
          className='btn-secondary btn-icon'
        >
          <FaImage />  Chọn ảnh
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtId={evt.id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req)

  const res = await fetch(`${API_URL}/events/${id}`)
  const evt = await res.json()

  return {
    props: {
      evt,
      token,
    },
  }
}
