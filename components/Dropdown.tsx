import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { ReactNode } from "react"

const Dropdown = (props: { selectedMarket: string; handleMarketChange: ((event: SelectChangeEvent<any>, child: ReactNode) => void) | undefined; market: any[] }) => {
  return (
    <Box sx={{ display: 'flex', margin: 'auto', width: 500, p: 3 }}>
      <FormControl sx={{ width: 200, display: 'flex', margin: 'auto' }} fullWidth size="small">
        <InputLabel id="demo-simple-select-label">Market</InputLabel>
        <Select sx={{ width: '95%', margin: 'auto' }} value={props.selectedMarket} onChange={props.handleMarketChange} label='Market'>
          {props.market?.map((n: any) => (
            <MenuItem key={n.name} value={n.name}>{n.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default Dropdown
