const ExcelJS = require('exceljs');

async function readExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    let data = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip headers
            data.push(row.values.slice(1)); // Remove first empty index
        }
    });

    return data;
}

module.exports = readExcel;
