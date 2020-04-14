import * as React from "react";
import { AppProps } from "next/app";
import { Wrapper } from "../ui/Wrapper";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default App;
