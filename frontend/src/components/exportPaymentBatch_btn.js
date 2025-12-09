import React from 'react'; 
import { Button } from '@mui/material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExportPaymentBatch = ({ missionOrderNumber, rows, id }) => {  // Accept id as a prop
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mission Payment');

    // Add the header with formatting
    const headerRow = worksheet.addRow([`MISSION PAYMENT - Mission Order Number ${id}`]);  // Use id here
    headerRow.font = { bold: true, size: 14 };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A1:I1`);
    worksheet.addRow([]); // Empty row after the header

    
    // Add the column headers with background color and styling
    // const columnHeader = worksheet.addRow(['SN', 'Beneficiary ID', 'Beneficiary Name', 'Beneficiary Bank-Account', 'Beneficiary Bank-Name','Beneficiary Bank-Code', 'IBAN', 'Payment Type', 'Amount']);
    const columnHeader = worksheet.addRow(['SN', 'Beneficiary Name', 'Beneficiary Bank-Account', 'Beneficiary Bank-Name','Beneficiary Bank-Code', 'IBAN', 'Payment Type', 'Amount']);
    columnHeader.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCFF' },
      };
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Add the rows from the data with default styles
    rows.forEach((row, index) => {
      const dataRow = worksheet.addRow([
        index + 1,
        // row.employeeId,
        `${row.familyName} ${row.givenName}`,
        row.bankAccount,
        row.bankName,
        row.bankCode,
        '', // Assuming IBAN is empty
        '01-NET', // Assuming Payment Type is fixed
        `${new Intl.NumberFormat().format(row.amount)} Rwf`,
      ]);

      // Apply basic styling to each data row
      dataRow.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };  // Center alignment
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Set column widths to improve appearance
    worksheet.columns = [
      { width: 5 },  // SN column
      { width: 15 }, // Beneficiary ID column
      { width: 20 }, // Beneficiary Name column
      { width: 30 }, // Beneficiary Bank Account column
      { width: 30 }, // Beneficiary Bank Name column
      { width: 30 }, // Beneficiary Bank Code column
      { width: 20 }, // IBAN column
      { width: 20 }, // Payment Type column
      { width: 35 }, // Amount column
    ];


    // Generate and trigger the file download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'Mission_Payment_Details.xlsx');
  };

  return (
    <Button
      variant="contained"
      onClick={handleExport}
      sx={{
        height: 28,
        width: '5%',
        fontSize: '0.75rem',
        padding: '2px 4px',
        textTransform: 'none',
        backgroundColor: 'green',
        '&:hover': {
          backgroundColor: 'darkgreen',
        },
      }}
    >
      Export
    </Button>
  );
};

export default ExportPaymentBatch;
