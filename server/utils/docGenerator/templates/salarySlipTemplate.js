export default function salarySlipTemplate({ organization, employee, salaryMonth, earnings = [], deductions = [], totalEarnings, totalDeductions, netPay }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Payslip - ${employee.name} - ${salaryMonth}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #222;
      padding-bottom: 10px;
    }
    .logo {
      width: 180px;
      aspect-ratio: 1/1;
    }
    .company-details {
      text-align: right;
    }
    .payslip-title {
      text-align: center;
      margin: 20px 0;
      font-size: 24px;
      font-weight: bold;
      text-decoration: underline;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h3 {
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .details-table,
    .salary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .details-table td {
      padding: 4px 8px;
    }
    .salary-table th,
    .salary-table td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    .total-row {
      font-weight: bold;
      background-color: #f5f5f5;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${organization.logo}" alt="Company Logo" class="logo" />
    <div class="company-details">
      <h2>${organization.name}</h2>
      <p>
        ${organization.address}<br />
        Email: ${organization.email} | Phone: ${organization.phone}
      </p>
    </div>
  </div>

  <div class="payslip-title">Payslip for ${salaryMonth}</div>

  <div class="section">
    <h3>Employee Information</h3>
    <table class="details-table">
      <tr>
        <td><strong>Employee Name:</strong> ${employee.name}</td>
        <td><strong>Employee ID:</strong> ${employee.code}</td>
      </tr>
      <tr>
        <td><strong>Designation:</strong> ${employee.designation}</td>
        <td><strong>Department:</strong> ${employee.department}</td>
      </tr>
      <tr>
        <td><strong>Bank A/C No.:</strong> ${employee.bankAccount}</td>
        <td><strong>IFSC Code:</strong> ${employee.ifsc}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h3>Salary Details</h3>
    <table class="salary-table">
      <thead>
        <tr>
          <th>Earnings</th>
          <th>Amount (INR)</th>
          <th>Deductions</th>
          <th>Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${(() => {
          const maxLength = Math.max(earnings.length, deductions.length);
          let rows = "";
          for (let i = 0; i < maxLength; i++) {
            const earning = earnings[i] || {};
            const deduction = deductions[i] || {};
            rows += `
              <tr>
                <td>${earning.name || ""}</td>
                <td>${earning.amount?.toLocaleString("en-IN") || ""}</td>
                <td>${deduction.name || ""}</td>
                <td>${deduction.amount?.toLocaleString("en-IN") || ""}</td>
              </tr>
            `;
          }
          return rows;
        })()}
        <tr class="total-row">
          <td>Total Earnings</td>
          <td>₹${totalEarnings.toLocaleString("en-IN")}</td>
          <td>Total Deductions</td>
          <td>₹${totalDeductions.toLocaleString("en-IN")}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Net Pay (INR)</td>
          <td colspan="2">₹${netPay.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>This is a system-generated payslip and does not require a signature.</p>
  </div>
</body>
</html>
`;
}
