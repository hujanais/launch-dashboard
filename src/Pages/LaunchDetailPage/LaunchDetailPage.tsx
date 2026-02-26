import Button from '@mui/material/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LaunchResult } from '../../models/launch_model'
import styles from './LaunchDetailPage.module.scss'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { ArrowBack } from '@mui/icons-material'
import { Typography } from '@mui/material'

export const LaunchDetailPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location as { state: LaunchResult }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className={styles.launchDetailContainer}>
            <div className={styles.launchDetailHeader}>
                <AppBar>
                    <Toolbar>
                        <Button onClick={goBack}>
                            <ArrowBack /> Back
                        </Button>
                        <Typography>{state.name}</Typography>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={styles.launchDetailContent}>{state.launch_service_provider.name}</div>
        </div>
    )
}
