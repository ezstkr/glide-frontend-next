import { ReactNode, useEffect } from 'react';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    function handleResize() {
      console.log("resize");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={!router.asPath.includes('login') ? 'has-background-light2' : ''}>
      <Header />
      <div className={`${styles.container} col-a-center is-10`}>
        {children}
      </div>
    </div>
  );
}
