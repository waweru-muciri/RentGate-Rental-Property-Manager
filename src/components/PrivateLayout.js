import Container from "@material-ui/core/Container";
import Head from "./Head";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import AppNav from "./AppNav";
import {commonStyles} from './commonStyles'

const Layout = (props) => {
	const classes = commonStyles()
	return (
		<React.Fragment>
			<CssBaseline />
			<Head title={props.pageTitle} />
			<Container>
				<AppNav classes={classes} pageTitle={"Yarra Property Management"}/>
				<Paper className={classes.rootPaper}>{props.children}</Paper>
			</Container>
		</React.Fragment>
	);
};
export default Layout;
