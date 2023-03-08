import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "left",
        fontWeight: 700,
    },
}));

export default function PageHeading(props) {
    const styles = useStyles();
    return (
        <Typography
            variant="h5"
            className={styles.root}
            gutterBottom
        >
            {props.text ? props.text : "Page Heading"}
        </Typography>
    );
}
