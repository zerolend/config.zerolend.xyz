import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import BooleanRenderer from "./cells/BooleanRenderer";
import LinkRenderer from "./cells/LinkRenderer";
import NumberRenderer from "./cells/NumberRenderer";
import React, { useRef, } from "react";
import { Aavev3 } from "../utils/interfaces";
import NumberRendererWithUSD from "./cells/NumberRendererWithUSD";

interface IProps {
    data: Aavev3[];
}

const Datatable = (props: IProps) => {
    const gridRef = useRef<AgGridReact<any>>(null);

    const columnDefs: ColDef[] = [
        {
            field: "symbol",
            maxWidth: 150,
            pinned: "left",
            cellStyle: { fontWeight: 'bold' },
        },
        { field: "frozen", width: 100, cellRenderer: BooleanRenderer },
        { field: "paused", width: 100, cellRenderer: BooleanRenderer },
        { field: "canCollateral", headerName: 'Collateral', width: 100, cellRenderer: BooleanRenderer },
        { field: "canBorrow", headerName: 'Borrowable', width: 120, cellRenderer: BooleanRenderer },
        { field: "isIsolated", headerName: 'Isolated', width: 100, cellRenderer: BooleanRenderer },
        { field: "flashloanEnabled", headerName: 'Flasloans', width: 100, cellRenderer: BooleanRenderer },

        { valueGetter: () => 'TODO', headerName: 'Supplied', width: 125, cellRenderer: NumberRendererWithUSD },
        { valueGetter: () => 'TODO', headerName: 'Borrowed', width: 125, cellRenderer: NumberRendererWithUSD },

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

        { field: "utilizationRate", headerName: 'U%', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Utilization Percentage" },
        { field: "optimalUtilization", headerName: 'OU %', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Optimal Utilization" },
        { field: "varBorrowRate", headerName: 'VarB %', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Variable Borrow Rate" },

        { field: "debtCeiling", headerName: 'Debt Ceiling', width: 125, cellRenderer: NumberRenderer },
        { field: "supplyCap", headerName: 'Supply Cap', width: 125, cellRenderer: NumberRendererWithUSD },
        { field: "borrowCap", headerName: 'Borrow Cap', width: 125, cellRenderer: NumberRendererWithUSD },

        { field: "supplyCapUtilized", headerName: 'Supply Cap %', width: 150, cellRenderer: NumberRendererWithUSD },
        { field: "borrowCapUtilized", headerName: 'Borrow Cap %', width: 150, cellRenderer: NumberRendererWithUSD },
        { valueGetter: () => 'TODO', headerName: 'Debt Ceiling %', width: 150, cellRenderer: NumberRendererWithUSD },


        { field: "eModeLtv", headerName: 'eMode LTV', width: 125, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationThereshold", headerName: 'eMode LT', width: 100, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationBonus", headerName: 'eMode LB', width: 100, cellRenderer: NumberRenderer },
        { field: "oraclePrice", headerName: 'Price', width: 100, cellRenderer: NumberRenderer },
        { field: "priceOracleAddress", headerName: 'Oracle', width: 125, cellRenderer: LinkRenderer },
        { field: "assetLink", headerName: 'dApp Link', width: 125, cellRenderer: LinkRenderer },
        { valueGetter: () => 'TODO', headerName: 'Holders', width: 125, },
        { valueGetter: () => 'TODO', headerName: 'z0 Holders', width: 125, },
        { valueGetter: () => 'TODO', headerName: 'z0varDebt Holders', width: 175, },
    ];

    return (
        <div
            style={{ height: "800px", width: "100%" }}
            className={
                "ag-theme-quartz"
            }
        >
            <AgGridReact<any>
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
