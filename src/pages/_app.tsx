import '@/styles/globals.scss';
import type { AppProps } from 'next/app';

import { SessionProvider } from 'next-auth/react';
import { Provider } from "react-redux";
import { wrapper } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

import Layout from './layout';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme';
import 'react-chat-bot/src/assets/scss/_app.scss'


export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { session, pageProps } = props;

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={null}>
        <SessionProvider session={session}>
          <ChakraProvider theme={theme} resetCSS={false} >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}