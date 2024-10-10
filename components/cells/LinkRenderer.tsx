import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const LinkRenderer = (params: CustomCellRendererProps) => {
    console.log(params)
    return (
        <a href={params.value.link} target='_blank' rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
            {params.value.title}
        </a>

    )
};

export default LinkRenderer
