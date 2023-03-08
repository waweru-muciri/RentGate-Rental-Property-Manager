import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import GroupIcon from '@material-ui/icons/Group';
import PhoneIcon from '@material-ui/icons/Phone';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import 'typeface-lato';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Yarra Property Management
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createMuiTheme({
    typography:{
        fontFamily: "Lato"
    },
    palette: {
        primary: {
            main: "#121037",
        },
        secondary: {
            main: "#546e7a"
        },
        text:{
            primary: "#121037", 
            secondary: "#546e7a",
        }
    },
});

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    boldFont: {
        fontWeight: "600"
    },
    textWhite: {
        color: '#ffffff',
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    fullHeightWidthContainer: {
        width: "100%",
        height: "100%",
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    largeAvatar: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    reviewBox: {
        padding: theme.spacing(4),
    },
    heroContent: {
        padding: theme.spacing(12, 8, 16, 8)
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
    },
    gridListContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "auto",
        height: 450,
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

const appFeatures = [
    {
        icon: <GroupIcon color="primary" fontSize="large" />, title: "Coworking communities", description: `Connect in spaces designed
     to bring incredible people together. Learn with them and take your project to new heights.`},
    {
        icon: <GroupIcon color="primary" fontSize="large" />, title: "Flexible contracts", description: `Stay as little as 3 months with rolling contracts. 
    Like it here? This is your space, so stay as long as you want.`},
    {
        icon: <AccountBalanceIcon color="primary" fontSize="large" />, title: "All Inclusive", description: `Monthly fee covers everything you need hassle free. 
    Keep cool and focus on what matters to you.    `},
    {
        icon: <PhoneIcon color="primary" fontSize="large" />, title: "Hospitality service", description: `24/7 support. No more hidden prices. 
    It is your workingplace, playground, relax room.`},
]

const appModules = [
    {
        image: "/propertyDetails.png", title: "Rental Properties", description: `Connect in spaces designed
     to bring incredible people together. Learn with them and take your project to new heights.`},
    {
        image: "/rentalUnits.png", title: "Rental Units", description: `Stay as little as 3 months with rolling contracts. 
    Like it here? This is your space, so stay as long as you want.`},
    {
        image: "/tenantDetails.png", title: "Tenant Details", description: `Monthly fee covers everything you need hassle free. 
    Keep cool and focus on what matters to you.    `},
    {
        image: "/rentalAgreements.png", title: "Rental Agreements", description: `24/7 support. No more hidden prices. 
    It is your workingplace, playground, relax room.`},
]

const appCustomers = [
    {
        image: "/propertyDetails.png", name: "Veronica Adams", title: "Growth Marketer, Crealytics", review: `Connect in spaces designed
     to bring incredible people together. Learn with them and take your project to new heights.`},
    {
        image: "/rentalUnits.png", name: "Akachi Luccini", title: "Lead Generation, Alternative Capital", review: `Stay as little as 3 months with rolling contracts. 
    Like it here? This is your space, so stay as long as you want.`},
]

const tiers = [
    {
        title: 'Starter',
        price: '3500',
        description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
        buttonText: 'Sign up',
        buttonVariant: 'contained',
    },
    {
        title: 'Growing',
        subheader: 'Most popular',
        price: '5000',
        description: [
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Sign up',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '10000',
        description: [
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
        ],
        buttonText: 'Contact Us',
        buttonVariant: 'contained',
    },
];
const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

export default function HomePage() {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Yarra PM
                    </Typography>
                    <nav>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Features
                        </Link>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Enterprise
                        </Link>
                        <Link variant="button" color="textPrimary" href="#" className={classes.link}>
                            Support
                        </Link>
                    </nav>
                    <Button href="#" color="primary" variant="outlined" className={classes.link}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Hero unit */}
            <div className={classes.heroContent}>
                <Grid container alignItems="center" justify="center" direction="row">
                    <Grid item xs={12} md={5} container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            <Typography component="h3" variant="h4" className={classes.boldFont} gutterBottom>
                                Management made easy
                         </Typography>
                            <Typography variant="h6" color="textSecondary">
                                For property managers, owners, and management startups.
                                Discover software products designed to inspire and to connect
                                you to a community of motivated people.
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={7} container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            Here is some other content
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            {/* Hero unit */}
            <Container maxWidth="lg" component="section" className={classes.heroContent}>
                <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                    <Grid item container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            <Typography component="h3" variant="h4" align="center" className={classes.boldFont}>
                                We are reimagining renting to help you achieve your dreams
                        </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography component="p" variant="h6" color="textSecondary" align="center">
                                Our mission is to help you grow your business, meet and connect with people who
                                share your passions. We help you fulfill your best potential through an
                                engaging lifestyle experience.
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item spacing={4} alignItems="flex-start" justify="center" direction="row">
                        {
                            appFeatures.map((feature, featureIndex) => (
                                <Grid key={featureIndex} item container xs={12} md={3} direction="column" spacing={2} alignItems="center">
                                    <Grid item>
                                        {feature.icon}
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6">
                                            {feature.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography component="p">
                                            {feature.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="lg" component="main" className={classes.heroContent}>
                <Grid container spacing={10} direction="row">
                    <Grid item xs={12} md={6} container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Typography component="h3" variant="h4" >
                                Flexible office space means growing your team is easy.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="textSecondary">
                                Rather than worrying about switching offices every couple years,
                                you can instead stay in the same location and grow-up from your
                                shared coworking space to an office that takes up an entire floor.
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        A bunch of images about here
                    </Grid>
                </Grid>
            </Container>
            {/* Hero unit */}
            <Container maxWidth="lg" component="main" className={classes.heroContent}>
                <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                    <Grid item container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            <Typography component="h3" variant="h4" className={classes.boldFont} align="center">
                                Modules in App
                        </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography component="p" variant="h6" color="textSecondary" align="center">
                                Here are some modules in the app to keep properties, units details and records,
                                tenants details, rental agreements with tenants,
                                rent and other charges, payments to these charges, property expenses, property and
                                tenants income and charges statements.
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={4} alignItems="stretch" justify="center" direction="row">
                        {
                            appModules.map((module, moduleIndex) => (
                                <Grid key={moduleIndex} item xs={12} md={6}>
                                    <Card key={moduleIndex} className={classes.fullHeightWidthContainer}>
                                        <CardActionArea>
                                            <CardMedia
                                                height="auto"
                                                width="auto"
                                                component="img"
                                                alt="Module Images"
                                                image={module.image}
                                                title={module.title}
                                            />
                                        </CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="h4">
                                                {module.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                {module.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="section" className={classes.heroContent}>
                <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                    <Grid item lg={8} container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            <Typography variant="h5" align="center" className={classes.boldFont} gutterBottom>
                                Choose the plan that's right for your team
                        </Typography>
                        </Grid>
                        <Grid item>
                            <Typography align="center" color="textSecondary" component="p">
                                Pay month or year and cancel at any time
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} alignItems="flex-end">
                        {tiers.map((tier) => (
                            // Enterprise card is full width at sm breakpoint
                            <Grid item key={tier.title} xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4}>
                                <Card>
                                    <CardHeader
                                        title={tier.title}
                                        subheader={tier.subheader}
                                        titleTypographyProps={{ align: 'center' }}
                                        subheaderTypographyProps={{ align: 'center' }}
                                        action={tier.title === 'Growing' ? <StarIcon /> : null}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <Grid container spacing={1} alignItems="center" justify="center">
                                            <Grid item xs={12}>
                                                <div className={classes.cardPricing}>
                                                    <Typography component="h2" variant="h3" color="textPrimary">
                                                        {tier.price}
                                                    </Typography>
                                                    <Typography variant="h6" color="textSecondary">
                                                        /mo
                                                </Typography>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {tier.description.map((line) => (
                                                    <Typography component="p" variant="subtitle1" align="center" key={line}>
                                                        {line}
                                                    </Typography>
                                                ))}
                                            </Grid>
                                            <Grid item>
                                                <Button variant={tier.buttonVariant} color="primary">
                                                    {tier.buttonText}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Container>
            {/* Hero unit */}
            <div className={classes.heroContent} style={{ backgroundColor: "#3f51b5" }}>
                <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                    <Grid item xs={12} lg={8} container spacing={2} alignItems="center" justify="center" direction="column">
                        <Grid item>
                            <Typography component="h3" variant="h4" className={classes.textWhite} align="center">
                                Trusted by the Africa's most innovative businesses – big and small
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography component="p" variant="h6" className={classes.textWhite} align="center">
                                After 3 days all of your offers will arrive and you will have another 7 days to select your new company.
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid container item lg={10} spacing={4} alignItems="stretch" justify="center" direction="row">
                        {
                            appCustomers.map((customer, customerIndex) => (
                                <Grid key={customerIndex} item xs={12} md={6}>
                                    <Card className={classes.fullHeightWidthContainer}>
                                        <CardContent>
                                            <Grid className={classes.reviewBox} container spacing={1} direction="column">
                                                <Grid item container direction="row" spacing={2} alignItems="center">
                                                    <Grid item>
                                                        <Avatar variant="rounded" src={customer.image} className={classes.largeAvatar}>
                                                        </Avatar>
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant="subtitle1">
                                                            {customer.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {customer.title}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" component="p" >
                                                        {customer.review}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </div>
            {/* Footer */}
            <Container maxWidth="md" component="footer" className={classes.footer}>
                <Grid container spacing={4} justify="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item}>
                                        <Link href="#" variant="subtitle1" color="textSecondary">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
            {/* End footer */}
        </ThemeProvider>
    );
}