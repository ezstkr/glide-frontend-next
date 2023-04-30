import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import styles from 'components/header.module.scss';

export default function Header() {
  const { data: session } = useSession()

  return (
    <nav className={`${styles.navbar} navbar header has-background-white px-3`} role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
          <img src="/icons/pinata.png" alt="Buefy" width="32" height="32" />
          <img className="ml-3" src="/icons/title/glide-28.svg" />
        </Link>

        {/* <div className="navbar-burger">
          <span />
          <span />
          <span />
        </div> */}
      </div>

      <div className="navbar-menu">
        <div className="navbar-end is-size-6">
          {session && (
            <a className="navbar-item" onClick={() => signOut()}>
              Logout
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
