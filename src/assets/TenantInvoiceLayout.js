import React from "react";
import "./tenantInvoice.css";

export default function (props) {
    return (
<html>
<head>
    <title>Yarra Property Management Services</title>
</head>
<body>
        <div className="invoice-box">
            <table cellPadding="0" cellSpacing="0">
                <tr className="information">
                    <td colSpan="2">
                        <table>
                            <tr>
                                <td>
                                    Sparksuite, Inc.
                                    <br />
                                    12345 Sunny Road
                                    <br />
                                    Sunnyville, CA 12345
                                </td>

                                <td>
                                    Acme Corp.
                                    <br />
                                    John Doe
                                    <br />
                                    john@example.com
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr className="information">
                    <td colSpan="2">
                        <table>
                            <tr>
                                <td>
                                    Invoice #: 123
                                    <br />
                                    Created: January 1, 2015
                                    <br />
                                    Due: February 1, 2015
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr className="heading">
                    <td>Payment Method</td>
                    <td>Check #</td>
                </tr>

                <tr className="details">
                    <td>Check</td>
                    <td>1000</td>
                </tr>

                <tr className="heading">
                    <td>Item</td>
                    <td>Price</td>
                </tr>

                <tr className="item">
                    <td>Website design</td>
                    <td>$300.00</td>
                </tr>

                <tr className="item">
                    <td>Hosting (3 months)</td>

                    <td>$75.00</td>
                </tr>

                <tr className="item last">
                    <td>Domain name (1 year)</td>

                    <td>$10.00</td>
                </tr>

                <tr className="total">
                    <td></td>

                    <td>Total: $385.00</td>
                </tr>
            </table>
            <footer>
            <p className="center" style={{fontSize: '8px'}}> Yarra Property Management Services </p>
            </footer>
        </div>
        </body>

</html>
    );
}
