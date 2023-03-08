import Container from "@material-ui/core/Container";
import Head from "./Head";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";


const Layout = (props) => {
	return (
		<React.Fragment>
			<CssBaseline />
			<Head title={props.pageTitle} />
			<Container maxWidth={"xs"} component="main">
				{props.children}
			</Container>
		</React.Fragment>
	);
};
export default Layout;
