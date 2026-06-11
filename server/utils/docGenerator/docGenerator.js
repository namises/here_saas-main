import wkhtmltopdf from "wkhtmltopdf";
import salarySlipTemplate from "./templates/salarySlipTemplate.js";
import form16Template from "./templates/form16Template.js";
import { PassThrough } from "stream";

import fs from "fs";
export const generateForm16 = (res, data) =>
  wkhtmltopdf(form16Template(data), { pageSize: "A4" })
    .pipe(res)
    .on("finish", () => res.end());

export const generateSalarySlip = (res, data) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="output.pdf"');
  const pdfStream = wkhtmltopdf(salarySlipTemplate(data), { pageSize: "A4" });
  const pass = new PassThrough();
  pdfStream.pipe(pass);
  pass.pipe(res);
  return;
};
// const html = form16Template({
//   organization: {
//     name: "Acme Technologies Pvt. Ltd.",
//     address: "123 Business Park, Innovation Street, Bengaluru, Karnataka - 560001",
//     pan: "AACCA1234B",
//     logo: "https://res.cloudinary.com/doukudlyp/image/upload/v1750353308/logo_bqmk9k.jpg",
//     email: "hr@acme.in",
//     phone: "+91-9876543210",
//   },
//   employee: {
//     name: "John Doe",
//     employeeCode: "ACME1234",
//     pan: "ABCDE1234F",
//     designation: "Senior Software Engineer",
//     department: "Technology",
//     bankAccount: "XXXX-XXXX-1234",
//     ifsc: "HDFC0001234",
//   },
//   financialYear: "2024-25",
//   payrolls: [
//     {
//       month: "April",
//       grossSalary: 50000,
//       netSalary: 45000,
//       components: [
//         { name: "Basic Pay", amount: 30000, inHandComponent: true },
//         { name: "HRA", amount: 12000, inHandComponent: true },
//         { name: "Special Allowance", amount: 8000, inHandComponent: true },
//         { name: "PF", amount: -1800, inHandComponent: false },
//         { name: "Professional Tax", amount: -200, inHandComponent: false },
//         { name: "Income Tax", amount: -3000, inHandComponent: false },
//       ],
//     },
//     {
//       month: "May",
//       grossSalary: 50000,
//       netSalary: 45000,
//       components: [
//         { name: "Basic Pay", amount: 30000, inHandComponent: true },
//         { name: "HRA", amount: 12000, inHandComponent: true },
//         { name: "Special Allowance", amount: 8000, inHandComponent: true },
//         { name: "PF", amount: -1800, inHandComponent: false },
//         { name: "Professional Tax", amount: -200, inHandComponent: false },
//         { name: "Income Tax", amount: -3000, inHandComponent: false },
//       ],
//     },
//   ],
// });

// const html = generatePayslipHTML({
//   organization: {
//     name: "Acme Technologies Pvt. Ltd.",
//     address: "123 Business Park, Innovation Street, Bengaluru, Karnataka - 560001",
//     email: "hr@acme.in",
//     phone: "+91-9876543210",
//     logo: "https://res.cloudinary.com/doukudlyp/image/upload/v1750353308/logo_bqmk9k.jpg",
//   },
//   employee: {
//     name: "John Doe",
//     code: "ACME1234",
//     designation: "Senior Software Engineer",
//     department: "Technology",
//     bankAccount: "XXXX-XXXX-1234",
//     ifsc: "HDFC0001234",
//   },
//   salaryMonth: "May 2025",
//   earnings: [
//     { name: "Basic Pay", amount: 30000 },
//     { name: "HRA", amount: 12000 },
//     { name: "Special Allowance", amount: 8000 },
//   ],
//   deductions: [
//     { name: "PF Contribution", amount: 1800 },
//     { name: "Professional Tax", amount: 200 },
//     { name: "Income Tax", amount: 3000 },
//   ],
//   totalEarnings: 50000,
//   totalDeductions: 5000,
//   netPay: 45000,
// });
