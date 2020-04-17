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
      </Head>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default App;
