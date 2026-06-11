export default function form16Template({ employee, organization, financialYear, payrolls = [] }) {
  const totalGross = payrolls.reduce((sum, p) => sum + (p.grossSalary || 0), 0);
  const totalNet = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);

  const allComponents = {};
  payrolls.forEach((p) => {
    p.components?.forEach((c) => {
      if (!allComponents[c.name]) {
        allComponents[c.name] = 0;
      }
      allComponents[c.name] += c.amount;
    });
  });

  const earnings = Object.entries(allComponents).filter(([_, amount]) => amount >= 0);
  const deductions = Object.entries(allComponents).filter(([_, amount]) => amount < 0);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Form 16 – ${employee.name}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 13px; padding: 20px; line-height: 1.6; }
      h1, h2, h3 { margin-bottom: 5px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
      .section { margin-top: 30px; }
      .right { text-align: right; }
      .highlight { font-weight: bold; background-color: #f2f2f2; }
    </style>
  </head>
  <body>
  
    <h1>Form 16 – Salary Certificate</h1>
    <p>Financial Year: <strong>${financialYear}</strong></p>
  
    <div class="section">
      <h2>Employee Details</h2>
      <table>
        <tr><th>Name</th><td>${employee.name}</td></tr>
        <tr><th>Employee Code</th><td>${employee.employeeCode || "-"}</td></tr>
        <tr><th>PAN</th><td>${employee.pan || "-"}</td></tr>
      </table>
    </div>
  
    <div class="section">
      <h2>Employer Details</h2>
      <table>
        <tr><th>Organization</th><td>${organization.name}</td></tr>
        <tr><th>Address</th><td>${organization.address || "-"}</td></tr>
        <tr><th>PAN</th><td>${organization.pan || "-"}</td></tr>
      </table>
    </div>
  
    <div class="section">
      <h2>Salary Summary</h2>
      <table>
        <tr class="highlight"><th>Total Gross Salary</th><td class="right">₹ ${totalGross.toFixed(2)}</td></tr>
        <tr class="highlight"><th>Total Net Salary</th><td class="right">₹ ${totalNet.toFixed(2)}</td></tr>
      </table>
    </div>
  
    <div class="section">
      <h2>Earnings Breakup</h2>
      <table>
        <thead>
          <tr><th>Component</th><th class="right">Amount (₹)</th></tr>
        </thead>
        <tbody>
          ${earnings.map(([name, amt]) => `<tr><td>${name}</td><td class="right">${amt.toFixed(2)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  
    <div class="section">
      <h2>Deductions</h2>
      <table>
        <thead>
          <tr><th>Component</th><th class="right">Amount (₹)</th></tr>
        </thead>
        <tbody>
          ${deductions.map(([name, amt]) => `<tr><td>${name}</td><td class="right">${Math.abs(amt).toFixed(2)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  
    <div class="section">
      <p><strong>Date of Generation:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Signature:</strong> _________________________</p>
    </div>
  
  </body>
  </html>
  `;
}
