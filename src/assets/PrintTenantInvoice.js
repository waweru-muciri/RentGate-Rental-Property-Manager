import Button from "@material-ui/core/Button";
import React from "react";
import PrintIcon from "@material-ui/icons/Print";
import { printDocument } from "./PdfMakePrint";

export default function (props) {
    const notice = typeof props.noticeToPrint !== 'undefined' ? props.noticeToPrint : {}
    const noticeDetails = {
        details: notice.notice_details,
        tenant_name: notice.tenant_name,
        tenant_email: notice.contact_email,
        tenant_phone_number: notice.personal_phone_number,
        landlord_name: notice.landlord_name || 'Landlord Name',
        landlord_phone_number: notice.landlord_phone_number || 'Landlord Phone Number',
        landlord_email: notice.landlord_email || 'landlordemail@email.com',
        tenant_id_number: notice.tenant_id_number,
        vacating_date: notice.vacating_date,
        company_phone_number: notice.company_phone_number || 'Company Phone Number',
        company_name: notice.company_name || 'Company Name',
        property_ref: notice.property_ref,
        property_address: notice.property_address,
        company_address: notice.company_address || '123 Company Address',
    }
    var docDefinition = [{
        columns: [
            [
                noticeDetails.company_name,
                noticeDetails.company_phone_number,
                noticeDetails.company_address,
            ],
            [
                { text: noticeDetails.tenant_name, alignment: 'center' },
                { text: noticeDetails.tenant_phone_number, alignment: 'center' },
                { text: noticeDetails.tenant_email, alignment: 'center' },
                { text: noticeDetails.tenant_id_number, alignment: 'center' },
            ],
        ],
        columnGap: 10,

    },
    { text: `OBJECT: NOTICE OF TERMINATION OF LEASE ON ${noticeDetails.vacating_date}`, bold: true, fontSize: 10, decoration: "underline", margin: [0, 6, 0, 6] },
    { text: `Dear, ${noticeDetails.tenant_name}, Unit ${noticeDetails.property_ref}`, bold: true, fontSize: 10, },
    { text: noticeDetails.details, margin: [0, 10, 0, 10] },
    { text: 'Sincerely,', },
    { text: noticeDetails.landlord_name, },
    { text: `${noticeDetails.landlord_phone_number}, ${noticeDetails.landlord_email},` },
    { text: 'Landlord', },
    ]
    return (
        <Button
            disabled={props.disabled}
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => printDocument(`${noticeDetails.tenant_name} vacating notice`, '', docDefinition)}
            startIcon={<PrintIcon />}
        >
            pdf
        </Button>
    );
}
