import Button from "@material-ui/core/Button";
import React from "react";
import PrintIcon from "@material-ui/icons/Print";
import { printDataRows } from "../assets/PrintingHelper";
import PropTypes from 'prop-types';

function PrintArrayToPdfBtn (props) {
    const { disabled, reportName, reportTitle, headCells, dataToPrint } = props
    return (
        <Button
            type="button"
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            disabled={disabled}
            onClick={() => printDataRows(reportName, reportTitle, headCells, dataToPrint)}
            startIcon={<PrintIcon />}
        >
            Pdf
        </Button>
    );
}

PrintArrayToPdfBtn.propTypes = {
    reportName: PropTypes.string.isRequired,
    reportTitle: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
    dataToPrint: PropTypes.array.isRequired,
}

export default PrintArrayToPdfBtn;
