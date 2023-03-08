import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import TenantInfoDisplayCard from "../components/TenantInfoDisplayCard";
import TEAL from '@material-ui/core/colors/teal';
import RED from '@material-ui/core/colors/red';
import GREEN from '@material-ui/core/colors/green';
import { Doughnut } from 'react-chartjs-2';
import GREY from "@material-ui/core/colors/grey";
import { isWithinInterval, startOfMonth, startOfToday, endOfMonth, parse } from 'date-fns';
import { getUnitTypes } from "../assets/commonAssets";

const UNIT_TYPES_WITH_DETAILS = getUnitTypes();

const legendOpts = {
    display: true,
    position: 'top',
    fullWidth: true,
    reverse: false,
    labels: {
        fontColor: GREY[800],
        fontSize: 14,
    }
};

let PropertySummaryPage = (props) => {
    let { classes, propertyActiveLeasesNumber, propertyToShowDetails, propertyUnits, rentalPayments, users } = props
    //get current month income data
    const curentMonthIncomeData = { datasets: [], labels: []}
    const totalPaymentsByType = []
    const rentalPaymentsForCurrentMonth = rentalPayments
        .filter(payment => {
            return isWithinInterval(parse(payment.payment_date, 'yyyy-MM-dd', new Date()),
                { start: startOfMonth(startOfToday()), end: endOfMonth(startOfToday()) })
        })
    const totalCurrentMonthRentPayments = rentalPaymentsForCurrentMonth
        .filter(payment => payment.payment_type === 'rent')
        .reduce((totalValue, currentValue) => (totalValue += parseFloat(currentValue.payment_amount) || 0), 0)
    const totalCurrentMonthOtherPayments = rentalPaymentsForCurrentMonth
        .filter(payment => payment.payment_type !== 'rent')
        .reduce((totalValue, currentValue) => (totalValue += parseFloat(currentValue.payment_amount) || 0), 0)
    totalPaymentsByType.push({ type: "rent", totalAmount: totalCurrentMonthRentPayments, label: "Rent" })
    totalPaymentsByType.push({ type: "other", totalAmount: totalCurrentMonthOtherPayments, label: "Others" })
    curentMonthIncomeData.labels.push(totalPaymentsByType.map(totalPayment => totalPayment.label))
    curentMonthIncomeData.datasets.push({
        data: totalPaymentsByType.map(totalPayment => totalPayment.totalAmount),
        backgroundColor: [GREEN[800], GREEN[200]]
    })
    //get occupancy graph data
    const rentalUnitsOccupancyData = { datasets: [], labels: [] }
    rentalUnitsOccupancyData.labels.push('Occupied Units', 'Vacant Units');
    rentalUnitsOccupancyData.datasets.push(
        {
            data: [propertyActiveLeasesNumber, (propertyUnits.length - propertyActiveLeasesNumber)],
            backgroundColor: [RED[800], RED[200]]
        })
    //get the number of the different units by category
    const rentalUnitsDistributionData = {
        datasets: [],
        labels: [],
    }
    const unitTypes = Array.from(new Set(propertyUnits.map(unit => unit.unit_type)));
    const unitNamesForDisplay = unitTypes.map(unitType => {
        const unitTypeDetails = UNIT_TYPES_WITH_DETAILS.find(({ id }) => id === unitType) || {}
        return `${unitTypeDetails.displayValue}s`
    })
    //push the unit names for display to the labels array 
    rentalUnitsDistributionData.labels.push(...unitNamesForDisplay);
    //push the display data to the datasets array
    rentalUnitsDistributionData.datasets.push({
        data: unitTypes
        .map(unit_type => {
            return propertyUnits.filter((property) => property.unit_type === unit_type).length
        }),
        backgroundColor: unitTypes.map((_unit_type, key) => TEAL[(key + 1) * 100])
    })

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
                                image={propertyToShowDetails.property_image_url || '/apartmentImage.png'}
                                title="Property Image"
                            />
                        </CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                Name: {propertyToShowDetails.ref}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Address: {propertyToShowDetails.address}
                            </Typography>
                            <Typography variant="body2" component="p">
                                City: {propertyToShowDetails.city}
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
                            <Doughnut height={200} data={rentalUnitsDistributionData} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                Current Occupancy
                            </Typography>
                            <Doughnut height={200} data={rentalUnitsOccupancyData} legend={legendOpts} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md>
                    <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                                Current Month Income
                            </Typography>
                            <Doughnut height={200} data={curentMonthIncomeData} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PropertySummaryPage;
