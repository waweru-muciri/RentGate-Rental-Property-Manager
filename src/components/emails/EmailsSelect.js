import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { commonStyles } from "../commonStyles";


function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList(props) {
  const classes = commonStyles();
  const { contacts, users, contactToSendEmailTo, contactSource, submitEmailSourceValues, handleBack } = props;
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [selectedEmailsSource, setSelectedEmailsSource] = React.useState('Tenants');
  const emailsSources = ["Tenants", "Users"];

  useEffect(() => {
    setLeft(contacts);
    setSelectedEmailsSource('Tenants')
  }, [contacts])

  useEffect(() => {
    setChecked([contactToSendEmailTo]);
    setSelectedEmailsSource(contactSource)
  }, [contactToSendEmailTo])

  useEffect(() => {
    setLeft(users);
    setSelectedEmailsSource('Users')
  }, [users])

  const getEmailsFromSource = () => {
    return selectedEmailsSource === "Tenants" ? right.map(tenantDetails => tenantDetails.contact_email)
      : right.map(userDetails => userDetails.primary_email)
  }

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
      direction="column"
      className={classes.root}
    >
      <Grid
        item
        container
        alignItems="center"
        direction="column"
        spacing={2}
      >

        <Grid item>
          <Typography variant="subtitle1">
            {right.length >= 1 ? `${right.length} ${selectedEmailsSource} selected`
              : `Select ${selectedEmailsSource} to send email`}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            onChange={(event) => {
              setSelectedEmailsSource(event.target.value)
              switch (event.target.value) {
                case 'Tenants': setLeft(contacts); setRight([]); setChecked([]);
                  break;

                case 'Users': setLeft(users); setRight([]); setChecked([]);
                  break;

                default: break;
              }
            }}
            variant="outlined"
            label="Select Emails Source"
            value={selectedEmailsSource}>
            {
              emailsSources.map((source, index) => {
                return (
                  <MenuItem key={index} value={source}>
                    {source}
                  </MenuItem>);
              })
            }
          </TextField>
        </Grid>
        <Grid
          item
          container
          direction="row"
          spacing={2}
        >
          <Grid item sm>{customList(left)}</Grid>
          <Grid item sm={4} container direction="column" spacing={1} alignItems="center">
            <Grid item>
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
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
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
          <Grid item sm>{customList(right)}</Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        spacing={2}
      >
        <Grid item>
          <Button
            onClick={handleBack}
            variant="contained">
            Back
                      </Button>
        </Grid>
        <Grid item>
          <Button
            disabled={!right.length}
            onClick={() => { submitEmailSourceValues(getEmailsFromSource()) }}
            variant="contained"
            color="primary">
            Send
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
