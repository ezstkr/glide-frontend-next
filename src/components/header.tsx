import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react"
import styles from './header.module.scss';

export default function Header() {
  const { data: session } = useSession()

  return (
    <nav className={`${styles.navbar} navbar header has-background-white px-3`} role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
          <Image src="/icons/pinata.png" alt="Pinata" width={32} height={32} priority />
          <Image src="/icons/title/glide-28.svg" alt="Glide" width={48} height={16} priority className="ml-3" />
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
