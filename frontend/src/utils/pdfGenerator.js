import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to format currency properly
const formatAmount = (amount) => {
  if (!amount) return '0.00';
  return Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

export const generateInvoicePDF = (invoice, company = {}) => {
  const doc = new jsPDF();
  const pageW = 210;
  const margin = 15;
  
  // Company info
  const comp = {
    name: company.name || 'Innovate Books',
    address: company.address || 'Plot No. 123, Tech Park',
    city: 'Bangalore - 560001, Karnataka, India',
    gstin: company.gstin || '29ABCDE1234F1Z5',
    pan: company.pan || 'ABCDE1234F',
    email: company.email || 'accounts@innovatebooks.com',
    phone: company.phone || '+91 80 1234 5678',
    bank: company.bankName || 'HDFC Bank',
    account: company.accountNumber || '50200012345678',
    ifsc: company.ifscCode || 'HDFC0001234'
  };
  
  let y = 15;
  
  // === HEADER ===
  doc.setFillColor(3, 63, 153);
  doc.rect(0, 0, pageW, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(comp.name, margin, 15);
  doc.setFontSize(14);
  doc.text('TAX INVOICE', pageW - margin, 15, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(comp.address, margin, 24);
  doc.text(comp.city, margin, 29);
  doc.text(`GSTIN: ${comp.gstin}  |  PAN: ${comp.pan}`, margin, 34);
  doc.text(`Email: ${comp.email}  |  Phone: ${comp.phone}`, margin, 39);
  
  y = 52;
  doc.setTextColor(0, 0, 0);
  
  // === INVOICE & CUSTOMER DETAILS ===
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  
  // Left box - Invoice details
  doc.rect(margin, y, 85, 32);
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 85, 6, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS', margin + 2, y + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  y += 10;
  doc.text('Invoice No:', margin + 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.invoice_number || '', margin + 30, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Date:', margin + 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(invoice.invoice_date), margin + 30, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Due Date:', margin + 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(invoice.due_date), margin + 30, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Place of Supply:', margin + 2, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Karnataka', margin + 30, y);
  
  // Right box - Customer details
  const rx = 105;
  y = 52;
  doc.rect(rx, y, 90, 32);
  doc.setFillColor(240, 240, 240);
  doc.rect(rx, y, 90, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILL TO', rx + 2, y + 4);
  
  doc.setFontSize(9);
  y += 10;
  doc.text(invoice.customer_name || 'Customer', rx + 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  y += 5;
  
  // Customer Address - with proper line breaks
  if (invoice.customer_address) {
    const addrLines = doc.splitTextToSize(invoice.customer_address, 85);
    addrLines.slice(0, 2).forEach(line => {
      doc.text(line, rx + 2, y);
      y += 4;
    });
  }
  
  // Customer contact details
  if (invoice.customer_phone) {
    doc.text(`Phone: ${invoice.customer_phone}`, rx + 2, y);
    y += 4;
  }
  if (invoice.customer_email) {
    doc.text(`Email: ${invoice.customer_email}`, rx + 2, y);
    y += 4;
  }
  
  // GSTIN - always show
  doc.text(`GSTIN: ${invoice.customer_gstin || 'N/A'}`, rx + 2, y);
  
  y = 92;
  
  // === LINE ITEMS TABLE ===
  const items = [];
  if (invoice.items && invoice.items.length > 0) {
    invoice.items.forEach((item, i) => {
      items.push([
        (i + 1).toString(),
        item.description || 'Item',
        item.hsn_code || '',
        item.quantity ? item.quantity.toString() : '1',
        formatAmount(item.unit_price),
        formatAmount(item.amount)
      ]);
    });
  } else {
    items.push(['1', 'Service/Product', '', '1', formatAmount(invoice.base_amount), formatAmount(invoice.base_amount)]);
  }
  
  autoTable(doc, {
    startY: y,
    head: [['#', 'Description', 'HSN', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: items,
    theme: 'grid',
    headStyles: {
      fillColor: [3, 63, 153],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 68, halign: 'left' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });
  
  y = doc.lastAutoTable.finalY + 8;
  
  // === AMOUNT SUMMARY ===
  const sx = pageW - margin - 70;
  const sw = 70;
  let sy = y;
  
  // Calculate GST breakdown
  const compState = comp.gstin.substring(0, 2);
  const custState = (invoice.customer_gstin || '29ZZZZZ').substring(0, 2);
  const isInter = compState !== custState;
  
  const baseAmt = invoice.base_amount || 0;
  const gstPct = invoice.gst_percent || 18;
  const gstAmt = invoice.gst_amount || 0;
  const totAmt = invoice.total_amount || 0;
  const tdsAmt = invoice.tds_amount || 0;
  const tdsPct = invoice.tds_percent || 0;
  const netAmt = invoice.net_receivable || totAmt;
  
  // Draw summary box
  doc.setDrawColor(3, 63, 153);
  doc.setLineWidth(0.5);
  const boxHeight = isInter ? 50 : 55;
  doc.rect(sx, sy, sw, boxHeight);
  
  doc.setFillColor(3, 63, 153);
  doc.rect(sx, sy, sw, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('AMOUNT SUMMARY', sx + sw/2, sy + 5, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  sy += 12;
  
  // Taxable amount
  doc.text('Taxable Amount:', sx + 2, sy);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${formatAmount(baseAmt)}`, sx + sw - 2, sy, { align: 'right' });
  sy += 5;
  
  // GST breakdown
  doc.setFont('helvetica', 'normal');
  if (isInter) {
    doc.text(`IGST @ ${gstPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(gstAmt)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
  } else {
    const half = gstAmt / 2;
    const halfPct = gstPct / 2;
    doc.text(`CGST @ ${halfPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(half)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`SGST @ ${halfPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(half)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
  }
  
  // Divider
  doc.setDrawColor(150, 150, 150);
  doc.line(sx + 2, sy, sx + sw - 2, sy);
  sy += 4;
  
  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Total Amount:', sx + 2, sy);
  doc.text(`Rs. ${formatAmount(totAmt)}`, sx + sw - 2, sy, { align: 'right' });
  sy += 5;
  
  // TDS
  if (tdsAmt > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 0, 0);
    doc.text(`Less: TDS @ ${tdsPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(tdsAmt)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
    doc.setTextColor(0, 0, 0);
  }
  
  // Net Receivable
  doc.setFillColor(40, 167, 69);
  doc.rect(sx, sy - 3, sw, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Net Receivable:', sx + 2, sy + 2);
  doc.text(`Rs. ${formatAmount(netAmt)}`, sx + sw - 2, sy + 2, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  
  // Amount in words
  y = doc.lastAutoTable.finalY + boxHeight + 12;
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, y, pageW - 2*margin, 8, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, y, pageW - 2*margin, 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Amount in Words:', margin + 2, y + 5);
  doc.setFont('helvetica', 'italic');
  doc.text(numberToWords(netAmt), margin + 30, y + 5);
  
  y += 14;
  
  // === PAYMENT & TERMS ===
  doc.rect(margin, y, 80, 28);
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 80, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BANK DETAILS', margin + 2, y + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  y += 10;
  doc.text(`Bank: ${comp.bank}`, margin + 2, y);
  y += 5;
  doc.text(`A/c: ${comp.account}`, margin + 2, y);
  y += 5;
  doc.text(`IFSC: ${comp.ifsc}`, margin + 2, y);
  
  const tx = 100;
  y = doc.lastAutoTable.finalY + boxHeight + 26;
  doc.rect(tx, y, 95, 28);
  doc.setFillColor(240, 240, 240);
  doc.rect(tx, y, 95, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TERMS & CONDITIONS', tx + 2, y + 4);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  y += 9;
  doc.text('1. Payment due within stated terms', tx + 2, y);
  y += 4;
  doc.text('2. Interest @ 18% p.a. on delayed payments', tx + 2, y);
  y += 4;
  doc.text('3. Subject to Bangalore jurisdiction', tx + 2, y);
  y += 4;
  doc.text('4. E. & O.E.', tx + 2, y);
  
  // Signature
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`For ${comp.name}`, pageW - margin - 2, y, { align: 'right' });
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Authorized Signatory', pageW - margin - 2, y, { align: 'right' });
  
  // Footer
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a computer-generated invoice', pageW/2, 285, { align: 'center' });
  
  return doc;
};

export const generateBillPDF = (bill, company = {}) => {
  const doc = new jsPDF();
  const pageW = 210;
  const margin = 15;
  
  const comp = {
    name: company.name || 'Innovate Books',
    address: company.address || 'Plot No. 123, Tech Park',
    city: 'Bangalore - 560001, Karnataka, India',
    gstin: company.gstin || '29ABCDE1234F1Z5',
    pan: company.pan || 'ABCDE1234F'
  };
  
  let y = 15;
  
  // Header
  doc.setFillColor(220, 53, 69);
  doc.rect(0, 0, pageW, 45, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(comp.name, margin, 15);
  doc.setFontSize(14);
  doc.text('PURCHASE BILL', pageW - margin, 15, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(comp.address, margin, 24);
  doc.text(comp.city, margin, 29);
  doc.text(`GSTIN: ${comp.gstin}  |  PAN: ${comp.pan}`, margin, 34);
  
  y = 52;
  doc.setTextColor(0, 0, 0);
  
  // Vendor & Company boxes
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  
  doc.rect(margin, y, 85, 28);
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, 85, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FROM (VENDOR)', margin + 2, y + 4);
  
  doc.setFontSize(9);
  y += 10;
  doc.text(bill.vendor_name || 'Vendor', margin + 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  y += 5;
  
  // Vendor Address
  if (bill.vendor_address) {
    const addrLines = doc.splitTextToSize(bill.vendor_address, 80);
    addrLines.slice(0, 2).forEach(line => {
      doc.text(line, margin + 2, y);
      y += 4;
    });
  }
  
  // Vendor contact details
  if (bill.vendor_phone) {
    doc.text(`Phone: ${bill.vendor_phone}`, margin + 2, y);
    y += 4;
  }
  
  // GSTIN
  doc.text(`GSTIN: ${bill.vendor_gstin || 'N/A'}`, margin + 2, y);
  
  const rx = 105;
  y = 52;
  doc.rect(rx, y, 90, 28);
  doc.setFillColor(240, 240, 240);
  doc.rect(rx, y, 90, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TO (BUYER)', rx + 2, y + 4);
  
  y += 10;
  doc.text(comp.name, rx + 2, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  y += 5;
  doc.text(`GSTIN: ${comp.gstin}`, rx + 2, y);
  
  y = 88;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Bill No: ${bill.bill_number || ''} | Date: ${formatDate(bill.bill_date)} | Due: ${formatDate(bill.due_date)}`, margin, y);
  
  y += 8;
  
  // Items table
  const items = [];
  if (bill.items && bill.items.length > 0) {
    bill.items.forEach((item, i) => {
      items.push([
        (i + 1).toString(),
        item.description || 'Item',
        item.hsn_code || '',
        item.quantity ? item.quantity.toString() : '1',
        formatAmount(item.unit_price),
        formatAmount(item.amount)
      ]);
    });
  } else {
    items.push(['1', 'Service/Product', '', '1', formatAmount(bill.base_amount), formatAmount(bill.base_amount)]);
  }
  
  autoTable(doc, {
    startY: y,
    head: [['#', 'Description', 'HSN', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
    body: items,
    theme: 'grid',
    headStyles: {
      fillColor: [220, 53, 69],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 68, halign: 'left' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });
  
  y = doc.lastAutoTable.finalY + 8;
  
  // Amount summary
  const sx = pageW - margin - 70;
  const sw = 70;
  let sy = y;
  
  const compState = comp.gstin.substring(0, 2);
  const vendState = (bill.vendor_gstin || '29ZZZZZ').substring(0, 2);
  const isInter = compState !== vendState;
  
  const baseAmt = bill.base_amount || 0;
  const gstPct = bill.gst_percent || 18;
  const gstAmt = bill.gst_amount || 0;
  const totAmt = bill.total_amount || 0;
  const tdsAmt = bill.tds_amount || 0;
  const tdsPct = bill.tds_percent || 0;
  const netAmt = bill.net_payable || totAmt;
  
  const boxHeight = isInter ? 50 : 55;
  doc.setDrawColor(220, 53, 69);
  doc.setLineWidth(0.5);
  doc.rect(sx, sy, sw, boxHeight);
  
  doc.setFillColor(220, 53, 69);
  doc.rect(sx, sy, sw, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('AMOUNT SUMMARY', sx + sw/2, sy + 5, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  sy += 12;
  
  doc.text('Taxable Amount:', sx + 2, sy);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${formatAmount(baseAmt)}`, sx + sw - 2, sy, { align: 'right' });
  sy += 5;
  
  doc.setFont('helvetica', 'normal');
  if (isInter) {
    doc.text(`IGST @ ${gstPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(gstAmt)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
  } else {
    const half = gstAmt / 2;
    const halfPct = gstPct / 2;
    doc.text(`CGST @ ${halfPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(half)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
    doc.setFont('helvetica', 'normal');
    doc.text(`SGST @ ${halfPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(half)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
  }
  
  doc.setDrawColor(150, 150, 150);
  doc.line(sx + 2, sy, sx + sw - 2, sy);
  sy += 4;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Total Amount:', sx + 2, sy);
  doc.text(`Rs. ${formatAmount(totAmt)}`, sx + sw - 2, sy, { align: 'right' });
  sy += 5;
  
  if (tdsAmt > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 150, 0);
    doc.text(`Less: TDS @ ${tdsPct}%:`, sx + 2, sy);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rs. ${formatAmount(tdsAmt)}`, sx + sw - 2, sy, { align: 'right' });
    sy += 5;
    doc.setTextColor(0, 0, 0);
  }
  
  doc.setFillColor(220, 53, 69);
  doc.rect(sx, sy - 3, sw, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Net Payable:', sx + 2, sy + 2);
  doc.text(`Rs. ${formatAmount(netAmt)}`, sx + sw - 2, sy + 2, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(7);
  doc.text('Computer-generated bill', pageW/2, 285, { align: 'center' });
  
  return doc;
};

// Number to words
function numberToWords(num) {
  if (!num) return 'Zero Rupees Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  const convert = (n) => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  
  const r = Math.floor(num);
  const p = Math.round((num - r) * 100);
  let w = convert(r) + ' Rupees';
  if (p > 0) w += ' and ' + convert(p) + ' Paise';
  return w + ' Only';
}
