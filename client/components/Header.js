import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { useContext } from 'react'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/Header.module.css'
import Search from './Search'

export default function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>
          <a>Campus Events</a>
        </Link>
      </div>

      <Search />
      
      <nav>
        <ul>
          <li>
            <Link href='/events'>
              <a>Tất cả sự kiện</a>
            </Link>
          </li>
          {user ? (
            // If logged in
            <>
              <li>
                <Link href='/events/add'>
                  <a>Tạo mới</a>
                </Link>
              </li>
              <li>
                <Link href='/account/dashboard'>
                  <a>Sự kiện của bạn</a>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => logout()}
                  className='btn-secondary btn-icon'
                >
                  <FaSignOutAlt /> Đăng xuất
                </button>
              </li>
            </>
          ) : (
            // If logged out
            <>
              <li>
                <Link href='/account/login'>
                  <a className='btn-secondary btn-icon'>
                    <FaSignInAlt /> Đăng nhập
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
