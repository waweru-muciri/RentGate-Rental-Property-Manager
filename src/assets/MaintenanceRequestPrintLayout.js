import React from "react";
import "./tenantInvoice.css";

export default function (props) {
    const { landlord_email, landlord_name, landlord_phone_number, tenant_name, tenant_email, tenant_phone_number, company_address, company_name, company_phone_number, property_address, property_ref, date_created, maintenance_details, } = props.maintenanceRequestToPrint
    return (
        <div className="invoice-box">
            <table cellPadding="0" cellSpacing="0">
                <tr className="information">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td>
                                    Created: {new Date().toDateString()}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr className="information">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td>
                                    {company_name}<br />
                                    {company_phone_number}<br />
                                    {company_address}
                                </td>

                                <td>
                                    {tenant_name}<br />
                                    {tenant_phone_number}<br />
                                    {tenant_email}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <div style={{ margin: '7.5pt' }}>
                <h4 style={{ borderBottom: '2px solid', display: 'inline-block', margin: 0, padding: 0 }}>OBJECT: PROPERTY MAINTENANCE REQUEST</h4>
                <h5>Property: {property_ref}, {property_address}</h5>
                <h5>Date Requested: {date_created}</h5>
                <p>Details: {maintenance_details}</p>
                <p>{landlord_name}, </p>
                <p>{landlord_phone_number}, {landlord_email},</p>
                <p>Landlord</p>
            </div>
            <footer>
                <p className="center" style={{ fontSize: '6pt' }}> Yarra Property Management Services </p>
            </footer>
        </div>
    );
}
