import XLSX from "xlsx";

const printDataToExcel = (title, subject, dataToExport, fileName) => {
    var workBook = XLSX.utils.book_new();
    workBook.Props = {
        Title: title,
        Subject: subject,
        Author: "Yarra Property Manager",
        CreatedDate: new Date(),
    };
    var workBookSheetData = dataToExport;
    var workBookSheet = XLSX.utils.json_to_sheet(workBookSheetData);
    XLSX.utils.book_append_sheet(workBook, workBookSheet, "Sheet1");
    XLSX.writeFile(workBook, `${fileName} - ${new Date().toDateString()}.xlsx`);
}

export default function exportDataToXSL(title, subject, headCells, dataRows, fileName) {
    const headCellsToPrint = headCells.filter(({id}) => id !== 'edit' && id !== 'delete' && id !== 'details')
    const dataToExport = [];
    dataRows.forEach((row) => {
        const tableRow = {};
        headCellsToPrint.forEach((headCell) => {
            tableRow[headCell.label] = row[headCell.id]
        });
        dataToExport.push(tableRow);
    });
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
