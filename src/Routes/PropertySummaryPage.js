import React from "react";
import { makeStyles } from '@material-ui/core/styles';
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
import { red } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 56,
        width: 56,
        backgroundColor: red[500],
    },
}));

let PropertyPage = (props) => {
    const classes = useStyles();
    let { propertyToShowDetails, propertyUnits, users } = props
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
                                Phone Number {propertyOwner.phone_number || '254712345678'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyOwner.primary_email || '123@acme.com'}
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
                                Phone Number {propertyManager.phone_number || '254712345678'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyManager.primary_email || '123@acme.com'}
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
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                {propertyOwner.first_name} {propertyOwner.last_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Phone Number {propertyOwner.phone_number || '254712345678'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyOwner.primary_email || '123@acme.com'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                {propertyOwner.first_name} {propertyOwner.last_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Phone Number {propertyOwner.phone_number || '254712345678'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyOwner.primary_email || '123@acme.com'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm>
                    <Card variant="outlined" elevation={1}>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" component="h2">
                                {propertyManager.first_name} {propertyManager.last_name}
                            </Typography>
                            <Typography variant="body2" component="p">
                                Phone Number {propertyManager.phone_number || '254712345678'},
                            </Typography>
                            <Typography variant="body2" component="p">
                                Email {propertyManager.primary_email || '123@acme.com'}
                            </Typography>
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