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
import WorkIcon from '@material-ui/icons/Work';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ApartmentIcon from '@material-ui/icons/Apartment';
import ContactsIcon from "@material-ui/icons/Contacts";
import EmailIcon from "@material-ui/icons/Email";
import AssessmentIcon from '@material-ui/icons/Assessment';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import ScheduleIcon from '@material-ui/icons/Schedule';
import StarIcon from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Link as ReactRouterLink } from "react-router-dom";
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from "@material-ui/lab/Alert"
import Box from '@material-ui/core/Box';
import { Formik } from "formik";
import { commonStyles } from "../components/commonStyles";
import 'typeface-lato';
import * as Yup from "yup";

const messageSchema = Yup.object().shape({
    email: Yup.string().trim().email("Invalid email"),
    first_name: Yup.string().trim().min(4, "Too Short!").required("First Name is Required"),
    last_name: Yup.string().trim().min(4, "Too Short!").required("Last Name is Required"),
    subject: Yup.string().trim().min(6, "Too Short!").required("Subject is Required"),
    phone_number: Yup.string().trim().min(10, "Too Short!").required("Phone Number is Required"),
    message: Yup.string().trim().min(6, "Too Short!").required("Message is Required"),
});

const messageValues = { first_name: '', last_name: '', email: '', subject: '', phone_number: '', message: '' }

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                RentGate Property Management
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createMuiTheme({
    typography: {
        fontFamily: "Lato"
    },
    palette: {
        text: {
            primary: "#121037",
            secondary: "#546e7a",
        }
    },
});


const appFeatures = [
    {
        icon: <ApartmentIcon style={{ color: "#3f51b5" }} fontSize="large" />, title: "Unit Management",
        description: `Manage property unit details such as unit details, rent pricing 
        through rental agreements, unit recurring and one-time charges, current and previous tenants, availability status.`},
    {
        icon: <GroupIcon style={{ color: "#3f51b5" }} fontSize="large" />, title: "Tenant Management",
        description: `Manage tenant personal and contact information, unit occupancy, relevant documentation, 
        rent and other charges, charges and payments statements, tenants payments history`},
    {
        icon: <AccountBalanceIcon style={{ color: "#3f51b5" }} fontSize="large" />, title: "Accounting",
        description: `We enable to keep your bookkeeping accurate and up-to-date. 
        Track rent and other charges, payments, expenses
        and reconcile property income statments.`},
    {
        icon: <WorkIcon style={{ color: "#3f51b5" }} fontSize="large" />, title: "Rental Agreements",
        description: `Track and manage rental agreements, payment schedules, record payment rentalPayments on agreements, 
        outstanding rent balances, unit deposits and charges on deposits.`},
]

const appModules = [
    {
        image: "/propertyDetails.png", title: "Property Details & Summary",
        description: `Get detailed summaries for each property including such details as units distribution,
        occupancy, rent charges and payments through smart analytics, summaries and charts`},
    {
        image: "/tenantDetails.png", title: "Tenant Details & Summary",
        description: `Track individual tenant details, charges and payments statements, units history, rental agreements
        start and end dates through smart analytics, summaries and charts etc.`},
    {
        image: "/rentRoll.png", title: "Rent Roll",
        description: `Get a detailed view of each property rental agreements rent charges, rent payments, 
        rent outstanding balances, monthly and yearly rent income statements.`},
    {
        image: "/rentalAgreements.png", title: "Property Performance",
        description: `Generate property performance reports including income statements, expenses statements,
        for such periods as current-month, 3 months to-date, year-to-date, last-year etc.`},
]

const appCustomers = [
    {
        image: "/propertyDetails.png", name: "Waweru Muciri", title: "Manager , Kefa Realtors",
        review: `Stop worrying about record keeping & inefficiency problems. Focus on your business.
        RentGate provides the support you deserve.`},
    {
        image: "/rentalUnits.png", name: "John Njoroge", title: "Lead Generation, Gallant PM", review: `Stay as little as 3 months with rolling contracts. 
    Like it here? This is your space, so stay as long as you want.`},
]

const appServices = [
    { icon: <ApartmentIcon />, title: "Unit Management" },
    { icon: <ContactsIcon />, title: "Tenant Management" },
    { icon: <ScheduleIcon />, title: "Rental Agreements Management" },
    { icon: <AccountBalanceIcon />, title: "Charges & Payments Performance" },
    { icon: <AssessmentIcon />, title: "Property Performance" },
    { icon: <MoneyOffIcon />, title: "Expenses Tracking" },
    { icon: <EmailIcon />, title: "In-App Email" },
]

const pricingTiers = [
    {
        title: 'Starter',
        price: '100/unit',
        description: ['For less than 200 units', 'Unlimited storage', 'Help center access', 'Email support'],
        buttonText: 'Sign up',
        buttonVariant: 'contained',
    },
    {
        title: 'Growing',
        subheader: 'Most popular',
        price: '80/unit',
        description: [
            'For 200 - 300 units',
            'Unlimited storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Sign up',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '50/unit',
        description: [
            'For 500 units and more',
            'Unlimited Storage',
            'Custom upload templates',
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
        description: ['Team', 'History', 'Contact us'],
    },
    {
        title: 'Features',
        description: ['Tenant Management', 'Rental Agreeements', 'Unit Management', 'Charges & Payments', 'Income Statements'],
    },
    {
        title: 'Resources',
        description: ['Guide', 'FAQs', 'Contacts'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

export default function HomePage() {
    const classes = commonStyles();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.homePageToolBar} />
            <Divider />
            <List>
                {['About', 'Features', 'Reviews', 'Pricing', 'Contact'].map((text, index) => (
                    <ListItem button key={text} onClick={() => {
                        handleDrawerToggle();
                        var element = document.getElementById(text.toLowerCase())
                        if (element) {
                            element.scrollIntoView(true)
                        }
                    }} href={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
                <ListItem button key="login-button" component={ReactRouterLink} to="/login">
                    <ListItemText primary="Login" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <Toolbar className={classes.homePageToolBar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.homePageMenuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.homePageToolbarTitle} noWrap>
                        RentGate PM
                    </Typography>
                    <Hidden smDown implementation="js">
                        <nav>
                            <Link variant="button" color="textPrimary" href="#about" className={classes.link}>
                                About
                            </Link>
                            <Link variant="button" color="textPrimary" href="#features" className={classes.link}>
                                Features
                            </Link>
                            <Link variant="button" color="textPrimary" href="#reviews" className={classes.link}>
                                Reviews
                            </Link>
                            <Link variant="button" color="textPrimary" href="#pricing" className={classes.link}>
                                Pricing
                            </Link>
                            <Link variant="button" color="textPrimary" href="#contact" className={classes.link}>
                                Support
                            </Link>
                            <Button color="primary" variant="outlined" className={classes.link} component={ReactRouterLink}
                                to="/login">
                                Login
                            </Button>
                            <Button href="#contact" color="primary" variant="outlined" className={classes.link}>
                                Sign Up
                            </Button>
                        </nav>
                    </Hidden>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="website navigation">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="js">
                    <Drawer
                        variant="temporary"
                        anchor={'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            {/* Hero unit */}
            <main className={classes.homePageContent}>
                <div className={classes.heroContent} id="about">
                    <div className={classes.homePageToolBar} />
                    <Grid container alignItems="center" justify="center">
                        <Grid item container lg={10} spacing={4} alignItems="center" justify="center" direction="row">
                            <Grid item xs={12} md={5} container spacing={2} alignItems="center" justify="center" direction="column">
                                <Grid item container>
                                    <Grid item>
                                        <Typography component="h3" variant="h3" className={classes.boldFont} gutterBottom>
                                            Management made easy
                                </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="textSecondary">
                                            Increase efficiency and save time with our user-friendly platform.
                                            Choose the property management software designed to inspire and power
                                            you to manage your rental properties.
                                </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction='row' spacing={2}>
                                    <Grid item>
                                        <Button variant="contained" href="#contact" color="primary">Sign Up</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" href="#features" color="primary">Features</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={7} container alignItems="center" justify="center" direction="column">
                                <Grid item xs={12}>
                                    <img src="/headerImage.jpg" alt="" className={classes.fullHeightWidthContainer} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Divider />
                {/* Hero unit */}
                <Container maxWidth="lg" component="section" className={classes.heroContent} style={{ backgroundColor: "rgb(247, 249, 250)" }} id="features">
                    <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                        <Grid item container spacing={2} alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <Typography component="h4" variant="h4" align="center" className={classes.boldFont}>
                                    We are reimagining renting to help you achieve your dreams
                        </Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography component="p" variant="h6" color="textSecondary" align="center">
                                    Through our software, you can keep up-to-date rental properties and units records, tenant
                                    details, rental agreements and occupancy records, resolve maintenance issues and
                                    update property financials, from anywhere.
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
                                            <Typography variant="h6" className={classes.boldFont}>
                                                {feature.title}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography component="p" align="center" color="textSecondary">
                                                {feature.description}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                </Container>
                <Divider />
                <Container maxWidth="lg" component="section" className={classes.heroContent}>
                    <Grid container alignItems="center" justify="center">
                        <Grid item container lg={12} alignItems="center" justify="center" spacing={2} direction="row">
                            <Grid item container xs={12} md={6} spacing={2} direction="column" alignItems="center" justify="center" >
                                <Grid item xs={12}>
                                    <Typography component="h5" variant="h4" className={classes.boldFont}>
                                        The right software means managing your portfolio is easy.
                            </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="textSecondary">
                                        Rather than worrying about the management of your properties,
                                        you can instead oversee management in one place thus providing a
                                        substantial increase in transparency, accountability, efficiency
                                        while keeping administration to a minimum.
                                        We also made sure to include all the modules and functionality that
                                        a property owner/manager could possibly need.
                            </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <img src="/easyManagement.jpg" alt="advertImage" className={classes.fullHeightWidthContainer} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
                <Divider />
                {/* Hero unit */}
                <Container maxWidth="lg" component="section" className={classes.heroContent}>
                    <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                        <Grid item container spacing={2} alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <Typography component="h3" variant="h4" className={classes.boldFont} align="center">
                                    Featured Modules
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
                        <Grid item container spacing={4} alignItems="stretch" justify="center" direction="row">
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
                                                <Typography variant="body1" color="textSecondary" component="p">
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
                <Divider />
                {/* Hero unit */}
                <Container maxWidth="lg" component="section" className={classes.heroContent} style={{ backgroundColor: "rgb(247, 249, 250)" }}>
                    <Grid container spacing={4} alignItems="center" justify="center" direction="row">
                        <Grid item container xs={12} md={4} spacing={2} alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <Typography component="h4" variant="h4" className={classes.boldFont}>
                                    What's included
                            </Typography>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" href="#pricing">EXPLORE OUR PACKAGES</Button>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} md={8} spacing={3} justify="space-between" alignItems="center" direction="row">
                            {
                                appServices.map((service, serviceIndex) => (
                                    <Grid key={serviceIndex} item xs={12} md={4} container spacing={1} direction="row" wrap="nowrap">
                                        <Grid item>
                                            {service.icon}
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" noWrap>
                                                {service.title}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                </Container>
                <Divider />
                {/* End hero unit */}
                <Container maxWidth="md" component="section" className={classes.heroContent} id="pricing">
                    <Grid container spacing={10} alignItems="center" justify="center" direction="column">
                        <Grid item container spacing={2} alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <Typography variant="h4" align="center" className={classes.boldFont} gutterBottom>
                                    Choose the right plan for your team
                        </Typography>
                            </Grid>
                            <Grid item>
                                <Typography align="center" color="textSecondary" component="p">
                                    Pay monthly or yearly and cancel at any time
                            </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={5} alignItems="center" justify="center">
                            {pricingTiers.map((tier) => (
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
                                                    <Button href="#contact" variant={tier.buttonVariant} color="primary">
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
                <Divider />
                {/* Hero unit */}
                <Container maxWidth="md" component="section" className={classes.heroContent} id="reviews">
                    <Grid container spacing={10} direction="column" style={{ backgroundColor: "rgb(247, 249, 250)" }}>
                        <Grid item xs={12} container spacing={2} alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <Typography variant="h4" className={classes.boldFont} align="center">
                                    Trusted by Africa's most innovative companies – big and small
                            </Typography>
                            </Grid>
                            <Grid item>
                                <Typography component="p" variant="h6" align="center" color="textSecondary">
                                    RentGate empowers property owners and managers to deliver more than ever before by
                                    enhancing up-to-date record keeping, data authenticity and transparency, smart analytics
                                    and alerts, financial statements.
                            </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={4} alignItems="stretch" justify="center" direction="row">
                            {
                                appCustomers.map((customer, customerIndex) => (
                                    <Grid key={customerIndex} item xs={12} md={6}>
                                        <Card className={classes.fullHeightWidthContainer}>
                                            <CardContent>
                                                <Grid className={classes.reviewBox} container spacing={1} direction="column">
                                                    <Grid item container direction="row" spacing={2} alignItems="center">
                                                        <Grid item>
                                                            <Avatar variant="rounded" className={classes.largeAvatar}>
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
                </Container>
                <Divider />
                <Container maxWidth="md" component="section" className={classes.heroContent} id="contact">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Typography component="h5" variant="h4" align="center" className={classes.boldFont}>
                                Get in touch with Us
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Formik
                                initialValues={messageValues}
                                validationSchema={messageSchema}
                                onSubmit={async (values, { resetForm, setStatus }) => {
                                    const data = {
                                        phone_number: values.phone_number,
                                        first_name: values.first_name,
                                        last_name: values.last_name,
                                        subject: values.subject,
                                        message: values.message,
                                        email: values.email
                                    }
                                    return fetch('https://us-central1-propertymanager-a321f.cloudfunctions.net/sendEmailTest', {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(data)
                                    }).then(response => {
                                        resetForm({});
                                        setStatus({ success: "Message sent successfully. We will get back to you soonest." });
                                    }).catch(error => {
                                        setStatus({ error: "Message sending failed!" });
                                    })
                                }}>
                                {({
                                    values,
                                    handleSubmit,
                                    touched,
                                    status,
                                    errors,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                }) => (
                                    <form
                                        method="post"
                                        id="sendMessageForm"
                                        onSubmit={handleSubmit}
                                    >
                                        <Grid container justify="center" direction="column" spacing={4}>
                                            <Grid item container justify="center" direction="column" spacing={2}>
                                                {status && status.error && (
                                                    <Grid item>
                                                        <Alert severity="error">{status.error}</Alert>
                                                    </Grid>
                                                )}
                                                {status && status.success && (
                                                    <Grid item>
                                                        <Alert severity="success">{status.success}</Alert>
                                                    </Grid>
                                                )}
                                                <Grid item container justify="center" direction="row" spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            id="first_name"
                                                            label="First Name"
                                                            type="first_name"
                                                            value={values.first_name}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            helperText={touched.first_name && errors.first_name}
                                                            error={errors.first_name && touched.first_name}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            id="last_name"
                                                            label="Last Name"
                                                            type="last_name"
                                                            value={values.last_name}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            helperText={touched.last_name && errors.last_name}
                                                            error={errors.last_name && touched.last_name}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item container justify="center" direction="row" spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            id="phone_number"
                                                            label="Phone Number"
                                                            type="text"
                                                            value={values.phone_number}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            helperText={
                                                                touched.phone_number && errors.phone_number
                                                            }
                                                            error={errors.phone_number && touched.phone_number}
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            variant="outlined"
                                                            id="email"
                                                            label="Email"
                                                            value={values.email}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            helperText={touched.email && errors.email}
                                                            error={errors.email && touched.email}
                                                            type="email"
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        id="subject"
                                                        label="Subject"
                                                        type="text"
                                                        value={values.subject}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.subject && errors.subject
                                                        }
                                                        error={errors.subject && touched.subject}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        variant="outlined"
                                                        id="message"
                                                        label="Message"
                                                        type="text"
                                                        value={values.message}
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        helperText={
                                                            touched.message && errors.message
                                                        }
                                                        error={errors.message && touched.message}
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item container>
                                                <Grid item>
                                                    <Button
                                                        disabled={isSubmitting}
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        form="sendMessageForm"
                                                    >
                                                        Send Message
                                                        </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                )}
                            </Formik>
                        </Grid>
                    </Grid>
                </Container>
                {/* Footer */}
                <Container maxWidth="lg" component="footer" className={classes.footer}>
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
            </main>
        </ThemeProvider >
    );
}
