import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const LinkRenderer = (params: CustomCellRendererProps) => (
    <a href={params.value} target='_blank' rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
        {params.value}
    </a>

);

export default LinkRenderer
