import { CustomCellRendererProps } from 'ag-grid-react';
import React from 'react';

const StringRenderer = (params: CustomCellRendererProps) => {
    const value = params.value;

    // Set default text based on eModeCategoryId value
    let displayValue = 'Unknown'; // Default value
    if (value === 0) {
        displayValue = 'stable';  // Return "stable" if eModeCategoryId is 0
    } else if (value === 1) {
        displayValue = 'destable';  // Return "destable" if eModeCategoryId is 1
    }

    // Set opacity based on specific conditions
    const opacity = value === '0' || value === '0 %' || value === '0.00 %' || value === 'N/A' ? 0.3 : 1;

    return (
        <span className="missionSpan" style={{ opacity }}>
            {displayValue}
        </span>
    );
}

export default StringRenderer;
