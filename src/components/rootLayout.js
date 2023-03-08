import PersistentDrawerLeft from "./AppNav";
import CssBaseline from "@material-ui/core/CssBaseline";
import "../App.css";
import React from "react";

const RootLayout = (props) => {
	return (
		<React.Fragment>
			<CssBaseline />
			<PersistentDrawerLeft />
		</React.Fragment>
	);
};

export default RootLayout;
