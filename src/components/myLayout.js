import Head from './Head'
import PersistentDrawerLeft from './AppNav'
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from '@material-ui/core/styles';
import '../App.css'
import React from 'react'

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(3),
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	}

}));
const Layout = (props) => {
	const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline />
            <Head title={props.pageTitle} />
            <PersistentDrawerLeft />
            <Container>
	    	<Paper className={classes.root}>
                {props.children}
		    </Paper>
            </Container>
        </React.Fragment>
    );
}

export default Layout;
