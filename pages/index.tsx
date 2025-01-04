import { CssBaseline } from "@mui/material";
import { Aavev3, } from "../utils/interfaces";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { markets } from "../utils/markets";
import { useState, useEffect, useCallback, useMemo } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import zerolendService from "../services/zerolend";
import InfoDatatable from "../components/InfoDatatable";
import "../styles/Home.module.css"
import { prettyNumber } from "@based/pretty-number";

interface Market {
  name: string;
  revenueMonthly: number
  totalBorrowed: number
  totalSupplied: number
  data: Aavev3[];
  flashloanPremium: number;
}

const Home: NextPage = () => {
  const [datas, setDatas] = useState<Market[]>([]);

  const downloadMarkets = useCallback(async () => {
    for (let i = 0; i < markets.length; i++) {
      const market = markets[i];
      const data = await zerolendService(market.config, 'zerolend');

      const revenue = data?.data.reduce((curr: any, prev: any) => curr + prev.revenueAnnual, 0)
      const totalBorrowed = data?.data.reduce((curr: any, prev: any) => curr + (prev.totalDebt * Number(prev.oraclePrice)), 0)
      const totalSupplied = data?.data.reduce((curr: any, prev: any) => curr + (prev.totalLiquidity * Number(prev.oraclePrice)), 0)

      setDatas((prev) => {
        const newDatas = [...prev];
        newDatas[i] = {
          name: market.name,
          revenueMonthly: revenue / 12 / (market.name == 'linea' ? 2 : 1),
          totalBorrowed: totalBorrowed,
          totalSupplied: totalSupplied,
          data: data?.data,
          flashloanPremium: data?.flashloanPremium,
        };
        return newDatas;
      });
    }
  }, []);

  const totalBorrowed = useMemo(() => datas.reduce((curr, prev) => curr + prev.totalBorrowed, 0), [datas]);
  const totalSupplied = useMemo(() => datas.reduce((curr, prev) => curr + prev.totalSupplied, 0), [datas]);
  const totalRevenue = useMemo(() => datas.reduce((curr, prev) => curr + prev.revenueMonthly, 0), [datas]);

  useEffect(() => { downloadMarkets() }, []);

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
      </ThemeProvider>
      <h1>config.zerolend.xyz</h1>
      <p>Get a full summary of the entire zerolend protocol</p>
      <p>
        <div><b>Total Monthly Revenue</b>: {prettyNumber(totalRevenue, 'number-short')} USD</div>
        <div><b>Total Borrowed</b>: {prettyNumber(totalBorrowed, 'number-short')} USD</div>
        <div><b>Total Supplied</b>: {prettyNumber(totalSupplied, 'number-short')} USD</div>
      </p>
      <div style={{ display: 'block' }}>
        {
          datas.map(d =>
            <InfoDatatable name={d.name} data={d.data} flashLoanPremium={d.flashloanPremium} key={d.name} />
          )
        }
      </div>
    </div>
  );
};

export default Home;
