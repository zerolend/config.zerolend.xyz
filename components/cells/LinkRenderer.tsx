import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const LinkRenderer = (params: CustomCellRendererProps) => {
    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(params.value.copy);
        alert('Copied to clipboard');
    }
    return (
        <span style={{ display: 'flex', fontFamily: params.value.copy ? 'monospace' : 'inherit', alignItems: 'center', justifyItems: 'center', color: 'blue', }}>
            <a href={params.value.link} target='_blank' rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                {params.value.title}
            </a>&nbsp;
            {params.value.copy &&
                (<ContentCopyIcon onClick={onClick} fontSize='small' style={{ cursor: 'pointer' }} color='inherit' />)
            }
        </span>

    )
};

export default LinkRenderer
