import React from "react";
// import "./tenantInvoice.css";

export default function (props) {
    const { landlord_email, landlord_name, landlord_phone_number, tenant_name, tenant_email, tenant_phone_number, company_address, company_name, company_phone_number, property_address, vacating_date, } = props.noticeToPrint
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
                <h4 style={{ borderBottom: '2px solid', display: 'inline-block', margin: 0, padding: 0 }}>OBJECT: NOTICE OF TERMINATION OF LEASE</h4>
                <h5>Dear, {tenant_name}</h5>
                <p>This is to notify you to quit and deliver up possession of {property_address} which you currently occupy
                    as
                    our tenant, by {vacating_date}. This notice is given pursuant to paragraph 5 of your lease agreement.
            </p>
                <p>
                    Notice is further given that if you fail to vacate the above-described premises on or before the date
                    specified in the paragraph above, the lessor will insitute Unlawful Detainer proceedings against you to
                    recover possession of the premises, treble damages, attorney fees and costs.
            </p>
                <p>
                    We remind you it is your obligation to leave the premises in a reasonable condition at the end of your
                    tenancy.
            </p>
                <p>
                    Thank you for your cooperation.
            </p>
                <p>
                    Sincerely,
            </p>
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
