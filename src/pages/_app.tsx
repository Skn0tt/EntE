import "typeface-roboto";
import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { Wrapper } from "../ui/Wrapper";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Wrapper>
      <Head>
        <title>EntE</title>

        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#2196f3" />
      </Head>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default App;
