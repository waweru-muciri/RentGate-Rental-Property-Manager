import { makeStyles } from "@material-ui/core/styles";
import { red } from '@material-ui/core/colors';

const drawerWidth = 240;


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
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
		backgroundColor: red[500],
	},
	buttonBox: {
		paddingTop: `${theme.spacing(2)}px`,
		"& .MuiButton-root": {
			margin: theme.spacing(1),
		},
	},
	fileInputDisplayNone: {
		display: 'none',
	},
	largeAvatar: {
		width: theme.spacing(20),
		height: theme.spacing(20),
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
	root: {
        display: "flex",
    },
    title: {
        flexGrow: 1,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-end",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    profileAvatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
    },
}));

export { useStyles as commonStyles };
