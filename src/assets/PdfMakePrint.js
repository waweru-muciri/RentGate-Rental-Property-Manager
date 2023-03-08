import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// -- Create a base document template for the reports.
const createDocumentDefinition = (reportDate, ...contentParts) => {
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
            { text: 'Yarra Property Management', style: 'title', width: '*' },
            { text: `Created: ${reportDate}`, style: 'titleDate', width: '*' },
        ],
    };
    const docDefinition = JSON.parse(JSON.stringify(baseDocDefinition));
    docDefinition.footer = baseDocDefinition.footer;
    docDefinition.content.push(...contentParts);
    return docDefinition;
};

export const printDocument = (reportName, documentContent) => {
    const reportDate = new Date().toDateString()
    const docDefinition = createDocumentDefinition(reportDate, documentContent);
    // pdfMake.createPdf(docDefinition).download(reportName)
    pdfMake.createPdf(docDefinition).open()
}