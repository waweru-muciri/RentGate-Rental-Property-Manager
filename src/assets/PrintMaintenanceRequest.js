import jsPDF from "jspdf";
import Button from "@material-ui/core/Button";
import React from "react";
import { renderToString } from "react-dom/server";
import PrintIcon from "@material-ui/icons/Print";
import MaintenanceRequestPrintLayout from "./MaintenanceRequestPrintLayout";
import html2canvas from "html2canvas";

export default function (props) {
    window.html2canvas = html2canvas;
    var doc = new jsPDF("l", "pt", "a4");
    const maintenanceRequest = typeof props.maintenanceRequestToPrint !== 'undefined' ? props.maintenanceRequestToPrint : {}
    const maintenanceRequestDetails = {
        tenant_name: maintenanceRequest.tenant_name,
        tenant_email: maintenanceRequest.tenant_email,
        tenant_phone_number: maintenanceRequest.tenant_phone_number,
        landlord_name: maintenanceRequest.landlord_name || 'Landlord Name',
        landlord_phone_number: maintenanceRequest.landlord_phone_number || 'Landlord Phone Number',
        landlord_email: maintenanceRequest.landlord_email || 'landlordemail@email.com',
        tenant_id_number: maintenanceRequest.tenant_id_number,
        date_created: maintenanceRequest.date_created,
        company_phone_number: maintenanceRequest.company_phone_number || 'Company Phone Number',
        company_name: maintenanceRequest.company_name || 'Company Name',
        property_ref: maintenanceRequest.property_ref,
        maintenance_details: maintenanceRequest.maintenance_details,
        property_address: maintenanceRequest.property_address,
        company_address: maintenanceRequest.company_address || '123 Company Address',
    }
    var maintenanceRequestString = renderToString(<MaintenanceRequestPrintLayout maintenanceRequestToPrint={maintenanceRequestDetails} />);
    return (
        <Button
            disabled={props.disabled}
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            // disabled={props.disabled}
            onClick={() => {
                doc.html(maintenanceRequestString, {
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
