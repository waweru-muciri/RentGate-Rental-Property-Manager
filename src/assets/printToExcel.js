import XLSX from "xlsx";

export default function exportDataToXSL(title, subject, data, fileName) {
    var workBook = XLSX.utils.book_new();
    workBook.Props = {
        Title: title,
        Subject: subject,
        Author: "Yarra Property Manager",
        CreatedDate: new Date(),
    };
    var workBookSheetData = data;
    var workBookSheet = XLSX.utils.json_to_sheet(workBookSheetData);
    XLSX.utils.book_append_sheet(workBook, workBookSheet, "Sheet1");
    XLSX.writeFile(workBook, `${fileName} - ${new Date().toDateString()}.xlsx`);
}
