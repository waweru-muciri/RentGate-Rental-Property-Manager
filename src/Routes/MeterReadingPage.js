import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import MeterReadingInputForm from "../components/meterReadings/MeterReadingInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let MeterReadingPage = (props) => {
    const { history, meterReadingToEdit, contacts, propertyUnits, properties, handleItemSubmit } = props;
    const pageTitle = "Charge Tenant for Meter Reading";
    return (
        <Layout pageTitle={pageTitle}>
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <MeterReadingInputForm
                        meterReadingToEdit={meterReadingToEdit}
                        handleItemSubmit={handleItemSubmit}
                        contacts={contacts}
                        history={history}
                        properties={properties}
                        propertyUnits={propertyUnits}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state, ownProps) => {
    //only allow adding meter readings to units with active leases
    const unitsWithActiveLeases = state.leases
        .filter(({ terminated }) => terminated !== true)
        .map(activeLease => ({
            ...state.propertyUnits.find(unit => unit.id === activeLease.unit_id),
            tenant_id: Array.isArray(activeLease.tenants) ? activeLease.tenants[0] : ''
        }))

    return {
        properties: state.properties,
        propertyUnits: unitsWithActiveLeases,
        meterReadingToEdit: state.meterReadings.find(({ id }) => id === ownProps.match.params.meterReadingId),
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    }
};

MeterReadingPage = connect(mapStateToProps, mapDispatchToProps)(MeterReadingPage);

export default withRouter(MeterReadingPage);
