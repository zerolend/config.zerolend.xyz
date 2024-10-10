import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const NumberRenderer = (params: CustomCellRendererProps) => (
    <span className="missionSpan" style={{ opacity: params.value === '0' || params.value === '0%' || params.value === '0.00%' || params.value === 'N/A' ? 0.3 : 1 }}>
        {params.value}
    </span>
);

export default NumberRenderer
