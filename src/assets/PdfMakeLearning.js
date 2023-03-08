/* Use PdfMake to generate a financial report. */


// -- Get the raw data from another CodePen resource.
//    And transform the data to the required format for aggregation and presentation.
//    This retrieval happens asynchronously, but fast enough for the report
//    generation button not to be compromised.
let transformedLNRData = [];
const xhrLNR = new XMLHttpRequest();
xhrLNR.addEventListener('load', function () {
    transformedLNRData = JSON.parse(this.responseText).map((textRow) => {
        return {
            'loanNote': textRow.loanNote,
            'reference': textRow.reference,
            'interestRate': new Big(textRow.interestRate),
            'initialPrincipal': new Big(textRow.initialPrincipal),
            'currentBalance': new Big(textRow.currentBalance)
        };
    });
});
//xhrLNR.open('GET', 'https://codepen.io/s5b/pen/1455fa236018d0a6f54651482e97f011.js');
xhrLNR.open('GET', 'https://crossorigin.me/https://www.dropbox.com/s/dvin1alvc4l5nvd/data-LNR.json');
xhrLNR.send();

let transformedMRData = [
    { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@special.example.com", "loanUnits": "36.19", "cashUnits": "51.08", "totalUnits": "87.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@123456example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@12345example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@1234example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
    , { "memberName": "Barry McKenzie", "memberEmail": "baz@example.com", "loanUnits": "368.19", "cashUnits": "51.08", "totalUnits": "419.27" }
].map((textRow) => {
    return {
        'memberName': textRow.memberName,
        'memberEmail': textRow.memberEmail,
        'loanUnits': new Big(textRow.loanUnits),
        'cashUnits': new Big(textRow.cashUnits),
        'totalUnits': new Big(textRow.totalUnits)
    };
});

let transformedULSData = [
    { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "irregular" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "810345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "881888", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-05-28", "payments": "4", "status": "Prepaid" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "Repaid" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
    , { "borrowerName": "Gavins Smallgoods", "loanNoteFirst": "1", "loanNoteLast": "10345", "originalPrincipal": "200000", "currentBalance": "156734.6345", "borrowerRate": "14.5", "term": "36", "drawdown": "2017-12-28", "payments": "4", "status": "" }
].map((textRow) => {
    return {
        "borrowerName": textRow.borrowerName,
        "loanNoteFirst": textRow.loanNoteFirst,
        "loanNoteLast": textRow.loanNoteLast,
        "originalPrincipal": new Big(textRow.originalPrincipal),
        "currentBalance": new Big(textRow.currentBalance),
        "borrowerRate": new Big(textRow.borrowerRate),
        "term": textRow.term,
        "drawdown": moment(textRow.drawdown),
        "payments": textRow.payments,
        "status": textRow.status
    }
});

/*  *
const xhrMR = new XMLHttpRequest();
xhrMR.addEventListener('load', function () {
    transformedMRData = JSON.parse(this.responseText).map((textRow) => {
        return {
            'memberName': textRow.memberName,
            'loanUnits': new Big(textRow.loanUnits),
            'cashUnits': new Big(textRow.cashUnits),
            'totalUnits': new Big(textRow.totalUnits)
        };
    });
});
xhrMR.open('GET', 'https://codepen.io/s5b/pen/GMOoYj.js');
xhrMR.send();
/*  */


// Formatting money.
const asMoney = (rawMoney) => rawMoney.round(2, 1).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");


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

// -- Set the report date for display only.
const reportDate = () => '31 August 2017'

// --  Calculate the total of the current balances.
const sumCurrentBalance = (data) => {
    return asMoney(data.reduce((sum, current) => sum.plus(current['currentBalance']), new Big(0.0)));
}

const truncateContent = (content, maxLength = 17) => {
    return ''.concat(content.slice(0, maxLength), content.length > maxLength ? '…' : '');
}


// -- Create a base document template for the reports.
const createDocumentDefinition = (reportDate, subHeading, ...contentParts) => {
    const baseDocDefinition = {
        pageSize: 'A4',
        footer: (currentPage, pageCount) => {
            return {
                text: `${reportDate} : Page ${currentPage.toString()} of ${pageCount.toString()}`,
                alignment: 'center',
                fontSize: 7
            }
        },

        styles: {
            title: {
                fontSize: 24
            },
            titleSub: {
                fontSize: 18
            },
            titleDate: {
                fontSize: 14,
                alignment: 'right',
                bold: true
            }
        },

        content: [
            {
                columns: [
                    { text: 'TruePillars Investment Trust', style: 'title', width: '*' },
                    { text: reportDate, style: 'titleDate', width: '160' },
                ]
            },
            { text: `${subHeading}\n\n`, style: 'titleSub' },
        ],
    };
    const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    docDefinition.footer = baseDocDefinition.footer;
    docDefinition.content.push(...contentParts);
    return docDefinition;
};



// -- Make a Loan Note Register report. (This is attached to the button.)
function makeLoanNoteRegisterDoc() {

    // -- Table summary
    const tableSummary = {
        table: {
            widths: ['*', 70],
            body: [
                [{ text: reportDate(), bold: true }, tdr(sumCurrentBalance(transformedLNRData), 'white')]
            ]
        }
    };

    // -- Generate the body of the document table, with headings
    const tableBody = (dataRows) => {
        const body = [
            [
                thl('Loan\nNote'),
                thl('\nReference'),
                thr('Interest\nRate'),
                thr('Initial\nPrincipal'),
                thr('Current\nBalance')
            ]
        ]
        dataRows.forEach((row, index) => {
            const tableRow = []
            tableRow.push(tdl(row['loanNote'], index))
            tableRow.push(tdl(row['reference'], index))
            tableRow.push(tdr(row['interestRate'].round(1, 1).toFixed(1).toString(), index))
            tableRow.push(tdr(asMoney(row['initialPrincipal']), index))
            tableRow.push(tdr(asMoney(row['currentBalance']), index))
            body.push(tableRow)
        })
        return body
    }

    // -- The main report table, with the table body.
    const tableData = {
        table: {
            headerRows: 1,
            widths: [50, '*', 70, 70, 70],

            body: tableBody(transformedLNRData),
        }
    };

    const docDefinition = createDocumentDefinition(reportDate(), 'Loan Note Register', tableSummary, ' ', tableData);
    pdfMake.createPdf(docDefinition).download(`loanNoteRegister-${reportDate()}.pdf`)
}



// -- Generate the Underlying Loan Summary report.
function makeUnderlyingLoanSummaryDoc() {

    const fontSize = 6;

    let cumOriginalPrincipal = new Big("0.0");
    let cumCurrentBalance = new Big("0.0");

    // -- Generate the body of the document table, with headings
    const tableBody = (dataRows) => {

        const body = [
            [
                thl('\nUnderlying Borrower', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Loan Notes', -1, { colSpan: 2, fontSize: fontSize }),
                thr(' '),
                thr('Original\nPrincipal', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Current\nBalance', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Borrower\nInterest Rate', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Term\n(Months)', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Drawdown\nDate', -1, { rowSpan: 2, fontSize: fontSize }),
                thr('Payments\nMade', -1, { rowSpan: 2, fontSize: fontSize }),
                thl('\nStatus', -1, { rowSpan: 2, fontSize: fontSize })
            ],
            [
                thl(' '),
                thr('first', -1, { fontSize: fontSize }),
                thr('last', -1, { fontSize: fontSize }),
                thr(' '),
                thr(' '),
                thr(' '),
                thr(' '),
                thr(' '),
                thr(' '),
                thr(' '),
            ]
        ];

        dataRows.forEach((row, index) => {
            const tableRow = [];
            tableRow.push(tdl(row['borrowerName'], index, { fontSize: fontSize }));
            tableRow.push(tdr(row['loanNoteFirst'], index, { fontSize: fontSize }));
            tableRow.push(tdr(row['loanNoteLast'], index, { fontSize: fontSize }));
            tableRow.push(tdr(asMoney(row['originalPrincipal']), index, { fontSize: fontSize }));
            tableRow.push(tdr(asMoney(row['currentBalance']), index, { fontSize: fontSize }));
            tableRow.push(tdr(row['borrowerRate'].round(2, 1).toFixed(2).toString(), index, { fontSize: fontSize }));
            tableRow.push(tdr(row['term'], index, { fontSize: fontSize }));
            tableRow.push(tdr(row['drawdown'].format('D MMM YYYY'), index, { fontSize: fontSize }));
            tableRow.push(tdr(row['payments'], index, { fontSize: fontSize }));
            tableRow.push(tdl(row['status'], index, { fontSize: fontSize }));
            body.push(tableRow);

            cumOriginalPrincipal = cumOriginalPrincipal.plus(row['originalPrincipal']);
            cumCurrentBalance = cumCurrentBalance.plus(row['currentBalance']);
        });

        /*  *
        body[1] = [
            tdl(`Total number of loans: ${dataRows.length}`, -1, {colSpan: 2, fillColor: 'black', color: 'white'}),
            tdl(' '),
            tdr(asMoney(cumLoanUnits), -1, {fillColor: 'black', color: 'white'}),
            tdr(asMoney(cumCashUnits), -1, {fillColor: 'black', color: 'white'}),
            tdr(asMoney(cumTotalUnits), -1, {fillColor: 'black', color: 'white'})
        ];
        /*  */
        return body;
    }

    const tableColumnWidths = ['*', 22, 22, 40, 40, 40, 25, 38, 28, 25];

    // -- The main report table, with the table body.
    const tableData = {
        table: {
            headerRows: 2,
            widths: tableColumnWidths,

            body: tableBody(transformedULSData),
        }
    };

    const tableSummaryData = {
        table: {
            headerRows: 0,
            widths: tableColumnWidths,

            body: [
                [
                    thr(`Total number of loans: ${transformedULSData.length}.`, -1, { colSpan: 3, fontSize: fontSize, color: 'white', fillColor: 'black' }),
                    thr(''),
                    thr(''),
                    thr(asMoney(cumOriginalPrincipal), -1, { fontSize: fontSize, color: 'white', fillColor: 'black' }),
                    thr(asMoney(cumCurrentBalance), -1, { fontSize: fontSize, color: 'white', fillColor: 'black' }),
                    thr('', -1, { colSpan: 5, color: 'white', fillColor: 'black' }),
                    thr(''),
                    thr(''),
                    thr(''),
                    thr('')
                ]
            ],
        }
    };

    const docDefinition = createDocumentDefinition(reportDate(), 'Underlying Loan Summary', tableSummaryData, ' ', tableData);
    pdfMake.createPdf(docDefinition).download(`underlyingLoanSummary-${reportDate()}.pdf`);
}



// -- Generate the Member Registry Report
function makeMemberRegisterDoc() {

    // -- Generate the body of the document table, with headings
    const tableBody = (dataRows) => {
        const body = [
            [
                thl(' ', -1, { colSpan: 2 }),
                thl(' '),
                thr('Loan Units'),
                thr('Cash Units'),
                thr('Total Units')
            ],
            []
        ];

        let cumLoanUnits = new Big("0.0");
        let cumCashUnits = new Big("0.0");
        let cumTotalUnits = new Big("0.0");

        dataRows.forEach((row, index) => {
            const tableRow = [];
            tableRow.push(tdl(row['memberName'], index));
            tableRow.push(tdl(truncateContent(row['memberEmail']), index));
            tableRow.push(tdr(asMoney(row['loanUnits']), index));
            tableRow.push(tdr(asMoney(row['cashUnits']), index));
            tableRow.push(tdr(asMoney(row['totalUnits']), index));
            body.push(tableRow);

            cumLoanUnits = cumLoanUnits.plus(row['loanUnits']);
            cumCashUnits = cumCashUnits.plus(row['cashUnits']);
            cumTotalUnits = cumTotalUnits.plus(row['totalUnits']);
        });
        body[1] = [
            tdl(`Total for ${dataRows.length} members`, -1, { colSpan: 2, fillColor: 'black', color: 'white' }),
            tdl(' '),
            tdr(asMoney(cumLoanUnits), -1, { fillColor: 'black', color: 'white' }),
            tdr(asMoney(cumCashUnits), -1, { fillColor: 'black', color: 'white' }),
            tdr(asMoney(cumTotalUnits), -1, { fillColor: 'black', color: 'white' })
        ];
        return body;
    }

    // -- The main report table, with the table body.
    const tableData = {
        table: {
            headerRows: 1,
            widths: ['*', 100, 70, 70, 70],

            body: tableBody(transformedMRData),
        }
    };
    const docDefinition = createDocumentDefinition(reportDate(), 'Member Register', tableData);
    pdfMake.createPdf(docDefinition).download(`memberRegister-${reportDate()}.pdf`);
}
