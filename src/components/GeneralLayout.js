import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";


const Layout = (props) => {
	return (
		<React.Fragment>
			<CssBaseline />
			<Container maxWidth={props.maxWidth || "xs"} component="main">
				{props.children}
			</Container>
		</React.Fragment>
	);
};
export default Layout;
