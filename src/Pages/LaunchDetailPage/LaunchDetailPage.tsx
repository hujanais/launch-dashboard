import Button from '@mui/material/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LaunchResult } from '../../models/launch_model'

export const LaunchDetailPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location as { state: LaunchResult }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div>
            <div>{state.id}</div>
            <div>
                <Button onClick={() => goBack()}>Back</Button>
            </div>
        </div>
    )
}
