import { makeStyles } from "@material-ui/core/styles";
import { red } from '@material-ui/core/colors';

const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
	form: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		paddingRight: theme.spacing(1),
		paddingLeft: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		paddingTop: theme.spacing(1),
		"& .MuiTextField-root": {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
	},
	avatar: {
		minHeight: theme.spacing(10),
		minWidth: theme.spacing(10),
		backgroundColor: red[500],
	},
	buttonBox: {
		paddingTop: `${theme.spacing(1)}px`,
		"& .MuiButton-root": {
			margin: theme.spacing(1),
			marginLeft: 0
		},
	},
	fileInputDisplayNone: {
		display: 'none',
	},
	largeAvatar: {
		minWidth: theme.spacing(20),
		minHeight: theme.spacing(20),
	},
	quillEditor: {
		height: theme.spacing(50),
		overflow: 'auto'
	},
	icon: {
		color: "rgba(255, 255, 255, 0.54)",
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
	rootPaper: {
		padding: theme.spacing(2),
		marginTop: theme.spacing(3),
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
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
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
    boldFont: {
        fontWeight: "600"
    },
    textWhite: {
        color: '#ffffff',
    },
    homePageMenuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    homePageToolBar: {
        flexWrap: 'wrap',
        ...theme.mixins.toolbar
    },
   
    homePageContent: {
        flexGrow: 1,
    },
    homePageToolbarTitle: {
        [theme.breakpoints.up('md')]: {
            margin: 'auto'
        },
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    reviewBox: {
        padding: theme.spacing(4),
    },
    heroContent: {
        padding: theme.spacing(6, 2, 6, 2),
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(12),
            paddingBottom: theme.spacing(12)
        },
    },
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
    },
    footer: {
        borderTop: `1px solid ${theme.palette.divider}`,
        marginTop: theme.spacing(8),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(6),
            paddingBottom: theme.spacing(6),
        },
    },
}));

export { useStyles as commonStyles };
