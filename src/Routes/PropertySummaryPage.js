import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { commonStyles } from "../components/commonStyles";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";


let PropertyPage = (props) => {
    const classes = commonStyles();
    let { propertyToShowDetails, propertyUnits, users } = props
    const occupiedUnitsNumber = propertyUnits.filter((unit) => unit.tenants.length !== 0).length
    //get occupancy graph data
    const occupancyChartData = [
        {name: 'Occupied Units', value: occupiedUnitsNumber}, 
        {name: 'Vacant Units', value: propertyUnits.length - occupiedUnitsNumber}, 
    ]
    //get the number of the different units by category
    const unitTypesData = [
        {
            name: "BedSitters",
            value: propertyUnits.filter((property) => property.unit_type === 'Bedsitter').length,
        },
        {
            name: "One Bedroom",
            value: propertyUnits.filter((property) => property.unit_type === 'One Bedroom').length,
        },
        {
            name: "Two Bedroom",
            value: propertyUnits.filter((property) => property.unit_type === 'Two Bedroom').length,
        },
        {
            name: "Single Room",
            value: propertyUnits.filter((property) => property.unit_type === 'Single Room').length,
        },
        {
            name: "Double Room",
            value: propertyUnits.filter((property) => property.unit_type === 'Double Room').length,
        },
        {
            name: "Shop",
            value: propertyUnits.filter((property) => property.unit_type === 'Shop').length,
        }
    ]
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
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
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
                        <CardActions>
                            <Button size="medium" color="primary">
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {propertyOwner.first_name[0]}{propertyOwner.last_name[0]}
                                </Avatar>
                            }
                            title="Property Owner"
                            subheader="Owner of this property"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                {propertyOwner.first_name} {propertyOwner.last_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Phone Number {propertyOwner.phone_number || '-'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyOwner.primary_email || '-'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="medium" color="primary">
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="recipe" className={classes.avatar}>
                                    {propertyManager.first_name[0]}{propertyManager.last_name[0]}
                                </Avatar>
                            }
                            title="Rental Manager"
                            subheader="Landlord for this property"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                {propertyManager.first_name} {propertyManager.last_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Phone Number {propertyManager.phone_number || '-'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyManager.primary_email || '-'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="medium" color="primary">
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                item
                alignItems="stretch"
                spacing={2}
            >
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardContent>
                        <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                            Occupancy Data
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart width={800} height={200}>
                                    <Pie isAnimationActive={true} data={occupancyChartData} dataKey="value" 
                                    outerRadius={80} fill="#7DB3FF" label />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardContent>
                        <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                            Hello world
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart width={800} height={200}>
                                    <Pie isAnimationActive={true} data={unitTypesData} dataKey="value"
                                     outerRadius={80} fill="#FF7C78" label />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardContent>
                        <Typography gutterBottom align="center" variant="subtitle1" component="h2">
                            Rental Units Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart width={800} height={200}>
                                    <Pie isAnimationActive={true} data={unitTypesData} dataKey="value" outerRadius={80} fill="#8884d8" label />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
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

export default PropertyPage;