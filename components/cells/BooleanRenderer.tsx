import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';
import Image from 'next/image'

const BooleanRenderer = (params: CustomCellRendererProps) => (
    // {consol.log(params.value)}
    <span className="missionSpan">
        <div style={{ textAlign: 'center' }}>

            <img
                alt='icon'
                src={`https://www.ag-grid.com/example-assets/icons/${params.value == 'True' ? 'tick-in-circle' : 'cross-in-circle'
                    }.png`}
                className="missionIcon"
            />
        </div>
    </span>
);

export default BooleanRenderer
