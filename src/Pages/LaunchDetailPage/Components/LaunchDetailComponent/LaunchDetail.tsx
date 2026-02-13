import Button from '@mui/material/Button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const LaunchDetail = ({ id }: { id: string }) => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }

    return (
        <div>
            <div>{id}</div>
            <div>
                <Button onClick={() => goBack()}>Back</Button>
            </div>
        </div>
    )
}
