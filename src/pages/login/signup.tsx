import { useState, ChangeEvent  } from 'react'
import Image from 'next/image';
import { Button, Form } from 'react-bulma-components';

import axios from '@/lib/api'
import { useRouter } from 'next/router'

import styles from './signup.module.scss'


export default function SignUp() {
  const [nameField, setNameField] = useState({
    name: '',
    available: false,
    state: '',
    placeholder: 'Username',
  })
  const [idField, setIdField] = useState({
    email: '',
    available: false,
    state: '',
    checkedId: null,
    placeholder: 'glide@gmail.com',
  })
  const [passwordField, setPasswordField] = useState({
    password: '',
    available: false,
    state: '',
    placeholder: 'Password (over 8 words)',
  })
  const [passwordField2, setPasswordField2] = useState({
    password: '',
    available: false,
    state: '',
    placeholder: 'Confirm Password',
  })
  const [tokenField, setTokenField] = useState({
    access_token: '',
    available: false,
    state: '',
    placeholder: '"흔하지 않은 영어 튜터" 페이지를 확인해주세요!',
  })
  const [isLoading, setIsLoading] = useState(false)

  const nameRegex = /^[가-힣0-9a-zA-Z]{1,16}$/
  const idRegex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  const passwordRegex = /^[A-Za-z\d$@$!%*?&\-=_+]{8,}$/ // 최소 8자

  const router = useRouter()

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const available = nameRegex.test(name)

    setNameField({
      ...nameField,
      name,
      available,
      state: available ? 'success' : 'danger',
    })
  }

  const handleIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    const available = idRegex.test(email)

    setIdField({
      ...idField,
      email,
      available: available,
      state: available ? 'success' : 'danger',
    })
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const available = passwordRegex.test(password)

    setPasswordField({
      ...passwordField,
      password,
      available,
      state: available ? 'success' : 'danger',
    })
    return available
  }

  const handlePassword2Change = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const available =
      passwordRegex.test(password) &&
      passwordField.password === password;

    setPasswordField2({
      ...passwordField2,
      password,
      available,
      state: available ? 'success' : 'danger',
    });
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const access_token = e.target.value;
    const available = !!access_token;
    setTokenField({
      ...tokenField,
      access_token,
      available,
      state: available ? 'success' : 'danger',
    });
  };

  const signUp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await _signUp();
    setIsLoading(false);
  };

  const _signUp = async () => {
    if (!nameField.available) {
      return document.getElementById('nameInput')?.focus();
    } else if (!idField.available) {
        return document.getElementById('idInput')?.focus();
    } else if (!passwordField.available) {
      return document.getElementById('passwordInput')?.focus();
    } else if (!passwordField2.available) {
      return document.getElementById('password2Input')?.focus();
    } else if (!tokenField.available) {
      return document.getElementById('tokenInput')?.focus();
    }

    const registration_data = {
      name: nameField.name,
      email: idField.email,
      password: passwordField.password,
      accessToken: tokenField.access_token,
    };

    try {
      // TODO: make an HTTP POST request to `/auth/signup` endpoint
      // and handle the response accordingly
      const response = await axios.post('/auth/signup', registration_data)
      if (response.status === 201) {
        router.push('/')
      }
      console.log(response)
    } catch (e) {
      console.error('Registration failed:', e);
    }
  };

  return (
    <section id="signup" className={`col-a-center mt-5 mb-6 ${styles.page}`}>
      <div className="col-a-center has-text-centered">
        <Image src="/icons/pinata.png" alt="Pinata" width={144} height={144} priority className="mb-4" />

        <h1>
          Join <Image src="/icons/title/glide-30.svg" alt="Glide" width={72} height={23} priority />
        </h1>
        <h2 className="mt-2">Your personalized AI Tutor for TOEFL</h2>
      </div>

      <div className="form-fields mt-5">
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Name</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // message={[
              //   { "이 입력란을 작성하세요.": nameField.name === "" },
              //   {
              //     "한글, 영문, 또는 숫자 (최대 16자리)":
              //       nameField.name !== "" && nameField.available === false,
              //   },
              // ]}
            >
              <Form.Input
                id="nameInput"
                value={nameField.name}
                color={nameField.state}
                placeholder={nameField.placeholder}
                required
                onInput={handleNameChange}
              ></Form.Input>
            </Form.Field>
          </div>
        </div>
  
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Email</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // message={[
              //   { "이 입력란을 작성하세요.": idField.id === "" },
              //   { "이메일 형식": idField.id !== "" && idField.available === false },
              //   { "사용가능한 아이디입니다.": idField.available },
              //   { "이미 가입된 아이디입니다!": idField.duplicated },
              // ]}
            >
              <Form.Input
                id="idInput"
                value={idField.email}
                color={idField.state}
                placeholder={idField.placeholder}
                required
                onInput={handleIdChange}
              ></Form.Input>
            </Form.Field>
          </div>
        </div>
  
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Password</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // message={[
              //   { "이 입력란을 작성하세요.": passwordField.password === "" },
              //   {
              //     "최소 8자":
              //       passwordField.password !== "" && passwordField.available === false,
              //   },
              //   { "사용할 수 있는 비밀번호입니다.": passwordField.available },
              // ]}
            >
              <Form.Input
                id="passwordInput"
                value={passwordField.password}
                color={passwordField.state}
                placeholder={passwordField.placeholder}
                type="password"
                required
                onInput={handlePasswordChange}
              ></Form.Input>
            </Form.Field>
          </div>
        </div>
  
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Confirm Password</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // message={[
              //   { '이 입력란을 작성하세요.': passwordField2.password === '' },
              //   {
              //     '비밀번호가 다릅니다!':
              //       passwordField2.password !== null &&
              //       passwordField.password !== passwordField2.password,
              //   },
              //   { '사용할 수 있는 비밀번호입니다.': passwordField2.available },
              // ]}
            >
              <Form.Input
                id="password2Input"
                value={passwordField2.password}
                color={passwordField2.state}
                placeholder={passwordField2.placeholder}
                type="password"
                required
                onInput={handlePassword2Change}
                // onPaste={(e) => e.preventDefault()}
              />
            </Form.Field>
          </div>
        </div>
      
        <div className="form-field">
          <div className="form-field__title">
            <span className="bold">Access Token</span>
          </div>
          <div className="form-field__input">
            <Form.Field
              // message={[{ '이 입력란을 작성하세요.': tokenField.access_token === '' }]}
            >
              <Form.Input
                id="tokenInput"
                value={tokenField.access_token}
                color={tokenField.state}
                placeholder={tokenField.placeholder}
                required
                onInput={handleTokenChange}
              />
            </Form.Field>
          </div>
        </div>
      </div>

      <Button
        className={`btn-submit is-primary rounded-3 mt-4 ${isLoading ? 'is-loading' : ''}`}
        disabled={isLoading}
        onClick={signUp}
      >
        Join
      </Button>
    </section>
  );
};