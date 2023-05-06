import { ReactNode, useEffect } from 'react';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import styles from './layout.module.scss';
import { inter } from '@/styles/fonts';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const backgroundClassName = 
    router.asPath.includes('login') ? '' : 
    router.pathname === '/_error' ? 'has-background-black' :
    'has-background-light2'

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
    <div className={backgroundClassName}>
      <Header />
      <div className={`${styles.container} ${inter.variable} col-a-center is-10`}>
        {children}
      </div>
    </div>
  );
}
