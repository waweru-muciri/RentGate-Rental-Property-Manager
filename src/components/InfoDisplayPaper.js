import React from "react";
import { Paper } from "@material-ui/core";
import { commonStyles } from "../components/commonStyles";

let InfoDisplayPaper = (props) => {
	const classes = commonStyles();
	return (
		<Paper
			className={classes.infoDisplayPaper}
			number={24}
			variant="elevation"
		>
			{props.children}
		</Paper>
	);
};

export default InfoDisplayPaper;
