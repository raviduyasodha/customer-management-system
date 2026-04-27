const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.join(__dirname, '..', 'frontend', 'public', 'customer_template.xlsx');

const data = [
    ["Name", "Date of Birth", "NIC Number"],
    ["John Doe", "1990-01-15", "901234567V"],
    ["Jane Smith", "1985-05-20", "855566778V"]
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Customers");

XLSX.writeFile(wb, filePath);

console.log('Template created at:', filePath);
