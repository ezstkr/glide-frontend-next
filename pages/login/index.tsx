import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Form } from 'react-bulma-components';
import styles from './index.module.scss'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function Login() {
  const idInput = useRef()
  const passwordInput = useRef()

  const [idField, setIdField] = useState({
    id: '',
    placeholder: 'glide@gmail.com',
    state: '',
    available: true,
  });

  const [passwordField, setPasswordField] = useState({
    password: '',
    placeholder: undefined,
    state: '',
    available: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const idTyping = () => {
    // Implement your idTyping function here
  };

  const passwordCheck = () => {
    // Implement your passwordCheck function here
  };

  const login = () => {
    // Implement your login function here
  };

  return (
    <section id="login" className={`${styles.page} col-a-center mt-5 mb-6`}>
      <div className="col-a-center has-text-centered">
        <Image src="/icons/pinata.png" width={144} height={144} priority alt="Pinata" className="mb-4" />

        <h1 className={inter.className}>
          Welcome to <Image src="/icons/title/glide-30.svg" width={30} height={30} alt="Glide" />
        </h1>
        <h2 className={`${inter.className} mt-2`}>Your personalized AI Tutor for TOEFL</h2>
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
                  // ref={idInput}
                  value={idField.id}
                  placeholder={idField.placeholder}
                  required
                  onInput={idTyping}
                />
              </Form.Control>
            </Form.Field>
          </div>
        </div>

        <div className="form-field">
          <div className="form-field__title space-between">
            <span className="bold">Password</span>
            {/* <Link id="btn-find-password" href="/login/find-password" className="has-text-grey-dark underline">
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
                  // ref={passwordInput}
                  value={passwordField.password}
                  placeholder={passwordField.placeholder}
                  type="password"
                  required
                  onInput={passwordCheck}
                  onPaste={(e) => e.preventDefault()}
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

      <p id="bottom" className="my-5">
        계정이 없으세요?&nbsp;
        <Link href="/login/signup" className="underline has-text-grey-dark">
          회원가입
        </Link>
      </p>
    </section>
  );
}   