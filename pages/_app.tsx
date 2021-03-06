import { Provider } from "@shopify/app-bridge-react";
import { AppProvider, Frame } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
// import { Component } from "react";
import translations from "@shopify/polaris/locales/en.json";
import Cookies from "js-cookie";
import App from "next/app";
import React from "react";
import ClientRouter from "../components/ClientRouter";
import Sidebar from "../components/Sidebar";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get("shopOrigin");
    // console.log("KET KEY: ", process.env.API_KEY);
    return (
      <Provider
        config={{
          apiKey: process.env.API_KEY,
          shopOrigin: shopOrigin,
          forceRedirect: true,
        }}
      >
        <AppProvider i18n={translations}>
          <ClientRouter />
          <Frame navigation={<Sidebar />}>
            <Component {...pageProps} />
          </Frame>
        </AppProvider>
      </Provider>
    );
  }
}

export default MyApp;
