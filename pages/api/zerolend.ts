import { NextApiRequest, NextApiResponse } from "next";
import { Contract, ethers } from "ethers";
import { UiPoolDataProvider } from "@aave/contract-helpers";
import { formatReserves, normalizeBN } from "@aave/math-utils";
import dayjs from "dayjs";
import {
  compactNumber,
  getBorrowCapData,
  getSupplyCapData,
} from "../../utils/utils";
import abi from "../../abis/abi.json";
import { formatUnits } from "ethers/lib/utils";

const chainIdToRPCProvider: Record<number, string> = {
  1: "https://eth-mainnet.alchemyapi.io/v2/demo",
  324: "https://mainnet.era.zksync.io",
  169: "https://pacific-rpc.manta.network/http",
  81457: "https://rpc.ankr.com/blast",
  8453: "https://mainnet.base.org",
  59144: "https://rpc.linea.build",
};

const chainIdToExplorerUrl: Record<number, string> = {
  1: "https://etherscan.io",
  324: "https://explorer.zksync.io",
  169: "https://pacific-explorer.manta.network",
  81457: "https://blastexplorer.io",
  8453: "https://basescan.org",
  59144: "https://lineascan.build",
};

type configInterface = {
  chainId: string;
  marketName: string;
  protocol: string;
  lendingPoolAddressProvider: string;
  uiDataProvider: string;
  pool: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const config: configInterface = {
    chainId: req.query.chainId as string,
    marketName: req.query.marketName as string,
    protocol: req.query.protocol as string,
    lendingPoolAddressProvider: req.query.lendingPoolAddressProvider as string,
    uiDataProvider: req.query.uiDataProvider as string,
    pool: req.query.pool as string,
  };

  const currentTimestamp = dayjs().unix();

  const lendingPoolAddressProvider = config.lendingPoolAddressProvider;

  const chainId: number = parseInt(config.chainId, 10);

  const provider = new ethers.providers.StaticJsonRpcProvider(
    chainIdToRPCProvider[chainId],
    chainId
  );

  try {
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: config.uiDataProvider,
      provider,
      chainId,
    });

    const poolContract = new Contract(config.pool, abi, provider);
    let paused = false;
    if (config.protocol === "v2") {
      // const abi = ["function paused() public view returns (bool)"];
      paused = await poolContract.paused();

      // console.log()
    }

    // console.log(
    //   "FLASHLOAN_PREMIUM_TOTAL",
    //   formatUnits(await poolContract.FLASHLOAN_PREMIUM_TO_PROTOCOL(), 0)
    // );

    const flashloanPremium = formatUnits(
      await poolContract.FLASHLOAN_PREMIUM_TO_PROTOCOL(),
      0
    );

    const reserves = await poolDataProviderContract.getReservesHumanized({
      lendingPoolAddressProvider,
    });

    const formattedPoolReserves = formatReserves({
      reserves: reserves.reservesData,
      currentTimestamp,
      marketReferenceCurrencyDecimals:
        reserves.baseCurrencyData.marketReferenceCurrencyDecimals,
      marketReferencePriceInUsd:
        reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    // console.log(formattedPoolReserves);
    const reservesArray = formattedPoolReserves.map((n) => ({
      symbol: n.symbol,
      frozen: n.isFrozen ? "True" : "False",
      paused: n.isPaused ? "True" : "False",
      canCollateral: n.usageAsCollateralEnabled ? "True" : "False",
      LTV: parseInt(n.baseLTVasCollateral) / 100 + " %",
      liqThereshold: parseInt(n.reserveLiquidationThreshold) / 100 + " %",
      liqBonus: parseInt(n.reserveLiquidationBonus.slice(-3)) / 100 + " %",
      reserveFactor: parseFloat(n.reserveFactor) * 100 + " %",
      canBorrow: n.borrowingEnabled ? "True" : "False",
      optimalUtilization:
        ((parseInt(n.optimalUsageRatio) / 10 ** 27) * 100).toFixed(0) + " %",
      varBorrowRate: (parseFloat(n.variableBorrowAPY) * 100).toFixed(2) + " %",
      canBorrowStable: n.stableBorrowRateEnabled ? "True" : "False",
      stableBorrowRate: (parseFloat(n.stableBorrowAPY) * 100).toFixed(2) + " %",
      shareOfStableRate:
        parseInt(n.totalDebtUSD) === 0 || parseInt(n.totalStableDebtUSD) === 0
          ? "0%"
          : (
              (parseInt(n.totalStableDebtUSD) / parseInt(n.totalDebtUSD)) *
              100
            ).toFixed(2) + "%",
      isIsolated: n.debtCeiling === "0" ? "False" : "True",
      debtCeiling: parseFloat(n.debtCeiling) / 100,
      isolationModeTotalDebtUSD: parseFloat(n.isolationModeTotalDebtUSD),
      availableDebtCeilingUSD: parseFloat(n.availableDebtCeilingUSD),
      supplyCap: parseFloat(n.supplyCap),
      borrowCap: parseFloat(n.borrowCap),
      eModeLtv: n.eModeLtv / 100 + " %",
      eModeLiquidationThereshold: n.eModeLiquidationThreshold / 100 + " %",
      totalDebt: parseFloat(n.totalDebt),
      totalLiquidity: parseFloat(n.totalLiquidity),
      eModeLiquidationBonus:
        parseInt(n.eModeLiquidationBonus.toString().slice(-3)) / 100 + " %",
      borrowableInIsolation: n.borrowableInIsolation ? "True" : "False",
      flashloanEnabled: n.flashLoanEnabled ? "True" : "False",
      supplyCapUtilized: isNaN(getSupplyCapData(n).supplyCapUsage)
        ? "N/A"
        : getSupplyCapData(n).supplyCapUsage.toFixed(2) + " %",
      borrowCapUtilized: isNaN(getBorrowCapData(n).borrowCapUsage)
        ? "N/A"
        : getBorrowCapData(n).borrowCapUsage.toFixed(2) + " %",
      utilizationRate:
        n.borrowUsageRatio === "0" || !n.borrowUsageRatio
          ? "N/A"
          : (parseFloat(n.borrowUsageRatio) * 100).toFixed(2) + " %",
      priceOracleAddress: n.priceOracle,
      oraclePrice: parseFloat(n.priceInUSD),
      explorer: chainIdToExplorerUrl[chainId],
      aToken: n.aTokenAddress,
      varAToken: n.variableDebtTokenAddress,
      underlying: n.underlyingAsset,
      interestRateAddress: n.interestRateStrategyAddress,
      assetLink:
        "https://app.zerolend.xyz/reserve-overview/?underlyingAsset=" +
        n.id.slice(n.id.indexOf("-") + 1, n.id.lastIndexOf("-")) +
        "&marketName=" +
        config.marketName,
    }));

    res.status(200).json({ data: reservesArray, flashloanPremium });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "failed to fetch data" });
  }
}
