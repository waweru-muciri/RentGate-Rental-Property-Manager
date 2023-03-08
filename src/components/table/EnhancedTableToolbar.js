import React from 'react';
import PropTypes from 'prop-types';
import { IconButton,Typography , Tooltip, Toolbar } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
        </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle">
                        Cows List
        </Typography>
                )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete"onClick={(event) => window.alert('Delete clicked')}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                    <div></div>

                )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar
