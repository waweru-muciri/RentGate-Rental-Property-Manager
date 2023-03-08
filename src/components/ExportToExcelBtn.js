import Button from "@material-ui/core/Button";
import React from "react";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import exportDataToXSL from "../assets/PrintToExcel";
import PropTypes from 'prop-types';

function ExportToExcelBtn (props) {
	const { disabled, reportName, reportTitle, headCells, dataToPrint } = props
	return (
		<Button
			type="button"
			aria-label="Export to Excel"
			variant="contained"
			size="medium"
			color="primary"
			disabled={disabled}
			onClick={() => exportDataToXSL(reportName, reportTitle, headCells, dataToPrint, reportName)}
			startIcon={<ImportExportIcon />}
		>
			Excel
		</Button >
	);
}

ExportToExcelBtn.propTypes = {
    reportName: PropTypes.string.isRequired,
    reportTitle: PropTypes.string.isRequired,
    headCells: PropTypes.array.isRequired,
    dataToPrint: PropTypes.array.isRequired,
}

export default ExportToExcelBtn;
