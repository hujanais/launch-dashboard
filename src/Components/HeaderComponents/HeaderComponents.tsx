import { Box, Button, IconButton, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'

const HeaderComponents = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar disableGutters>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        XXX
                    </Typography>
                    <Box sx={{ typography: 'body1', ml: 2 }}>
                        <Button href="/iss">ISS</Button>
                        <Button href="/nasa">Nasa</Button>
                        <Button href="/launch">Launch</Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default HeaderComponents
