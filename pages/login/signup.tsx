import { useState } from 'react'
import Image from 'next/image';
import { Button, Form } from 'react-bulma-components';

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
    id: '',
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

  const nameCheck = () => {
    const available = nameRegex.test(nameField.name)
    setNameField({
      ...nameField,
      available,
      state: available ? 'is-success' : 'is-danger',
    })
  }

  const idTyping = () => {
    setIdField({
      ...idField,
      checkedId: null,
      available: idRegex.test(idField.id),
      state: idRegex.test(idField.id) ? 'is-success' : 'is-danger',
    })
  }

  const passwordCheck = () => {
    const available = passwordRegex.test(passwordField.password)
    setPasswordField({
      ...passwordField,
      available,
      state: available ? 'is-success' : 'is-danger',
    })
    return available
  }

  const passwordCheck2 = () => {
    const available =
      passwordRegex.test(passwordField.password) &&
      passwordField.password === passwordField2.password;
    setPasswordField2({
      ...passwordField2,
      available,
      state: available ? 'is-success' : 'is-danger',
    });
  };

  const tokenCheck = () => {
    const available = !!tokenField.access_token;
    setTokenField({
      ...tokenField,
      available,
      state: available ? 'is-success' : 'is-danger',
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
      email: idField.id,
      password: passwordField.password,
      accessToken: tokenField.access_token,
    };

    try {
      // TODO: make an HTTP POST request to `/auth/signup` endpoint
      // and handle the response accordingly
      console.log('Registration data:', registration_data);
    } catch (e) {
      console.error('Registration failed:', e);
    }
  };

  return (
    <section id="signup" className={`col-a-center mt-5 mb-6 ${styles.page}`}>
      <div className="has-text-centered">
        <Image src="/icons/pinata.png" width={144} height={144} priority alt="Pinata" className="mb-4" />
  
        <h1 className="has-text-black bold">
          Join <Image src="/icons/title/glide-30.svg" width={30} height={30} alt="Glide" />
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
                onInput={nameCheck}
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
                value={idField.id}
                color={idField.state}
                placeholder={idField.placeholder}
                required
                onInput={idTyping}
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
                password-reveal
                type="password"
                required
                onInput={passwordCheck}
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
                onInput={passwordCheck2}
                onPaste={(e) => e.preventDefault()}
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
                onInput={tokenCheck}
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