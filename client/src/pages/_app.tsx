import type { AppProps } from 'next/app'
import { NormalizeCSS, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.css';

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import { Provider } from "react-redux";
import { store } from "../store/store";

config.autoAddCss = false;

const App = ({ Component, pageProps }: AppProps) => {
    return (
      <>
          <NormalizeCSS />
          <MantineProvider>
              <ModalsProvider>
                  <SWRConfig
                      value={{
                          // エラー時リトライ回数
                          errorRetryCount: 0,
                          // windowフォーカス時再取得しない
                          revalidateOnFocus: false
                      }}
                  >
                        <Provider store={store}>
                            <Component {...pageProps} />
                        </Provider>
                  </SWRConfig>
              </ModalsProvider>
          </MantineProvider>
          
          <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar
              style={{ fontSize: 14, fontWeight: 'bold' }}
              limit={1}
          />
      </>
  )
}

export default App;
