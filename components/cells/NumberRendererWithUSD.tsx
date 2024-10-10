import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const NumberRendererWithUSD = (params: CustomCellRendererProps) => (
    <span className="missionSpan" style={{
        opacity: params.value === '0' || params.value === '0%' || params.value === '0.00%' || params.value === 'N/A' ? 0.3 : 1,
        lineHeight: 1,
        textAlign: 'center',
    }}>
        <div style={{
            paddingTop: '5px',
            display: 'flex',
            flexDirection: 'column'

        }}>
            <span style={{}}>{params.value}</span>
            <span style={{ marginTop: 5, fontSize: 10, opacity: 0.5 }}>??? USD</span>

        </div>
    </span>
);

export default NumberRendererWithUSD
