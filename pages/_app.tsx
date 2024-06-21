import React, { ReactNode } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { NextPage } from "next";
import "../styles/globals.css";
import localFont from "@next/font/local";
import { DefaultSeo } from "next-seo";
import useGlobalStore from "@/store/global";
import Toast from "@/components/common/toast/toast";

const geologica = localFont({ src: "../public/fonts/geologica.ttf" });

const seo = {
  title: "Choose POS - Best Restaurant POS in the USA",
  description:
    "A new age restaurant POS built on cutting edge technology using data and insights to drive real growth and customer engagement.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.yourwebsite.com",
    site_name: "Choose POS",
    images: [
      {
        url: "https://www.yourwebsite.com/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Og Image Alt",
      },
    ],
    canonical: "https://www.yourwebsite.com",
  },
  twitter: {
    handle: "@twitterhandle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page: ReactNode) => page);
  const { toastData } = useGlobalStore();

  return (
    <div className={geologica.className}>
      <NextNProgress color="#162CF1" />
      <Head>
        <link rel="shortcut icon" href="/LogoWhite.ico" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <DefaultSeo {...seo} />
      {getLayout(<Component {...pageProps} />)}
      {toastData && <Toast message={toastData.message} type={toastData.type} />}
    </div>
  );
}

export default MyApp;
