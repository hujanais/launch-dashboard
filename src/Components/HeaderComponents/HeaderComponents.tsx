import { IconButton, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect, useState } from 'react'

const HeaderComponents = () => {
    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString()
    )

    const [lastUpdateTime, setLastUpdateTime] = useState(
        new Date().toLocaleTimeString()
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
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
                        Launch
                    </Typography>
                    <Typography>Last Updated: {lastUpdateTime}</Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default HeaderComponents
