import XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let companyProfile = {};

export function setCompanyProfile(companyProfileData) {
    companyProfile = companyProfileData
}

export function readXlsxFile(fileData) {
    let readData = XLSX.read(fileData, { type: 'binary', cellDates: true });
    const wsname = readData.SheetNames[0];
    const ws = readData.Sheets[wsname];

    /* Convert array to json*/
    const dataParse = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
    return dataParse
}

const makeCell = (content, rowIndex = -1, options = {}) => {
    return Object.assign({ text: content, fillColor: rowIndex % 2 ? 'white' : '#e8e8e8' }, options);
}
// -- Format the table cells for presentation.
const thl = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: true, alignment: 'left', fontSize: 9 }, options));
}

const tdl = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: false, alignment: 'left', fontSize: 9 }, options));
}

const getReportDate = () => {
    return new Date().toDateString()
}

// -- Create a base document template for the reports.
const createDocumentDefinition = (reportTitle, ...contentParts) => {
    const baseDocDefinition = {
        pageSize: 'A4',
        info: {
            title: `${companyProfile.company_name} - ${reportTitle}`,
            author: 'RentGate Property Management Services',
            subject: `${reportTitle}`,
            keywords: `${reportTitle}`,
        },
        footer: (currentPage, pageCount) => {
            return {
                text: `RentGate Property Management : Page ${currentPage.toString()} of ${pageCount.toString()}`,
                alignment: 'center',
                fontSize: 7
            }
        },
        styles: {
            title: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 0, 0, 8],
            },
            companyLogoStyle: {
                alignment: 'center',
            },
            titleSub: {
                fontSize: 12,
                alignment: 'center',
                margin: [0, 0, 0, 5],
            },
            titleDate: {
                fontSize: 10,
                alignment: 'right',
                margin: [0, 0, 0, 2],
            }
        },

        content: [
            companyProfile.company_logo ? {
                image: 'companyLogo',
                width: 600,
                height: 200,
                style: 'companyLogoStyle'
            } : {
                text: `${companyProfile.company_name}`, style: 'title', width: '*'
            },
            { text: reportTitle, style: 'titleSub', width: '*' },
            { text: `Created: ${getReportDate()}`, style: 'titleDate', width: '*' },
        ],
        images: {
            companyLogo: `${companyProfile.company_logo}`
        }
    };
    const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    docDefinition.footer = baseDocDefinition.footer;
    docDefinition.content.push(...contentParts);
    return docDefinition;
};

export const printDocument = (reportName, reportTitle, documentContent) => {
    const docDefinition = createDocumentDefinition(reportTitle, documentContent);
    // pdfMake.createPdf(docDefinition).download(`underlyingLoanSummary-.pdf`);
    pdfMake.createPdf(docDefinition).open()
}


// -- Generate the Pdf with Data in Rows.
export function printDataRows(reportName, reportTitle, headCells, dataToPrint) {
    const headCellsToPrint = headCells.filter(({ id }) => id !== 'edit' && id !== 'delete' && id !== 'details')

    const fontSize = 9;

    // -- Generate the body of the document table, with headings
    const tableBody = (dataRows) => {
        const tableHeadRow = headCellsToPrint.map((headCell) => thl(`${headCell.label}`, -1, { rowSpan: 1, fontSize: fontSize }))

        const body = [
            tableHeadRow,
        ];

        dataRows.forEach((row, index) => {
            const tableRow = [];
            headCellsToPrint.forEach((headCell) => {
                tableRow.push(tdl(row[headCell.id], index, { fontSize: fontSize }));
            });
            body.push(tableRow);
        });
        const tableTotalsRow = headCellsToPrint.map((headCell) => {
            let columnTotal = 0;
            if (headCell.numeric) {
                columnTotal = dataRows.reduce((total, currentValue) => {
                    return total + parseFloat(currentValue[headCell.id]) || 0
                }, 0)
            }
            return thl(`${columnTotal}`, -1, { rowSpan: 1, fontSize: fontSize })
        })
        body.push(tableTotalsRow);

        return body;
    }

    const tableColumnWidths = headCellsToPrint.map((headCell) => 'auto');

    // -- The main report table, with the table body.
    const tableData = {
        table: {
            headerRows: 1,
            widths: tableColumnWidths,
            body: tableBody(dataToPrint),
        },
    };
    printDocument(`${reportName} ${getReportDate()}`, reportTitle, tableData)
}

const printDataToExcel = (title, subject, dataToExport, fileName) => {
    var workBook = XLSX.utils.book_new();
    workBook.Props = {
        Title: title,
        Subject: subject,
        Author: "RentGate Property Management",
        CreatedDate: new Date(),
    };
    var workBookSheetData = dataToExport;
    var workBookSheet = XLSX.utils.json_to_sheet(workBookSheetData);
    XLSX.utils.book_append_sheet(workBook, workBookSheet, "Sheet1");
    XLSX.writeFile(workBook, `${fileName} - ${new Date().toDateString()}.xlsx`);
}

export function exportDataUploadTemplate(title, subject, headCells, fileName) {
    const dataToExport = [];
    [{}].forEach((row) => {
        const tableRow = {};
        headCells.forEach((headCell) => {
            tableRow[headCell] = row[headCell]
        });
        dataToExport.push(tableRow);
    });
    printDataToExcel(title, subject, dataToExport, fileName)
}

export default function exportDataToXSL(title, subject, headCells, dataRows, fileName) {
    const headCellsToPrint = headCells.filter(({ id }) => id !== 'edit' && id !== 'delete' && id !== 'details')
    const dataToExport = [];
    const columnTotalObject = {}
    dataRows.forEach((row) => {
        const tableRow = {};
        headCellsToPrint.forEach((headCell) => {
            tableRow[headCell.label] = row[headCell.id]
            if (headCell.numeric) {
                const columnTotal = (parseFloat(columnTotalObject[headCell.label]) || 0) + (parseFloat(row[headCell.id]) || 0)
                columnTotalObject[headCell.label] = columnTotal
            }
        });
        dataToExport.push(tableRow);
    });
    dataToExport.push(columnTotalObject);

    printDataToExcel(title, subject, dataToExport, fileName)
}
export function exportPropertyStatementDataToXSL(title, subject, headCells, dataRows, fileName) {
    const headCellsToPrint = [title.includes("Income") ? "income_type" : "expense_type", ...headCells]
    const dataToExport = [];
    dataRows.forEach((row) => {
        const tableRow = {};
        headCellsToPrint.forEach((headCell) => {
            tableRow[headCell] = row[headCell]
        });
        dataToExport.push(tableRow);
    });
    printDataToExcel(title, subject, dataToExport, fileName)
}

export function printInvoice(tenantDetails, items) {
    const text = `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice</title>
        <style>
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
        }
        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }
        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2), .invoice-box table tr td:nth-child(3) {
            text-align: right;
        }            
        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }
        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }
        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.item td{
            border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
            border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(3) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }
            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }
        /** RTL **/
        .rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        }
        .rtl table {
            text-align: right;
        }
        .rtl table tr td:nth-child(2) {
            text-align: left;
        }
        </style>
    </head>
    <body onafterprint="self.close()">
        <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="3">
                        <table>
                            <tr>
                                <td class="title">
                                </td>
                                <td>
                                    Invoice #: ${new Date().toISOString().slice(0, 10)}-${tenantDetails.id_number}<br>
                                    Created: ${new Date().toLocaleString()}<br>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="information">
                    <td colspan="3">
                        <table>
                            <tr>
                                <td>
                                    ${companyProfile.company_name}<br>
                                    ${companyProfile.company_address}<br>
                                    ${companyProfile.company_phone_number}<br>
                                    ${companyProfile.company_primary_email}
                                </td>
                                
                                <td>
                                    ${tenantDetails.first_name} ${tenantDetails.last_name}<br>
                                    ${tenantDetails.id_number}<br>
                                    ${tenantDetails.personal_phone_number}<br>
                                    ${tenantDetails.contact_email}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="heading">
                    <td>
                        Item
                    </td>
                    <td>
                        Due Date
                    </td>
                    <td>
                        Amount
                    </td>
                </tr>
                ${Array.from(items).map(item =>
        `<tr class="item">
        <td>
          ${item.charge_label}
        </td>
        <td>
          ${item.due_date}
        </td>
        <td>
          Ksh ${item.balance}
        </td>
      </tr>`
    )}
                <tr class="total">
                    <td></td>
                    <td></td>
                    <td>
                       Total: Ksh: ${Array.from(items).reduce((total, currentValue) => total + (parseFloat(currentValue.balance) || 0), 0)}
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`
    const my_window = window.open('', 'mywindow', 'status=1');
    my_window.document.write(text);
    my_window.print();

}

export function getReceiptHtml(tenantDetails, items) {
    const text = `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Receipt</title>
        <style>
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
        }
        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }
        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2), .invoice-box table tr td:nth-child(3) {
            text-align: right;
        }
        .invoice-box table tr.top table td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
        }
        .invoice-box table tr.information table td {
            padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }
        .invoice-box table tr.details td {
            padding-bottom: 20px;
        }
        .invoice-box table tr.item td{
            border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
            border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(3) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
                width: 100%;
                display: block;
                text-align: center;
            }
            .invoice-box table tr.information table td {
                width: 100%;
                display: block;
                text-align: center;
            }
        }
        /** RTL **/
        .rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        }
        .rtl table {
            text-align: right;
        }
        .rtl table tr td:nth-child(2) {
            text-align: left;
        }
        </style>
    </head>
    <body onafterprint="self.close()">
        <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="3">
                        <table>
                            <tr>
                                <td class="title">
                                    <img src="" style="width:100%; max-width:300px;">
                                </td>
                                
                                <td>
                                    Receipt #: ${new Date().toISOString().slice(0, 10)}-${tenantDetails.id_number}<br>
                                    Created: ${new Date().toLocaleString()}<br>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="information">
                    <td colspan="3">
                        <table>
                            <tr>
                                <td>
                                    ${companyProfile.company_name}<br>
                                    ${companyProfile.company_address}<br>
                                    ${companyProfile.company_phone_number}<br>
                                    ${companyProfile.company_primary_email}
                                </td>
                                
                                <td>
                                    ${tenantDetails.first_name} ${tenantDetails.last_name}<br>
                                    ${tenantDetails.id_number}<br>
                                    ${tenantDetails.personal_phone_number}<br>
                                    ${tenantDetails.contact_email}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="heading">
                    <td>
                        Item
                    </td>
                    <td>
                        Payment Date
                    </td>
                    <td>
                        Amount
                    </td>
                </tr>
                ${Array.from(items).map(item =>
        `<tr class="item">
        <td>
          ${item.payment_label}
        </td>
        <td>
          ${item.payment_date}
        </td>
        <td>
          Ksh ${item.payment_amount}
        </td>
      </tr>`
    )}
                <tr class="total">
                    <td></td>
                    <td></td>
                    <td>
                       Total: Ksh: ${Array.from(items).reduce((total, currentValue) => total + (parseFloat(currentValue.payment_amount) || 0), 0)}
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>`
    return text;
}

export function printReceipt(tenantDetails, items) {
    const receiptHtmlText = getReceiptHtml(tenantDetails, items);
    const my_window = window.open('', 'mywindow', 'status=1');
    my_window.document.write(receiptHtmlText);
    my_window.print();
}