import { makeStyles } from "@material-ui/core/styles";
let useStyles = makeStyles((theme) => ({
	form: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		paddingRight: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		"& .MuiTextField-root": {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
	},
	buttonBox: {
		paddingTop: `${theme.spacing(2)}px`,
		"& .MuiButton-root": {
			margin: theme.spacing(1),
		},
	},
	largeAvatar: {
		width: theme.spacing(16),
		height: theme.spacing(16),
	},
	chip: {
		margin: theme.spacing(0.5),
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
	icon: {
		color: "rgba(255, 255, 255, 0.54)",
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	infoDisplayPaper: {
		paddingBottom: theme.spacing(2),
		paddingTop: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	fullHeightWidthContainer: {
		width: "100%",
		height: "100%",
	},
	oneMarginRight: {
		marginRight: theme.spacing(1),
	},
	oneMarginTopBottom: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	selectFormControl: {
		  margin: theme.spacing(1),
		  minWidth: 120,
	},
	selectChips: {
		  display: 'flex',
		  flexWrap: 'wrap',
	},
	selectChip: {
		  margin: 2,
	},
}));

export { useStyles as commonStyles };
