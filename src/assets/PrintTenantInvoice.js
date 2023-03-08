import jsPDF from "jspdf";
import Button from "@material-ui/core/Button";
import React from "react";
import { renderToString } from "react-dom/server";
import PrintIcon from "@material-ui/icons/Print";
import TenantInvoiceLayout from "./TenantInvoiceLayout";
import html2canvas from "html2canvas";

export default function (props) {
	window.html2canvas = html2canvas;
	var doc = new jsPDF("p", "pt", "a4");
	var invoiceString = renderToString(<TenantInvoiceLayout />);
	return (
		<Button
			aria-label="Print to Pdf"
			variant="contained"
			size="medium"
			color="primary"
			// disabled={props.disabled}
			onClick={() => {
				doc.html(invoiceString, {
					callback: function (doc) {
						doc.save();
					},
				});
			}}
			startIcon={<PrintIcon />}
		>
			pdf
		</Button>
	);
}
