import Typography from '@mui/material/Typography'
import styles from './NasaPage.module.scss'

export const NasaPage = () => {
    return (
        <div className={styles.root_container}>
            <Typography variant="h5">What am I doing next?</Typography>
            <Typography variant="h5">James Webb Telescope?</Typography>
            <Typography variant="h5">Astrophotography?</Typography>
            <Typography variant="body1">Still thinking about it...</Typography>
        </div>
    )
}
