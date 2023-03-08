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
    const { currentUser, history, meterReadings, users, contacts, propertyUnits, properties, handleItemSubmit } = props;
    let meterReadingToEditId = props.match.params.meterReadingId;
    let meterReadingToEdit = meterReadings.find(({ id }) => id === meterReadingToEditId);
    meterReadingToEdit =
        typeof meterReadingToEdit === "undefined"
            ? {
                property: '',
                property_unit: '',
                reading_date: defaultDate,
                prior_value: '',
                current_value: '',
                base_charge: '',
                unit_charge: '',
                meter_type: '',
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
                        history={history}
                        currentUser={currentUser}
                        properties={properties}
                        propertyUnits={propertyUnits}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        properties: state.properties,
        propertyUnits: state.propertyUnits,
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
