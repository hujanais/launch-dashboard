import Button from '@mui/material/Button'
import styles from './LaunchDetail.module.scss'
import { useNavigate } from 'react-router-dom'
import type { LaunchResult } from '../../../../models/launch_model'

export const LaunchDetail = ({ launch }: { launch: LaunchResult }) => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div className={styles.launchDetailContainer}>
            <div>{launch.id}</div>
            <div>
                <Button onClick={() => goBack()}>Back</Button>
            </div>
        </div>
    )
}
