import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import MeterReadingInputForm from "../components/meterReadings/MeterReadingInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'
import moment from "moment";

const defaultDate = moment().format("YYYY-MM-DD");

let MeterReadingPage = (props) => {
    const { currentUser, meterReadings, users, contacts, properties, handleItemSubmit } = props;
    let meterReadingToEditId = props.match.params.meterReadingId;
    let meterReadingToEdit = meterReadings.find(({ id }) => id === meterReadingToEditId);
    meterReadingToEdit =
        typeof meterReadingToEdit === "undefined"
            ? {
                property: '',
                reading_date: defaultDate,
                prior_value: 0,
                current_value: 0,
                base_charge: 0,
                unit_charge: 0,
                reading_type: '',
            }
            : meterReadingToEdit;
    let pageTitle = meterReadingToEditId ? "Edit Meter Reading" : "New Meter Reading";
    return (
        <Layout pageTitle="Meter Reading Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <MeterReadingInputForm
                        meterReadingToEdit={meterReadingToEdit}
                        handleItemSubmit={handleItemSubmit}
                        users={users}
                        currentUser={currentUser}
                        contacts={contacts}
                        properties={properties}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        meterReadings: state.meterReadings,
        users: state.users,
        contacts: state.contacts,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (user, item, url) => dispatch(handleItemFormSubmit(user, item, url)),
    }
};

MeterReadingPage = connect(mapStateToProps, mapDispatchToProps)(MeterReadingPage);

export default withRouter(MeterReadingPage);
