import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import BooleanRenderer from "./cells/BooleanRenderer";
import LinkRenderer from "./cells/LinkRenderer";
import NumberRenderer from "./cells/NumberRenderer";
import React, { useRef, } from "react";
import { Aavev3 } from "../utils/interfaces";
import { prettyNumber } from '@based/pretty-number'
import NumberRendererWithUSD from "./cells/NumberRendererWithUSD";
import StringRenderer from "./cells/StringRenderer";

interface IProps {
    data: Aavev3[];
}

const Datatable = (props: IProps) => {
    const gridRef = useRef<AgGridReact<any>>(null);

    const formatEVMAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
    const extractHolders = (data: any, key: string) => {
        return {
            link: `${data.explorer}/token/${data[key]}#balances`,
            title: formatEVMAddress(data[key]),
            copy: data[key]
        }
    }
    const extractContract = (data: any, key: string) => {
        return {
            link: `${data.explorer}/address/${data[key]}#readContract`,
            title: formatEVMAddress(data[key]),
            copy: data[key]
        }
    }
    const parseLiquidationPremium = (premiumString: string) => {
        if (!premiumString) return 0; // Default to 0 if no value exists
        const parsedValue = parseFloat(premiumString.replace('%', '').trim());
        return isNaN(parsedValue) ? 0 : parsedValue;
    };
    // Apply sticky header styles in onGridReady
    const onGridReady = (params: any) => {
        // Access the header container via the DOM
        const headerElement = document.querySelector('.ag-header') as HTMLElement;
        if (headerElement) {
            headerElement.style.position = 'sticky';
            headerElement.style.top = '0';
            headerElement.style.zIndex = '10';
            headerElement.style.backgroundColor = 'white'; // Ensure it's visible
        }
    };

    const columnDefs: ColDef[] = [
        {
            field: "symbol",
            maxWidth: 200,
            pinned: "left",
            cellStyle: { fontWeight: 'bold' },
        },
        { field: "frozen", width: 100, cellRenderer: BooleanRenderer },
        { field: "paused", width: 100, cellRenderer: BooleanRenderer },
        { field: "canBorrow", headerName: 'Borrowable', width: 120, cellRenderer: BooleanRenderer },
        { field: "isIsolated", headerName: 'Isolated', width: 100, cellRenderer: BooleanRenderer },
        { field: "borrowableInIsolation", headerName: 'Iso Borrowable', width: 140, cellRenderer: BooleanRenderer },
        { field: "flashloanEnabled", headerName: 'Flasloans', width: 100, cellRenderer: BooleanRenderer },
        {
            valueGetter: (params) => {
                const tokenAmount = prettyNumber(params.data.totalLiquidity, 'number-short');
                const symbol = params.data.symbol;
                const equivalentInUSD = `${prettyNumber((params.data.totalLiquidity * params.data.oraclePrice), 'number-short')}`;  // Assuming you have the price
                return `${tokenAmount} ${symbol} | ${equivalentInUSD}`;
            },
            headerName: 'Amt Supplied',
            width: 125,
            cellRenderer: NumberRendererWithUSD
        },
        {
            valueGetter: (params) => {
                const tokenAmount = prettyNumber(params.data.totalDebt, 'number-short');
                const symbol = params.data.symbol;
                const equivalentInUSD = `${prettyNumber((params.data.totalDebt * params.data.oraclePrice), 'number-short')}`;  // Assuming you have the price
                return `${tokenAmount} ${symbol} | ${equivalentInUSD}`;
            },
            headerName: 'Amt Borrowed',
            width: 125,
            cellRenderer: NumberRendererWithUSD
        },
        {
            valueGetter: (params) => {
                if (params.data.isIsolated) {
                    const tokenAmount = prettyNumber(params.data.isolationModeTotalDebtUSD, 'number-short');
                    const symbol = params.data.symbol;  // Assuming isolationModeTotalDebtUSD is always in USD
                    const equivalentInUSD = `${prettyNumber((params.data.isolationModeTotalDebtUSD * params.data.oraclePrice), 'number-short')}`;  // Assuming you have the price
                    return `${tokenAmount} ${symbol} | ${equivalentInUSD}`;
                }
                return '0 USD | 0';
            },
            headerName: 'Current Debt',
            width: 150,
            cellRenderer: NumberRendererWithUSD,
            headerTooltip: "Current debt for isolation mode assets"
        },


        {
            field: "LTV", headerName: "LTV %", width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Loan-to-value",

        },
        {
            field: "liqThereshold", headerName: 'LT %', width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Liquidation Thereshold",
        },
        {
            field: "liqBonus", headerName: 'LB %', width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Liquidation Bonus"
        },
        {
            headerName: 'Liquidation Premium',
            valueGetter: (params) => {
                const liquidationPremium = parseLiquidationPremium(params.data.eModeLiquidationBonus);
                return `${liquidationPremium.toFixed(2)} %`;
            },
            width: 150
        },
        {
            field: "feesAnnual", headerName: 'Fees YR', width: 125,
            valueGetter: (a) => `${prettyNumber(a.data.feesAnnual, 'number-short')} USD`,
            cellRenderer: NumberRenderer, headerTooltip: "Fees Annualy"
        },
        {
            field: "revenueDaily", headerName: 'Revenue D', width: 125,
            valueGetter: (a) => `${prettyNumber(a.data.revenueDaily, 'number-short')} USD`,
            cellRenderer: NumberRenderer, headerTooltip: "Revenue Daily"
        },
        {
            field: "revenueMonthly", headerName: 'Revenue M', width: 125,
            valueGetter: (a) => `${prettyNumber(a.data.revenueMonthly, 'number-short')} USD`,
            cellRenderer: NumberRenderer, headerTooltip: "Revenue Monthly"
        },
        {
            field: "revenueAnnual", headerName: 'Revenue YR', width: 125,
            valueGetter: (a) => `${prettyNumber(a.data.revenueAnnual, 'number-short')} USD`,
            cellRenderer: NumberRenderer, headerTooltip: "Revenue Annualy"
        },
        { field: "reserveFactor", headerName: 'RF %', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Reserve Factor" },
        { valueGetter: () => 'TODO', headerName: 'Liq Fee %', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Liquidation Protocol Fee" },
        { field: "utilizationRate", headerName: 'U%', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Utilization Percentage" },
        { field: "optimalUtilization", headerName: 'OU %', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Optimal Utilization" },
        { field: "varBorrowRate", headerName: 'VarB %', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Variable Borrow Rate" },
        {
            valueGetter: (a) => `${prettyNumber(a.data.debtCeiling, 'number-short')} USD`,
            headerName: 'Debt Ceiling', width: 125, cellRenderer: NumberRenderer
        },
        {
            valueGetter: (params) => {
                const tokenAmount = prettyNumber(params.data.supplyCap, 'number-short');
                const symbol = params.data.symbol;
                const equivalentInUSD = `${prettyNumber((params.data.supplyCap * params.data.oraclePrice), 'number-short')}`;  // Assuming you have the price
                return `${tokenAmount} ${symbol} | ${equivalentInUSD}`;
            },
            headerName: 'Supply Cap',
            width: 125,
            cellRenderer: NumberRendererWithUSD
        },
        {
            valueGetter: (params) => {
                const tokenAmount = prettyNumber(params.data.borrowCap, 'number-short');
                const symbol = params.data.symbol;
                const equivalentInUSD = `${prettyNumber((params.data.borrowCap * params.data.oraclePrice), 'number-short')}`;  // Assuming you have the price
                return `${tokenAmount} ${symbol} | ${equivalentInUSD}`;
            },
            headerName: 'Borrow Cap',
            width: 125,
            cellRenderer: NumberRendererWithUSD
        },

        { field: "supplyCapUtilized", headerName: 'Supply Cap %', width: 150, cellRenderer: NumberRenderer },
        { field: "borrowCapUtilized", headerName: 'Borrow Cap %', width: 150, cellRenderer: NumberRenderer },
        {

            valueGetter: (a) => a.data.debtCeiling === 0 ? '0.00 %' : `${(a.data.isolationModeTotalDebtUSD * 100 / a.data.debtCeiling).toFixed(2)} %`,
            headerName: 'Debt Ceiling %', width: 150, cellRenderer: NumberRenderer
        },

        { field: "eModeLtv", headerName: 'eMode LTV', width: 125, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationThereshold", headerName: 'eMode LT', width: 100, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationBonus", headerName: 'eMode LB', width: 100, cellRenderer: NumberRenderer },

        { field: "eModeCategoryId", headerName: 'Emode Category', width: 150, cellRenderer: StringRenderer },

        {
            valueGetter: (a) => `${prettyNumber(a.data.oraclePrice, 'number-short')} USD`,
            field: "oraclePrice", headerName: 'Price', width: 100, cellRenderer: NumberRenderer
        },
        {
            valueGetter: (a) => extractContract(a.data, 'priceOracleAddress'),
            headerName: 'Oracle', width: 175, cellRenderer: LinkRenderer
        },
        { valueGetter: (a) => extractHolders(a.data, 'interestRateAddress'), headerName: 'Strategy', width: 175, cellRenderer: LinkRenderer },
        { valueGetter: (a) => extractHolders(a.data, 'underlying'), headerName: 'Holders', width: 175, cellRenderer: LinkRenderer },
        { valueGetter: (a) => extractHolders(a.data, 'aToken'), headerName: 'z0 Holders', width: 175, cellRenderer: LinkRenderer },
        { valueGetter: (a) => extractHolders(a.data, 'varAToken'), headerName: 'z0varDebt Holders', width: 175, cellRenderer: LinkRenderer },
        {
            valueGetter: (a) => ({ title: 'app.zerolend.xyz', link: a.data.assetLink }),
            headerName: 'dApp Link', width: 150, cellRenderer: LinkRenderer
        },
    ];

    return (
        <div
            id="main-datatable"
            // style={{ textAlign: 'center' }}
            style={{ height: 750 }}
            className={
                "ag-theme-quartz"
            }
        >
            <AgGridReact
                ref={gridRef}
                tooltipShowMode='standard'
                tooltipShowDelay={500}
                onGridReady={onGridReady}
                rowData={props.data}
                columnDefs={columnDefs}
            />
        </div>
    );
};

export default Datatable
