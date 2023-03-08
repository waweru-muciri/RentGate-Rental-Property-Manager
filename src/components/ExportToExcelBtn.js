import Button from "@material-ui/core/Button";
import React from "react";
import ImportExportIcon from "@material-ui/icons/ImportExport";

export default function (props) {
		return (
			<Button
				variant="contained"
				size="medium"
				color="primary"
				disabled={props.disabled}
				onClick={props.onClick}
				startIcon={<ImportExportIcon />}
			>
				Excel
			</Button>
		);
}
