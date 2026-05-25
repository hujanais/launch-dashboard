import { Box, Button, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

const HeaderComponents = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Space Vibe
                    </Typography>
                    <Box sx={{ typography: 'body1', ml: 2 }}>
                        <Button href="/launch">Launch</Button>
                        <Button href="/launch-history">Launch History</Button>
                        <Button href="/iss">Space Stations</Button>
                        <Button href="/nasa">NASA</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default HeaderComponents
