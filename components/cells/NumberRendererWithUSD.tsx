import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const NumberRendererWithUSD = (params: CustomCellRendererProps) => {
    const [val, symbol] = params.value.split(' ');
    return (
        <span className="missionSpan" style={{
            opacity: params.value === '0' || params.value === '0 %' || params.value === '0.00 %' || params.value === 'N/A' || /^0 (.+)/.test(params.value) ? 0.3 : 1,
            lineHeight: 1,
            textAlign: 'center',
        }}>
            <div style={{
                paddingTop: '5px',
                display: 'flex',
                flexDirection: 'column'

            }}>
                <span style={{}}>
                    <span>{val}</span> <span style={{ opacity: 0.3 }}>{symbol}</span>
                </span>
                <span style={{ marginTop: 5, fontSize: 10, opacity: 0.3 }}>??? USD</span>

            </div>
        </span>
    )
};

export default NumberRendererWithUSD
