import React, { useEffect, useState } from "react";
import PageHeading from "../components/PageHeading";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import UndoIcon from "@material-ui/icons/Undo";
import ExportToExcelBtn from "../components/ExportToExcelBtn";
import PrintArrayToPdf from "../assets/PrintArrayToPdf";
import CommonTable from "../components/table/commonTable";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { currencyFormatter } from "../assets/commonAssets";
import { parse, isWithinInterval, startOfToday, subDays } from "date-fns";

const headCells = [
    { id: "tenant_name", numeric: false, disablePadding: true, label: "Tenant", },
    { id: "unit_ref", numeric: false, disablePadding: true, label: "Unit Ref/Number", },
    { id: "last_thirty", numeric: false, disablePadding: true, label: "0-30 Days" },
    { id: "last_sixty", numeric: false, disablePadding: true, label: "31-60 Days" },
    { id: "last_ninety", numeric: false, disablePadding: true, label: "61-90 Days" },
    { id: "ninety_plus", numeric: false, disablePadding: true, label: "90+ Days" },
    { id: "totalTenantRentBalance", numeric: false, disablePadding: true, label: "Balance" },

];

const endOfLastThirtyDays = subDays(startOfToday(), 30);
const endOfLastSixtyDays = subDays(startOfToday(), 60);
const endOfLastNinetyDays = subDays(startOfToday(), 90);
const defaultEarliestTime = new Date(2000, 1, 1);

let RentBalancesPage = ({
    properties,
    contacts,
    transactionsCharges,
    classes
}) => {
    let [filteredMappedRentBalancesItems, setFilteredMappedRentalBalances] = useState([]);
    let [mappedRentBalances, setMappedRentBalances] = useState([]);
    let [contactFilter, setContactFilter] = useState(null);
    let [propertyFilter, setPropertyFilter] = useState("all");
    let [totalBalancesAmount, setTotalBalancesAmount] = useState(0);
    let [uniqueTenantsWithBalances, setUniqueTenantsWithBalances] = useState(0);

    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const uniqueTenantIdsWithCharges = new Set(transactionsCharges.map(rentCharge => rentCharge.tenant_id))
        const tenantsWithCharges = transactionsCharges
            .map(rentCharge => ({
                id: rentCharge.tenant_id, tenant_id: rentCharge.tenant_id, tenant_name: rentCharge.tenant_name,
                unit_ref: rentCharge.unit_ref
            }))
        let totalRentBalances = 0
        const mappedTenantsRentBalances = Array.from(uniqueTenantIdsWithCharges).map(tenantId => {
            const tenantDetails = tenantsWithCharges.find(({ tenant_id }) => tenant_id === tenantId) || {}
            const tenantBalancesDetails = {}
            let totalTenantRentBalance = 0
            transactionsCharges.filter(({ tenant_id }) => tenant_id === tenantId).forEach(rentCharge => {
                const rentChargeDueDate = parse(rentCharge.due_date, 'yyyy-MM-dd', new Date())
                totalTenantRentBalance += parseFloat(rentCharge.balance) || 0
                //check if due date is within a month ago
                if (isWithinInterval(rentChargeDueDate, { start: endOfLastThirtyDays , end: startOfToday() })) {
                    tenantBalancesDetails['last_thirty'] = rentCharge.balance
                }
                //check if due date is within 31-60 days ago
                else if (isWithinInterval(rentChargeDueDate, { start: endOfLastSixtyDays, end: endOfLastThirtyDays })) {
                    tenantBalancesDetails['last_sixty'] = rentCharge.balance
                }
                //check if due date is within 61-90 days ago
                else if (isWithinInterval(rentChargeDueDate, { start: endOfLastNinetyDays, end: endOfLastSixtyDays })) {
                    tenantBalancesDetails['last_ninety'] = rentCharge.balance
                }
                //check if due date is within 91+ days ago
                else if (isWithinInterval(rentChargeDueDate, { start: defaultEarliestTime, end: endOfLastNinetyDays })) {
                    tenantBalancesDetails['ninety_plus'] = rentCharge.balance
                }
            })
            tenantBalancesDetails.totalTenantRentBalance = totalTenantRentBalance
            totalRentBalances += totalTenantRentBalance
            return Object.assign(tenantBalancesDetails, tenantDetails)
        })
        setUniqueTenantsWithBalances(uniqueTenantIdsWithCharges.size)
        setTotalBalancesAmount(totalRentBalances)
        setMappedRentBalances(mappedTenantsRentBalances)
        setFilteredMappedRentalBalances(mappedTenantsRentBalances);
    }, [transactionsCharges]);

    const handleSearchFormSubmit = (event) => {
        event.preventDefault();
        //filter the transactionsCharges according to the search criteria here
        const filteredMappedRentBalances = mappedRentBalances.filter(({ tenant_id }) =>
            !contactFilter ? true : tenant_id === contactFilter.id
        )
        setFilteredMappedRentalBalances(filteredMappedRentBalances)
    };


    const resetSearchForm = (event) => {
        event.preventDefault();
        setContactFilter(null)
        setPropertyFilter('all')
    };

    return (
        <Grid
            container
            spacing={2}
            justify="center" direction="column"
        >
            <Grid item key={2}>
                <PageHeading text={"Outstanding Rent Balances"} />
            </Grid>
            <Grid
                container
                spacing={2}
                item
                alignItems="center"
                direction="row"
                key={1}
            >
                <Grid item>
                    <ExportToExcelBtn
                        disabled={selected.length <= 0}
                        reportName={`Tenants Outstanding Rent Balances Records`}
                        reportTitle={'Tenants Outstanding Rent Balances Data'}
                        headCells={headCells}
                        dataToPrint={mappedRentBalances.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
                <Grid item>
                    <PrintArrayToPdf
                        disabled={selected.length <= 0}
                        reportName={'Tenants Outstanding Rent Balances Data'}
                        reportTitle={`Tenants Outstanding Rent Balances Records`}
                        headCells={headCells}
                        dataToPrint={mappedRentBalances.filter(({ id }) => selected.includes(id))}
                    />
                </Grid>
            </Grid>
            <Grid item container>
                <Grid item sm={12}>
                    <Box
                        border={1}
                        borderRadius="borderRadius"
                        borderColor="grey.400"
                    >
                        <form
                            className={classes.form}
                            id="contactSearchForm"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <Grid
                                container
                                spacing={2}
                                justify="center"
                                direction="column"
                            >
                                <Grid item container direction="column">
                                    <Grid item container direction="row" spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                variant="outlined"
                                                name="property_filter"
                                                label="Property"
                                                id="property_filter"
                                                onChange={(event) => {
                                                    setPropertyFilter(
                                                        event.target.value
                                                    );
                                                }}
                                                value={propertyFilter}
                                            >
                                                <MenuItem key={"all"} value={"all"}>All Properties</MenuItem>
                                                {properties.map(
                                                    (property, index) => (
                                                        <MenuItem
                                                            key={index}
                                                            value={property.id}
                                                        >
                                                            {property.ref}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                id="contact_filter"
                                                options={contacts}
                                                getOptionSelected={(option, value) => option.id === value.id}
                                                name="contact_filter"
                                                defaultValue=""
                                                onChange={(event, newValue) => {
                                                    setContactFilter(newValue);
                                                }}
                                                value={contactFilter}
                                                getOptionLabel={(tenant) => tenant ? `${tenant.first_name} ${tenant.last_name}` : ''}
                                                style={{ width: "100%" }}
                                                renderInput={(params) => <TextField {...params} label="Tenant" variant="outlined" />}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={2}
                                    item
                                    justify="flex-end"
                                    alignItems="center"
                                    direction="row"
                                    key={1}
                                >
                                    <Grid item>
                                        <Button
                                            onClick={(event) => handleSearchFormSubmit(event)}
                                            type="submit"
                                            form="contactSearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<SearchIcon />}
                                        >
                                            SEARCH
                                    </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            onClick={(event) => resetSearchForm(event)}
                                            type="reset"
                                            form="contactSearchForm"
                                            color="primary"
                                            variant="contained"
                                            size="medium"
                                            startIcon={<UndoIcon />}
                                        >
                                            RESET
                                    </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
            <Grid item container>
                <Grid item sm={12}>
                    <Box border={1} borderRadius="borderRadius" borderColor="grey.400" className={classes.form}>
                        <Grid container direction="row" spacing={1}>
                            <Grid item container md={6}>
                                <Grid item sm={12}>
                                    <Typography variant="subtitle1" align="center">
                                        Total Balances Amount: {currencyFormatter.format(totalBalancesAmount)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container md={6}>
                                <Grid item sm={12}>
                                    <Typography variant="subtitle1" align="center">
                                        Unique Tenants With Balances: {uniqueTenantsWithBalances}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid item container>
                <Grid item sm={12}>
                    <CommonTable
                        selected={selected}
                        setSelected={setSelected}
                        rows={filteredMappedRentBalancesItems}
                        headCells={headCells}
                        noDetailsCol={true}
                        noEditCol={true}
                        noDeleteCol={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RentBalancesPage;
