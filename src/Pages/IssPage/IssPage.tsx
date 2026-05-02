import { IssMap } from './Components/IssMap'
import styles from './IssPage.module.scss'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export const IssPage = () => {
    const issFacts = [
        'Official Name: International Space Station',
        'Size: 109 m (356 ft) end-to-end; 73 m solar array span; 388 m3 habitable volume',
        'Mass: 419,725 kg (925,335 lb)',
        'Launch Date: First module (Zarya): November 20, 1998; continuous occupancy since November 2, 2000',
        'Number of Astronauts Visited: ~280+ people since 1998',
        'Orbital Altitude: ~400-408 km (248-250 mi)',
        'Orbital Speed: 5 mi/s ~= 7.66 km/s ~= 27,600 km/h; orbits every 90 minutes',
        'Fun Fact #1: Solar panels cover 1 acre (0.4 ha)',
        'Fun Fact #2: Largest structure ever built by humanity in orbit',
        'Fun Fact #3: Visible to the naked eye from Earth at night',
        'Fun Fact #4: 7 sleeping quarters + 2 bathrooms + gym + Cupola (360-degree window)',
    ]

    const tianheFacts = [
        'Official Name: Tianhe core module (天和核心舱); "Harmony of the Heavens"',
        'Size: 16.6 m long; 4.2 m maximum diameter',
        'Mass: 22.5 tons (22,500 kg)',
        'Launch Date: April 29, 2021',
        'Number of Astronauts Visited: 10+ astronauts (taikonauts) since 2021',
        'Orbital Altitude: ~340-450 km (low Earth orbit)',
        'Orbital Speed: ~7.66 km/s (similar to ISS)',
        'Fun Fact #1: Largest and most complex spacecraft independently developed by China',
        'Fun Fact #2: Heart of the Tiangong ("Celestial Palace") space station in a T-shape',
        'Fun Fact #3: Capable of long-term autonomous flight',
        'Fun Fact #4: Complete station weighs 80-100 tons (20% of ISS mass)',
    ]

    return (
        <div className={styles.mainContainer}>
            <Box className={styles.pageTitle}>
                <Typography variant="h6" component="h1">
                    ISS and Tianhe
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    Expand a card below to read facts — maps shrink to make
                    room.
                </Typography>
            </Box>

            <div className={styles.factsContainer}>
                <Accordion
                    className={styles.factAccordion}
                    defaultExpanded={false}
                    disableGutters
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <AccordionSummary
                        className={styles.factAccordionSummary}
                        expandIcon={<ExpandMoreIcon fontSize="small" />}
                        aria-controls="iss-quick-stats-content"
                        id="iss-quick-stats-header"
                    >
                        <Typography variant="subtitle2" component="span">
                            ISS quick stats + fun facts
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={styles.factAccordionDetails}>
                        {issFacts.map((fact) => (
                            <Typography
                                key={fact}
                                variant="body2"
                                component="p"
                                sx={{ m: 0 }}
                            >
                                {fact}
                            </Typography>
                        ))}
                    </AccordionDetails>
                </Accordion>

                <Accordion
                    className={styles.factAccordion}
                    defaultExpanded={false}
                    disableGutters
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <AccordionSummary
                        className={styles.factAccordionSummary}
                        expandIcon={<ExpandMoreIcon fontSize="small" />}
                        aria-controls="iss-fun-facts-content"
                        id="iss-fun-facts-header"
                    >
                        <Typography variant="subtitle2" component="span">
                            Tianhe quick stats + fun facts
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={styles.factAccordionDetails}>
                        {tianheFacts.map((fact) => (
                            <Typography
                                key={fact}
                                variant="body2"
                                component="p"
                                sx={{ m: 0 }}
                            >
                                {fact}
                            </Typography>
                        ))}
                    </AccordionDetails>
                </Accordion>
            </div>

            <div className={styles.mapContainer}>
                <IssMap variant="iss" />
                <IssMap variant="tianhe" />
            </div>
        </div>
    )
}
