import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import BooleanRenderer from "./cells/BooleanRenderer";
import LinkRenderer from "./cells/LinkRenderer";
import NumberRenderer from "./cells/NumberRenderer";
import React, { useRef, } from "react";
import { Aavev3 } from "../utils/interfaces";
import { prettyNumber } from '@based/pretty-number'
import NumberRendererWithUSD from "./cells/NumberRendererWithUSD";

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

    const columnDefs: ColDef[] = [
        {
            field: "symbol",
            maxWidth: 200,
            pinned: "left",
            cellStyle: { fontWeight: 'bold' },
        },
        { field: "frozen", width: 100, cellRenderer: BooleanRenderer },
        { field: "paused", width: 100, cellRenderer: BooleanRenderer },
        { field: "canCollateral", headerName: 'Collateral', width: 100, cellRenderer: BooleanRenderer },
        { field: "canBorrow", headerName: 'Borrowable', width: 120, cellRenderer: BooleanRenderer },
        { field: "isIsolated", headerName: 'Isolated', width: 100, cellRenderer: BooleanRenderer },
        { field: "flashloanEnabled", headerName: 'Flasloans', width: 100, cellRenderer: BooleanRenderer },

        {
            valueGetter: (a) => `${prettyNumber(a.data.totalLiquidity, 'number-short')} ${a.data.symbol}`,
            headerName: 'Supplied', width: 125, cellRenderer: NumberRendererWithUSD
        },
        {
            valueGetter: (a) => `${prettyNumber(a.data.totalDebt, 'number-short')} ${a.data.symbol}`,
            headerName: 'Borrowed', width: 125, cellRenderer: NumberRendererWithUSD
        },
        { field: "utilizationRate", headerName: 'U%', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Utilization Percentage" },

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
        { field: "reserveFactor", headerName: 'RF %', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Reserve Factor" },
        { valueGetter: () => 'TODO', headerName: 'Liq Fee %', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Liquidation Protocol Fee" },
        { field: "optimalUtilization", headerName: 'OU %', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Optimal Utilization" },
        { field: "varBorrowRate", headerName: 'VarB %', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Variable Borrow Rate" },
        {
            valueGetter: (a) => `${prettyNumber(a.data.debtCeiling, 'number-short')} USD`,
            headerName: 'Debt Ceiling', width: 125, cellRenderer: NumberRenderer
        },
        {
            valueGetter: (a) => `${prettyNumber(a.data.supplyCap, 'number-short')} ${a.data.symbol}`,
            field: "supplyCap", headerName: 'Supply Cap', width: 125, cellRenderer: NumberRendererWithUSD
        },
        {
            valueGetter: (a) => `${prettyNumber(a.data.borrowCap, 'number-short')} ${a.data.symbol}`,
            field: "borrowCap", headerName: 'Borrow Cap', width: 125, cellRenderer: NumberRendererWithUSD
        },
        { field: "supplyCapUtilized", headerName: 'Supply Cap %', width: 150, cellRenderer: NumberRendererWithUSD },
        { field: "borrowCapUtilized", headerName: 'Borrow Cap %', width: 150, cellRenderer: NumberRendererWithUSD },
        {

            valueGetter: (a) => a.data.debtCeiling === 0 ? '0.00 %' : `${(a.data.isolationModeTotalDebtUSD * 100 / a.data.debtCeiling).toFixed(2)} %`,
            headerName: 'Debt Ceiling %', width: 150, cellRenderer: NumberRendererWithUSD
        },
        { field: "eModeLtv", headerName: 'eMode LTV', width: 125, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationThereshold", headerName: 'eMode LT', width: 100, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationBonus", headerName: 'eMode LB', width: 100, cellRenderer: NumberRenderer },
        {
            valueGetter: (a) => `${prettyNumber(a.data.oraclePrice, 'number-short')} USD`,
            field: "oraclePrice", headerName: 'Price', width: 100, cellRenderer: NumberRenderer
        },
        {
            valueGetter: (a) => extractContract(a.data, 'priceOracleAddress'),
            headerName: 'Oracle', width: 175, cellRenderer: LinkRenderer
        },
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
            style={{ height: "800px", width: "100%", textAlign: 'center' }}
            className={
                "ag-theme-quartz"
            }
        >
            <AgGridReact
                ref={gridRef}
                tooltipShowMode='standard'
                tooltipShowDelay={500}
                rowData={props.data}
                columnDefs={columnDefs}
            />
        </div>
    );
};

export default Datatable
