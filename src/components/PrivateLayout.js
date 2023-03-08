import Container from "@material-ui/core/Container";
import Head from "./Head";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import AppNav from "./AppNav";


const useStyles = makeStyles((theme) => ({
	rootPaper: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(3),
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	},
}));
const Layout = (props) => {
	const classes = useStyles();
	return (
		<React.Fragment>
			<CssBaseline />
			<Head title={props.pageTitle} />
			<Container>
				<AppNav pageTitle={"Yarra Property Management"}/>
				<Paper className={classes.rootPaper}>{props.children}</Paper>
			</Container>
		</React.Fragment>
	);
};
export default Layout;
