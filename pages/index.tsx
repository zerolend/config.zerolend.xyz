import { CssBaseline, SelectChangeEvent, } from "@mui/material";
import { Aavev3, } from "../utils/interfaces";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { markets } from "../utils/markets";
import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import Head from "next/head";
import StickyHeadTable from "../components/Tablev2";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import zerolendService from "../services/zerolend";

const Home: NextPage = () => {
  const [tableData, setTableData] = useState<Aavev3[]>([]);
  const [flashLoanPremium, setFlashloanPremium] = useState<
    number | string | undefined
  >(undefined);
  const [selectedMarket, setSelectedMarket] = useState<string>("linea");

  useEffect(() => {
    const ethereum: any = markets.zerolend.find(
      (n: { name: string }) => n.name === "linea"
    );

    zerolendService(ethereum.config, 'zerolend').then((data) => {
      setTableData(data?.data);
      setFlashloanPremium(data?.flashloanPremium);
    });
  }, []);

  const handleMarketChange = (event: SelectChangeEvent) => {
    setSelectedMarket("");
    setSelectedMarket(event.target.value);

    if (!(event.target.value === "all")) {
      const mkt = markets.zerolend.find(
        (n: { name: string }) => n.name === event.target.value
      );
      if (!mkt) return;
      zerolendService(mkt.config, 'zerolend').then((data) => {
        setTableData(data?.data);
        setFlashloanPremium(data?.flashloanPremium);
      });
    }
  };

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
    <div className={styles.container}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>config.zerolend.xyz</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        </Head>
        <Dropdown
          selectedMarket={selectedMarket}
          market={markets.zerolend}
          handleMarketChange={handleMarketChange}
        />

      </ThemeProvider>
      <StickyHeadTable data={tableData} />
    </div>
  );
};

export default Home;
