import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import BooleanRenderer from "./cells/BooleanRenderer";
import LinkRenderer from "./cells/LinkRenderer";
import NumberRenderer from "./cells/NumberRenderer";
import React, { useRef, } from "react";
import { Aavev3 } from "../utils/interfaces";
import NumberRendererWithUSD from "./cells/NumberRendererWithUSD";
import { prettyNumber } from "@based/pretty-number";
import { Box, Button } from "@mui/material";

interface IProps {
    id: string
    name: string
    data: Aavev3[];
    flashLoanPremium: number | string | undefined;
}

const InfoDatatable = (props: IProps) => {
    const columnDefs: ColDef[] = [
        {
            field: "label",
            headerName: "Label",
            maxWidth: 200,
            cellStyle: { fontWeight: 'bold' },
        },
        {
            field: "valueUSD", headerName: 'Value', width: 150,
            valueGetter: (a) => a.data.value ? a.data.value : a.data.valuePercentage > 0 ? a.data.valuePercentage : `${prettyNumber(a.data.valueUSD, 'number-short')} USD`,
            cellRenderer: NumberRenderer,
        },
    ];

    const fees = props.data.reduce((curr, prev) => curr + prev.feesAnnual, 0)
    const revenue = props.data.reduce((curr, prev) => curr + prev.revenueAnnual, 0)

    const totalBorrowed = props.data.reduce((curr, prev) => curr + (prev.totalDebt * Number(prev.oraclePrice)), 0)
    const totalSupplied = props.data.reduce((curr, prev) => curr + (prev.totalLiquidity * Number(prev.oraclePrice)), 0)


    const rowData = [
        {
            label: 'Market Name',
            value: props.name,
            valueUSD: 0,
            valuePercentage: `0 %`
        },
        {
            label: 'Revenue Monthly',
            value: 0,
            valueUSD: Math.floor(revenue / 12),
            valuePercentage: `0 %`
        },
        {
            label: 'Total Borrowed',
            // value: props.flashLoanPremium,
            valueUSD: totalBorrowed,
            valuePercentage: `0 %`
        },
        {
            label: 'Market Size',
            // value: props.flashLoanPremium,
            valueUSD: totalBorrowed + totalSupplied,
            valuePercentage: `0 %`
        },
        // {
        //     label: 'Revenue Daily',
        //     value: 0,
        //     valueUSD: Math.floor(revenue / 365),
        //     valuePercentage: `0 %`
        // },
        // {
        //     label: 'Revenue Annually',
        //     value: 0,
        //     valueUSD: Math.floor(revenue),
        //     valuePercentage: `0 %`
        // },
        // {
        //     label: 'Flashloan Premium',
        //     // value: props.flashLoanPremium,
        //     valueUSD: 0,
        //     valuePercentage: `${props.flashLoanPremium} %`
        // },
        {
            label: 'Total Supplied',
            // value: props.flashLoanPremium,
            valueUSD: totalSupplied,
            valuePercentage: `0 %`
        },
        // {
        //     label: 'Fees Annually',
        //     value: 0,
        //     valueUSD: fees,
        //     valuePercentage: `0 %`
        // }
    ]

    return (
        <div
            style={{ display: 'inline-block', marginRight: 5 }}
            className={
                "ag-theme-quartz"
            }
            id="info-datatable"
        >
            <AgGridReact rowData={rowData} columnDefs={columnDefs} />
            <Box mt={2}>
                <Button fullWidth variant='contained' href={"/config?market=" + props.id}>Open Market</Button>
            </Box>
            <br />
        </div>
    );
};

export default InfoDatatable
