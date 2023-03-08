import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, List } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 300,
    height: 500,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  const classes = useStyles();
  const {
    checked,
    setChecked,
    left,
    setLeft,
    right, selectedEmailsSource, setEmailsSource, 
    setRight,
	emailsSources,
  } = props;

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-item-${index}-label`;
          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.first_name} ${value.last_name}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className={classes.root}
    >
		  <Grid
		  item
      container
      justify="center"
      alignItems="center"
		  direction="column"
      spacing={2}
    >

      <Grid item md={12}>
        <Typography variant="subtitle1">
          {right.length >= 1  ? `${right.length} contacts selected`
            : "Select contacts to send email"}
        </Typography>		
      </Grid>
        <Grid item md={12}>
                              <TextField
		  						fullWidth
		  						select
								onChange={(event) => setEmailsSource(event.target.value)}
                                variant="outlined"
                                label="Select Emails Source"
                                value={selectedEmailsSource}>
		  {
		  					emailsSources.map((source, index) => {
						return (
		  					<MenuItem key={index} value={source}>
		  						{source}
		  					</MenuItem> );
})
}
		  				</TextField>

		</Grid>
		</Grid>
      <Grid
        item
        container
        direction="row"
        spacing={2}
        justify="center"
        alignItems="center"
      >
        <Grid item>{customList(left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList(right)}</Grid>
      </Grid>
    </Grid>
  );
}
