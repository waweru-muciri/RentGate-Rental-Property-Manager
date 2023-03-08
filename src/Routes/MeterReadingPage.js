import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import MeterReadingInputForm from "../components/meterReadings/MeterReadingInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let MeterReadingPage = (props) => {
    const {history, meterReadings, contacts, propertyUnits, properties, handleItemSubmit } = props;
    //only allow adding meter readings to units with tenants
    const propertyUnitsWithTenants = propertyUnits.filter((propertyUnit) => propertyUnit.tenants.length)
    let meterReadingToEditId = props.match.params.meterReadingId;
    const meterReadingToEdit = meterReadings.find(({ id }) => id === meterReadingToEditId)
    const pageTitle = "Charge Tenants for Meter Reading";
    return (
        <Layout pageTitle={pageTitle}>
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <MeterReadingInputForm
                        meterReadingToEdit={meterReadingToEdit}
                        handleItemSubmit={handleItemSubmit}
                        contacts={contacts}
                        history={history}
                        properties={properties}
                        propertyUnits={propertyUnitsWithTenants}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        properties: state.properties,
        propertyUnits: state.propertyUnits,
        meterReadings: state.meterReadings,
        contacts: state.contacts,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

MeterReadingPage = connect(mapStateToProps, mapDispatchToProps)(MeterReadingPage);

export default withRouter(MeterReadingPage);
