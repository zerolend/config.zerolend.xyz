import { Box, Typography, Switch } from "@mui/material"
import { ChangeEvent } from "react"


const Header = (props: { matches: boolean; darkMode: boolean; onChange: ((event: ChangeEvent<HTMLInputElement>, checked: boolean) => void) | undefined }) => {
  return (
    <Box sx={{ mt: props.matches ? 2.5 : 5, ml: props.matches ? 0 : 5, mr: props.matches ? 0 : 5, display: "flex" }}>
      <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
        ZeroLend Config Overview
      </Typography>
    </Box>
  )
}

export default Header
