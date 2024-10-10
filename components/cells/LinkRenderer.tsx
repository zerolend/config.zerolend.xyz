import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const LinkRenderer = (params: CustomCellRendererProps) => {
    const [open, setOpen] = React.useState(false);

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(params.value.copy);
        setOpen(true);
        setTimeout(() => setOpen(false), 1000)
    }

    const Icon = open ? CheckIcon : ContentCopyIcon;
    return (
        <>
            <span style={{ display: 'flex', fontFamily: params.value.copy ? 'monospace' : 'inherit', alignItems: 'center', justifyItems: 'center', color: 'blue', }}>
                <a href={params.value.link} target='_blank' rel="noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                    {params.value.title}
                </a>&nbsp;
                {params.value.copy &&
                    (<Icon onClick={onClick} fontSize='small' style={{ cursor: 'pointer' }} color='inherit' />)
                }
            </span>
        </>

    )
};

export default LinkRenderer
