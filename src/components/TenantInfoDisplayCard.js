import React from "react";
import Typography from "@material-ui/core/Typography";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { commonStyles } from "../components/commonStyles";

let TenantInfoDisplayCard = (props) => {
    const classes = commonStyles();
    const {title, avatar, avatarSrc, subheader, cardContent} = props
    return (
        <Card className={classes.fullHeightWidthContainer} variant="outlined" elevation={1}>
            <CardHeader
                avatar={
                    <Avatar aria-label="contact avatar" src={avatarSrc ? avatarSrc : ''} className={classes.avatar}>
                        {avatar}
                    </Avatar>
                }
                title={title}
                subheader={subheader}
            />
            <CardContent>
               {
                   cardContent.map((content, contentIndex) => 
                   <Typography key={contentIndex} gutterBottom variant="body2" component="h2">
                    {content.name} : {content.value}
                   </Typography>)
               }
            </CardContent>
        </Card>
    );
};

export default TenantInfoDisplayCard;
