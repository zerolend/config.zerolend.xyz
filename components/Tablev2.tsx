import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import BooleanRenderer from "./cells/BooleanRenderer";
import LinkRenderer from "./cells/LinkRenderer";
import NumberRenderer from "./cells/NumberRenderer";
import React, { useRef, } from "react";
import { Aavev3 } from "../utils/interfaces";

interface IProps {
    data: Aavev3[];
}

const GridExample = (props: IProps) => {
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
        {
            field: "LTV", width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Loan-to-value",

        },
        {
            field: "liqThereshold", headerName: 'LT', width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Liquidation Thereshold",
        },
        {
            field: "liqBonus", headerName: 'LB', width: 75, cellRenderer: NumberRenderer,
            headerTooltip: "Liquidation Bonus"
        },
        { field: "reserveFactor", headerName: 'RF', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Reserve Factor" },

        { field: "debtCeiling", headerName: 'Debt Ceiling', width: 125, cellRenderer: NumberRenderer },
        { field: "supplyCap", headerName: 'Supply Cap', width: 125, cellRenderer: NumberRenderer },
        { field: "borrowCap", headerName: 'Borrow Cap', width: 125, cellRenderer: NumberRenderer },

        { field: "supplyCapUtilized", headerName: 'Supply Cap %', width: 150, cellRenderer: NumberRenderer },
        { field: "borrowCapUtilized", headerName: 'Borrow Cap %', width: 150, cellRenderer: NumberRenderer },
        { field: "utilizationRate", headerName: 'U%', width: 100, cellRenderer: NumberRenderer, headerTooltip: "Utilization Percentage" },
        { field: "optimalUtilization", headerName: 'OU', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Optimal Utilization" },
        { field: "varBorrowRate", headerName: 'VarB', width: 75, cellRenderer: NumberRenderer, headerTooltip: "Variable Borrow Rate" },

        { field: "eModeLtv", headerName: 'eMode LTV', width: 125, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationThereshold", headerName: 'eMode LT', width: 100, cellRenderer: NumberRenderer },
        { field: "eModeLiquidationBonus", headerName: 'eMode LB', width: 100, cellRenderer: NumberRenderer },
        { field: "oraclePrice", headerName: 'Price', width: 100, cellRenderer: NumberRenderer },
        { field: "priceOracleAddress", headerName: 'Oracle', width: 125, cellRenderer: LinkRenderer },
        { field: "assetLink", headerName: 'Link', width: 125, cellRenderer: LinkRenderer },
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

export default GridExample
