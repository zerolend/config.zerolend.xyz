import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const NumberRenderer = (params: CustomCellRendererProps) => {
    const [val, symbol] = params.value.split(' ');

    return (<span className="missionSpan" style={{ opacity: params.value === '0' || params.value === '0%' || params.value === '0.00%' || params.value === 'N/A' ? 0.3 : 1 }}>
        <span>{val}</span> <span style={{ opacity: 0.3 }}>{symbol}</span>
    </span>
    );
}

export default NumberRenderer
