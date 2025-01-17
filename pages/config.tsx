import { CssBaseline, SelectChangeEvent, } from "@mui/material";
import { Aavev3, } from "../utils/interfaces";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { markets } from "../utils/markets";
import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import Head from "next/head";
import Datatable from "../components/Datatable";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import zerolendService from "../services/zerolend";
import InfoDatatable from "../components/InfoDatatable";
import "../styles/Home.module.css"
import { useLocation } from "react-router-dom";

const Home: NextPage = () => {
  const [market, setMarket] = useState<{
    name: string;
    config: {
      chainId: number;
      publicJsonRPCUrl: string;
      LENDING_POOL_ADDRESS_PROVIDER: string;
      UI_POOL_DATA_PROVIDER: string;
      POOL: string;
      marketName: string;
    };
  }>(markets[0]);

  const [data, setData] = useState<Aavev3[]>([]);


  useEffect(() => {
    const match = window.location.search.match(/market=([^&]*)/)
    if (match) {
      const market = markets.find(
        (n) => n.config.marketName === match[1]
      );

      if (!market) return;

      setMarket(market)
      zerolendService(market.config, 'zerolend').then((data) => {
        setData(data?.data);
      });
    }
  }, []);



  const theme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      fontFamily: "Roboto Mono",
      fontSize: 12,
    },
  });

  return (
    <div className={styles.container} suppressHydrationWarning>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>config.zerolend.xyz</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        </Head>
        {/* <Dropdown
          selectedMarket={selectedMarket}
          market={markets.zerolend}
          handleMarketChange={handleMarketChange}
        /> */}

      </ThemeProvider>
      <br />
      <InfoDatatable name={market.name} data={data} id={market.config.marketName} flashLoanPremium={0} />
      <Datatable data={data} />
    </div>
  );
};

export default Home;
