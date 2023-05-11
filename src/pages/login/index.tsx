import { useState, ChangeEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form } from 'react-bulma-components';

import { signIn } from "next-auth/react"
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import useToast from '@/hooks/useToast';
import { error_log } from '@/hooks/util';

import styles from './index.module.scss'


// export const getServerSideProps = async (ctx: any) => {
//   const session: any = await getSession(ctx)

//   if (session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session }
//   };
// };


export default function Login() {
  const idRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const passwordRegex = /^[A-Za-z\d$@$!%*?&\-=_+]{8,}$/;
  const { data: session }: any = useSession()

  const router = useRouter();
  const { showToast } = useToast();

  const [idField, setIdField] = useState({
    email: '',
    placeholder: 'glide@gmail.com',
    state: '',
    available: false,
  });

  const [passwordField, setPasswordField] = useState({
    password: '',
    placeholder: undefined,
    state: '',
    available: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session])

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;

    setIdField((prevState) => ({
      ...prevState,
      email,
      available: idRegex.test(email),
      state: email === '' ? '' : idRegex.test(email) ? 'success' : 'danger',
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;

    setPasswordField((prevState) => ({
      ...prevState,
      password,
      available: passwordRegex.test(password),
      state: password === '' ? '' : passwordRegex.test(password) ? 'success' : 'danger',
    }));
  };
  
  const login = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await _login();
    setIsLoading(false);
  };
  
  const _login = async () => {
    if (!idField.available) {
      return document.getElementById('input-id')?.focus();
    } else if (!passwordField.available) {
      return document.getElementById('input-password')?.focus();
    }

    try {
      const response = await signIn('credentials', { 
        email: idField.email, 
        password: passwordField.password, 
        redirect: false, 
      });

      if (response.status === 200) {
        return showToast({ message: '로그인 성공!', status: 'success'});
      } else {
        return showToast({ message: '로그인 실패, ID와 비밀번호를 다시한번 확인해 주세요.' });
      }
    } catch (e: any) {
      showToast({ message: e.response?.data?.message ?? '로그인 실패'});
      error_log(e);
    }
  };


  return (
    <section id="login" className={`${styles.page} col-a-center mt-5 mb-6`}>
      <div className="col-a-center has-text-centered">
        <Image src="/icons/pinata.png" alt="Pinata" width={144} height={144} priority className="mb-4" />

        <h1>
          Welcome to <Image src="/icons/title/glide-30.svg" alt="Glide" width={72} height={23} priority />
        </h1>
        <h2 className="mt-2">Your personalized AI Tutor for TOEFL</h2>
      </div>

      <div className="form-fields mt-5">
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Email</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // type={idField.state}
              // message={[
              //   { '이 입력란을 작성하세요.': idField.id === '' },
              //   { '이메일 형식': idField.id !== '' && idField.available === false },
              // ]}
            >
              <Form.Control>
                <Form.Input
                  id="input-id"
                  value={idField.email}
                  color={idField.state}
                  placeholder={idField.placeholder}
                  required
                  onInput={handleIdChange}
                />
              </Form.Control>
            </Form.Field>
          </div>
        </div>

        <div className="form-field">
          <div className="form-field__title space-between">
            <span className="bold">Password</span>
            {/* <Link id="btn-find-password" href="/login/find-password" className={`${styles.btnFindPassword} has-text-grey-dark underline`}>
              Forgot your password?
            </Link> */}
          </div>
          <div className="form-field__input">
            <Form.Field
              // type={passwordField.state}
              // message={[
              //   { '이 입력란을 작성하세요.': passwordField.password === '' },
              //   { '최소 8자': passwordField.password !== '' && passwordField.available === false },
              // ]}
            >
              <Form.Control>
                <Form.Input
                  id="input-password"
                  value={passwordField.password}
                  color={passwordField.state}
                  placeholder={passwordField.placeholder}
                  type="password"
                  required
                  onInput={handlePasswordChange}
                  // onPaste={(e) => e.preventDefault()}
                  onKeyPress={(e) => e.key === 'Enter' && login()}
                />
              </Form.Control>
            </Form.Field>
          </div>
        </div>
      </div>

      <Button
        className={`btn-submit is-primary rounded-3 mt-3 ${isLoading ? 'is-loading' : ''}`}
        disabled={isLoading}
        onClick={login}
      >
        Log in
      </Button>

      <p id="bottom" className={`${styles.bottom} my-5`}>
        계정이 없으세요?&nbsp;
        <Link href="/login/signup" className="underline has-text-grey-dark">
          회원가입
        </Link>
      </p>
    </section>
  );
}   