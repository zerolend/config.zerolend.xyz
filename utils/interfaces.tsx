interface TableHeader {
  name: string;
  key: string;
  isPercent?: boolean;
  hasURL?: boolean;
  textForURL?: string;
}

interface Aavev2 {
  symbol: string;
  frozen: string;
  paused: string;
  canCollateral: string;
  LTV: string;
  liqThereshold: string;
  liqBonus: string;
  reserveFactor: string;
  canBorrow: string;
  optimalUtilization: string;
  varBorrowRate: string;
  canBorrowStable: string;
  stableBorrowRate: string;
  shareOfStableRate: string;
  assetLink: string;
}

interface Aavev3 {
  symbol: string;
  frozen: string;
  paused: string;
  canCollateral: string;
  LTV: string;
  liqThereshold: string;
  liqBonus: string;
  reserveFactor: string;
  canBorrow: string;
  optimalUtilization: string;
  varBorrowRate: string;
  canBorrowStable: string;
  stableBorrowRate: string;
  shareOfStableRate: string;
  isolationModeTotalDebtUSD: number,
  availableDebtCeilingUSD: number,
  totalDebt: number,
  totalLiquidity: number,
  debtCeiling: string;
  supplyCap: number;
  borrowCap: number;
  eModeLtv: string;
  eModeLiquidationThereshold: string;
  eModeLiquidationBonus: string;
  assetLink: string;

  priceOracleAddress: string
  oraclePrice: string
  explorer: string
  aToken: string
  varAToken: string
  underlying: string
  interestRateAddress: string
}

interface Benqi {
  symbol: string;
  collateralFactor: string;
  reserveFactor: string;
  closeFactor: string;
  liquidationIncentive: string;
  assetLink?: string;
}

export type assetType = Aavev2 | Aavev3 | Benqi;

export type { Aavev2, Aavev3, Benqi, TableHeader };
