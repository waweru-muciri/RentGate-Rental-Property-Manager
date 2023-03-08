import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import TEAL from '@material-ui/core/colors/teal';
import PURPLE from '@material-ui/core/colors/purple';
import { Doughnut } from 'react-chartjs-2';


let PropertySummaryPage = (props) => {
    const { classes } = props;
    let { propertyToShowDetails, propertyUnits, users } = props
    const occupiedUnitsNumber = propertyUnits.filter((unit) => unit.tenants.length !== 0).length
    //get occupancy graph data
    const occupancyChartData = [
        { name: 'Occupied Units', value: occupiedUnitsNumber },
        { name: 'Vacant Units', value: propertyUnits.length - occupiedUnitsNumber },
    ]
    //get the number of the different units by category
    const rentalUnitsDistributionData = { datasets: [] }
    const unitTypes = Array.from(new Set(propertyUnits.map(unit => unit.unit_type)))
    rentalUnitsDistributionData.labels = unitTypes
    rentalUnitsDistributionData.datasets.push({
        data: unitTypes
            .map(unit_type => {
                return propertyUnits.filter((property) => property.unit_type === unit_type).length
            }), 
        backgroundColor: unitTypes.map((_unit_type, key) => TEAL[(key+ 1) * 100])
    })
    console.log(rentalUnitsDistributionData)
    const propertyManager = users.find((user) => user.id === propertyToShowDetails.assigned_to) ||
        { first_name: 'R', last_name: 'O' }
    const propertyOwner = users.find((user) => user.id === propertyToShowDetails.owner) ||
        { first_name: 'R', last_name: 'M' }
    return (
        <Grid container justify="center" direction="column" spacing={2} alignItems="stretch">
            <Grid item key={0}>
                <Typography variant="h6">Property Details</Typography>
            </Grid>
            <Grid
                container
                direction="row"
                item
                alignItems="stretch"
                spacing={2}
            >
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardActionArea>
                            <CardMedia
                                height="200"
                                component="img"
                                image='/apartmentImage.png'
                                title="Property Image"
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                Address
                                </Typography>
                            <Typography variant="body2" component="p">
                                {propertyToShowDetails.address}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {propertyToShowDetails.city}, {propertyToShowDetails.county}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md>
                    <TenantInfoDisplayCard title="Property Owner"
                        subheader="Owner of this property"
                        avatar={`${propertyOwner.first_name[0]}${propertyOwner.last_name[0]}`}
                        cardContent={[
                            { name: 'Name:', value: `${propertyOwner.first_name} ${propertyOwner.last_name}` },
                            { name: 'Mobile Phone Number', value: propertyOwner.phone_number || '-' },
                            { name: 'Work Phone Number', value: propertyOwner.home_phone_number || '-' },
                            { name: 'Primary Email', value: propertyOwner.primary_email || '-' },
                            { name: 'Current Address', value: propertyOwner.address || '-' },
                        ]}
                    />
                </Grid>
                <Grid item xs={12} md>
                    <TenantInfoDisplayCard title="Rental Manager"
                        subheader="Landlord for this property"
                        avatar={`${propertyManager.first_name[0]}${propertyManager.last_name[0]}`}
                        cardContent={[
                            { name: 'Name:', value: `${propertyManager.first_name} ${propertyManager.last_name}` },
                            { name: 'Mobile Phone Number', value: propertyManager.phone_number || '-' },
                            { name: 'Work Phone Number', value: propertyManager.home_phone_number || '-' },
                            { name: 'Primary Email', value: propertyManager.primary_email || '-' },
                            { name: 'Current Address', value: propertyManager.address || '-' },
                        ]}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                item
                alignItems="stretch"
                spacing={2}
            >
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                Rental Units Distribution
                            </Typography>
                            <Doughnut data={rentalUnitsDistributionData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                Occupancy Data
                            </Typography>
                            <Doughnut data={rentalUnitsDistributionData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                Hello world
                            </Typography>
                            <Doughnut data={rentalUnitsDistributionData} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid item>
                <Typography gutterBottom variant="subtitle1" component="h2">
                    Files
                </Typography>
            </Grid>
        </Grid>
    );
};

export default PropertySummaryPage;