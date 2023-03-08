import Button from "@material-ui/core/Button";
import React from "react";
import PrintIcon from "@material-ui/icons/Print";
import { printTenantTransactions } from "./PdfMakePrint";

export default function (props) {
    const { reportName, reportTitle, headCells, dataToPrint } = props
    return (
        <Button
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            disabled={props.disabled}
            onClick={() => printTenantTransactions(reportName, reportTitle, headCells, dataToPrint)}
            startIcon={<PrintIcon />}
        >
            pdf
        </Button>
    );
}
