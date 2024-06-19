import React, { ReactNode } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { NextPage } from "next";
import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <>
      <NextNProgress color="#162CF1" />
      <Head>
        <link rel="shortcut icon" href="/LogoWhite.ico" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
}

export default MyApp;
