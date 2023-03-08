import Button from "@material-ui/core/Button";
import React from "react";
import ImportExportIcon from "@material-ui/icons/ImportExport";

export default class ExportToExcelBtn extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button
				variant="contained"
				size="medium"
				color="primary"
				disabled={this.props.disabled}
				onClick={this.props.onClick}
				startIcon={<ImportExportIcon />}
			>
				Excel
			</Button>
		);
	}
}
