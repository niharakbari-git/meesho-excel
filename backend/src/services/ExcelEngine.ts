import ExcelJS from 'exceljs';

function extractString(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (val.richText) {
    return val.richText.map((rt: any) => rt.text).join('').replace(/\r\n/g, '\n');
  }
  if (val.text) return val.text;
  if (val.result !== undefined) return String(val.result);
  return String(val);
}

export class ExcelEngine {
  async parseTemplate(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    let mainSheet = workbook.worksheets.find(ws => ws.name.toLowerCase().includes('fill this') && ws.state === 'visible');
    if (!mainSheet) {
      mainSheet = workbook.worksheets.find(ws => ws.state === 'visible') || workbook.worksheets[0];
    }

    let anchorRowIndex = -1;
    let descriptionRowIndex = -1;

    for (let i = 1; i <= Math.min(20, mainSheet.rowCount); i++) {
      const cellVal = extractString(mainSheet.getCell(i, 1).value).toLowerCase();
      if (cellVal.includes('field name') || cellVal.includes('field names')) {
        anchorRowIndex = i;
      }
      if (cellVal.includes('fields + description') || cellVal.includes('fields+description')) {
        descriptionRowIndex = i;
      }
    }

    if (anchorRowIndex === -1) {
       // Fallback: finding row with most non-empty strings
       let maxCols = 0;
       for (let i = 1; i <= Math.min(10, mainSheet.rowCount); i++) {
         const row = mainSheet.getRow(i);
         let colCount = 0;
         row.eachCell((cell) => {
           const str = extractString(cell.value);
           if (str && str.trim() !== '') colCount++;
         });
         if (colCount > maxCols) {
           maxCols = colCount;
           anchorRowIndex = i - 1; // Assuming the found row is the actual fields row, so anchor is one above
         }
       }
    }

    const requirementRowIndex = anchorRowIndex;
    const actualFieldsRowIndex = anchorRowIndex + 1;
    
    let tutorialLinkRowIndex = -1;
    for (let i = actualFieldsRowIndex + 1; i <= Math.min(30, mainSheet.rowCount); i++) {
      const cellVal = extractString(mainSheet.getCell(i, 1).value).toLowerCase();
      if (cellVal.includes('tutorial')) {
        tutorialLinkRowIndex = i;
        break;
      }
    }

    let dataRowStart = -1;
    if (tutorialLinkRowIndex !== -1) {
      dataRowStart = tutorialLinkRowIndex + 1;
    } else {
      let startSearchRow = Math.max(actualFieldsRowIndex, descriptionRowIndex) + 1;
      for (let i = startSearchRow; i <= mainSheet.rowCount + 10; i++) {
        let rowIsEmpty = true;
        const row = mainSheet.getRow(i);
        row.eachCell((cell) => {
          if (extractString(cell.value).trim() !== '') {
            rowIsEmpty = false;
          }
        });
        if (rowIsEmpty) {
          dataRowStart = i;
          break;
        }
      }
      if (dataRowStart === -1) {
        dataRowStart = Math.max(actualFieldsRowIndex, descriptionRowIndex) + 1;
      }
    }

    const requirementRow = mainSheet.getRow(requirementRowIndex);
    const actualFieldsRow = mainSheet.getRow(actualFieldsRowIndex);
    const columns: any[] = [];

    actualFieldsRow.eachCell((cell, colNumber) => {
      if (colNumber === 1) return; // Skip label column

      const reqStr = extractString(requirementRow.getCell(colNumber).value).toLowerCase();
      
      // Ignore system columns
      if (reqStr.includes('do not fill') || reqStr.includes('meesho only')) {
        return;
      }

      const rawFieldContent = extractString(cell.value).trim();
      if (!rawFieldContent) return;

      const lines = rawFieldContent.split('\n').map(l => l.trim()).filter(l => l !== '');
      let headerStr = lines[0] || '';
      let description = lines.slice(1).join(' ').trim();

      if (!description && descriptionRowIndex > actualFieldsRowIndex) {
         description = extractString(mainSheet.getCell(descriptionRowIndex, colNumber).value).trim();
      }

      let required = reqStr.includes('compulsory') || reqStr.includes('mandatory');
      if (headerStr.includes('*')) {
        required = true;
      }

      const cleanHeader = headerStr.replace(/\*/g, '').trim();

      columns.push({
        header: cleanHeader,
        colNumber,
        required,
        description
      });
    });

    return {
      sheetName: mainSheet.name,
      headerRowIndex: actualFieldsRowIndex,
      dataRowStart,
      columns
    };
  }

  async fillAndExport(filePath: string, sheetName: string, headerRowIndex: number, rowsData: any[], dataRowStart?: number): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    let finalPath = filePath;
    const fs = require('fs');
    const path = require('path');
    if (!fs.existsSync(finalPath)) {
      finalPath = path.join(__dirname, '../../uploads', path.basename(filePath));
    }
    await workbook.xlsx.readFile(finalPath);
    const sheet = workbook.worksheets.find(ws => ws.name === sheetName) || workbook.worksheets[0];

    const startRow = dataRowStart ? dataRowStart : (headerRowIndex + 1);
    
    rowsData.forEach((rowData, index) => {
      const rowIndex = startRow + index;
      const row = sheet.getRow(rowIndex);
      
      Object.keys(rowData).forEach(colStr => {
        const colNum = parseInt(colStr);
        row.getCell(colNum).value = rowData[colStr];
      });
      
      row.commit();
    });

    // WORKAROUND: ExcelJS often crashes with "Shared Formula master must exist above and or left of clone" 
    // when writing complex templates that have poorly formed shared formulas.
    // Since Meesho only reads raw text values and ignores formulas, we strip all formulas before writing.
    workbook.worksheets.forEach(ws => {
      ws.eachRow((row) => {
        row.eachCell((cell) => {
          if (cell.type === 6) { // ExcelJS.ValueType.Formula
            const fVal = cell.value as any;
            cell.value = fVal && fVal.result !== undefined ? fVal.result : '';
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as any;
  }
}
