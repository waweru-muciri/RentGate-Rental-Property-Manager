import Button from "@material-ui/core/Button";
import React from "react";
import PrintIcon from "@material-ui/icons/Print";
import { printDocument } from "./PdfMakePrint";

export default function (props) {
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
    var docDefinition = [{
            columns: [
            [
                maintenanceRequestDetails.company_name, 
                maintenanceRequestDetails.company_phone_number, 
                maintenanceRequestDetails.company_address, 
            ], 
            [
                {text: maintenanceRequestDetails.tenant_name, alignment: 'center'}, 
                {text: maintenanceRequestDetails.tenant_phone_number, alignment: 'center'}, 
                {text: maintenanceRequestDetails.tenant_email, alignment: 'center'}, 
                {text: maintenanceRequestDetails.property_ref, alignment: 'center'}, 
            ], 
            ],
            columnGap: 10,
            
        }, 
        {text: `OBJECT: MAINTENANCE REQUEST ON ${maintenanceRequestDetails.date_created}`, bold: true, fontSize: 14, decoration: "underline", margin: [ 0, 6, 0, 6 ] }, 
        {text: `Unit:  ${maintenanceRequestDetails.property_ref}, ${maintenanceRequestDetails.property_address}`, bold: true, fontSize: 12, },
        [{text: `Request Details : `, fontSize: 12,  bold: true, margin: [ 0, 5, 0, 0 ]},
        {text: `${maintenanceRequestDetails.maintenance_details}`,fontSize: 12, margin: [ 0, 5, 0, 10 ]},
        {text: 'Sincerely,', }],
        {text: maintenanceRequestDetails.landlord_name, fontSize: 12 },
        {text: `${maintenanceRequestDetails.landlord_phone_number}, ${maintenanceRequestDetails.landlord_email},` ,fontSize: 12},
        {text: 'Landlord', fontSize: 14},
        ]

    return (
        <Button
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            disabled={props.disabled}
            onClick={() => printDocument(`${maintenanceRequestDetails.tenant_name} maintenance request`, docDefinition)}
            startIcon={<PrintIcon />}
        >
            pdf
        </Button>
    );
}
