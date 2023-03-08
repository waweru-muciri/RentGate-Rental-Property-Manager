import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const makeCell = (content, rowIndex = -1, options = {}) => {
    return Object.assign({ text: content, fillColor: rowIndex % 2 ? 'white' : '#e8e8e8' }, options);
}

// -- Format the table cells for presentation.
const thl = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: true, alignment: 'left', fontSize: 9 }, options));
}

const thr = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: true, alignment: 'right', fontSize: 9 }, options));
}
const tdl = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: false, alignment: 'left', fontSize: 9 }, options));
}
const tdr = (content, rowIndex = -1, options = {}) => {
    return makeCell(content, rowIndex, Object.assign({ bold: false, alignment: 'right', fontSize: 9 }, options));
}

const truncateContent = (content, maxLength = 17) => {
    return ''.concat(content.slice(0, maxLength), content.length > maxLength ? '…' : '');
}

// -- Create a base document template for the reports.
const createDocumentDefinition = (reportDate, reportTitle, ...contentParts) => {
    const baseDocDefinition = {
        pageSize: 'A4',
        info: {
            title: 'Yarra Property Management Services Document',
            author: 'yarra property management',
            subject: 'subject of document',
            keywords: 'keywords for document',
        },
        footer: (currentPage, pageCount) => {
            return {
                text: `Yarra Property Management : Page ${currentPage.toString()} of ${pageCount.toString()}`,
                alignment: 'center',
                fontSize: 7
            }
        },
        styles: {
            title: {
                fontSize: 14,
                alignment: 'center',
                margin: [0, 0, 0, 20],
            },
            titleDate: {
                fontSize: 10,
                alignment: 'left',
            }
        },

        content: [
            { text: reportTitle, style: 'title', width: '*' },
            { text: `Created: ${reportDate}`, style: 'titleDate', width: '*' },
        ],
    };
    const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    docDefinition.footer = baseDocDefinition.footer;
    docDefinition.content.push(...contentParts);
    return docDefinition;
};

export const printDocument = (reportName, reportTitle, documentContent) => {
    const reportDate = new Date().toDateString()
    const docDefinition = createDocumentDefinition(reportDate, reportTitle, documentContent);
    // pdfMake.createPdf(docDefinition).download(reportName)
    pdfMake.createPdf(docDefinition).open()
}


// -- Generate the Underlying Transactions Summary report.
export function printTenantTransactions(reportName,reportTitle, headCells, dataToPrint) {

    const fontSize = 9;

    // -- Generate the body of the document table, with headings
    const tableBody = (dataRows) => {
        const tableHeadRow = headCells.map((headCell) => thl(`${headCell.label}`, -1, { rowSpan: 1, fontSize: fontSize }))

        const body = [
            tableHeadRow,
        ];

        dataRows.forEach((row, index) => {
            const tableRow = [];
            headCells.forEach((headCell) => {
                tableRow.push(tdl(row[headCell.id], index, { fontSize: fontSize }));
            });
            body.push(tableRow);
        });
        return body;
    }

    const tableColumnWidths = headCells.map((headCell) => 'auto');

    // -- The main report table, with the table body.
    const tableData = {
        table: {
            headerRows: 1,
            widths: tableColumnWidths,
            body: tableBody(dataToPrint),
        }
    };
    const reportDate = new Date().toDateString()
    printDocument(`${reportName} ${reportDate}`, reportTitle, tableData)
}
