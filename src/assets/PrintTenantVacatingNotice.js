import jsPDF from "jspdf";
import Button from "@material-ui/core/Button";
import React from "react";
import { renderToString } from "react-dom/server";
import PrintIcon from "@material-ui/icons/Print";
import VacatingNoticeLayout from "./VacatingNoticeLayout";
import html2canvas from "html2canvas";

export default function (props) {
    window.html2canvas = html2canvas;
    var doc = new jsPDF("l", "pt", "a4");
    const notice = typeof props.noticeToPrint !== 'undefined' ? props.noticeToPrint : {}
    const noticeDetails = {
        tenant_name: notice.tenant_name,
        tenant_email: notice.tenant_email,
        tenant_phone_number: notice.tenant_phone_number,
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
    var vacatingNoticeString = renderToString(<VacatingNoticeLayout noticeToPrint={noticeDetails} />);
    return (
        <Button
            disabled={props.disabled}
            aria-label="Print to Pdf"
            variant="contained"
            size="medium"
            color="primary"
            // disabled={props.disabled}
            onClick={() => {
                doc.html(vacatingNoticeString, {
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
