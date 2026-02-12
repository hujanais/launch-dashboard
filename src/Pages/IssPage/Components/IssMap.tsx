import type { IssResponse } from '../../../Api/issApi'
import styles from './IssMap.module.scss'

type Props = {
    track: IssResponse[]
}

export const IssMap = (props: Props) => {
    let latitude = 0
    let longitude = 0
    if (props && props.track.length > 0) {
        latitude = props.track[props.track.length - 1].iss_position.latitude
        longitude = props.track[props.track.length - 1].iss_position.longitude
    }

    return (
        <div className={styles.container}>
            <div>{latitude}</div>
            <div>{longitude}</div>
        </div>
    )
}
