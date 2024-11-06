import { marketConfig } from "../utils/marketconfig";
import { marketConfigZerolend } from "./marketconfig_zerolend";

export const markets = {
  zerolend: [
    {
      name: "linea",
      config: marketConfigZerolend.linea,
    },
    {
      name: "ethereum btc lrt",
      config: marketConfigZerolend.ethereum_btc_lrt,
    },
    {
      name: "ethereum rwa",
      config: marketConfigZerolend.ethereum_rwa,
    },
    {
      name: "base",
      config: marketConfigZerolend.base,
    },
    {
      name: "ethereum eth lrt",
      config: marketConfigZerolend.ethereum_eth_lrt,
    },
    {
      name: "zksync",
      config: marketConfigZerolend.zksync,
    },
    {
      name: "xlayer",
      config: marketConfigZerolend.xlayer,
    },
    {
      name: "manta",
      config: marketConfigZerolend.manta,
    },
    {
      name: "ziruit",
      config: marketConfigZerolend.zircuit,
    },

    {
      name: "blast",
      config: marketConfigZerolend.blast,
    },
  ],
  benqi: [
    {
      name: "avalanche",
    },
  ],
  univ3: [
    {
      name: "all",
    },
  ],
  crvv2: [
    {
      name: "all",
    },
  ],
};
