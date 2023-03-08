import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { commonStyles } from "../components/commonStyles";

let InfoDisplayPaper = (props) => {
	const classes = commonStyles();
	return (
		<Grid item xs={props.xs} md>
			<Paper
				className={classes.infoDisplayPaper}
				number={24}
				variant="elevation"
			>
				<Typography variant="subtitle1" align="center">
					{props.title}
				</Typography>
				<Typography variant="subtitle2" align="center">
					{props.value}
				</Typography>
			</Paper>
		</Grid>
	);
};

export default InfoDisplayPaper;
