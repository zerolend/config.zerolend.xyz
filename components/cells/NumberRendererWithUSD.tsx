import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const NumberRendererWithUSD = (params: CustomCellRendererProps) => {
    //  const [val, symbol] = params.value.split(' ');
    const [tokenAmount, equivalentInUSD] = params.value.split('|');  // Split token value and USD equivalent
    const [val, symbol] = tokenAmount.trim().split(' ');  // Separate token amount and symbol
   

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
                {
                    equivalentInUSD ?
                        <span style={{ marginTop: 5, fontSize: 10, opacity: 0.3 }}>{equivalentInUSD} USD</span> :
                        <span style={{ marginTop: 5, fontSize: 10, opacity: 0.3 }}>??? USD</span>
                }


            </div>
        </span>
    )
};

export default NumberRendererWithUSD
