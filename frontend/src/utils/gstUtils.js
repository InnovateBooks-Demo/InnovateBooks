/**
 * GST Utility Functions
 * Handles GST calculations, IGST/CGST/SGST logic, and state mappings
 */

// State codes as per GST Act
export const STATE_CODES = {
  'Andhra Pradesh': '37',
  'Arunachal Pradesh': '12',
  'Assam': '18',
  'Bihar': '10',
  'Chhattisgarh': '22',
  'Goa': '30',
  'Gujarat': '24',
  'Haryana': '06',
  'Himachal Pradesh': '02',
  'Jharkhand': '20',
  'Karnataka': '29',
  'Kerala': '32',
  'Madhya Pradesh': '23',
  'Maharashtra': '27',
  'Manipur': '14',
  'Meghalaya': '17',
  'Mizoram': '15',
  'Nagaland': '13',
  'Odisha': '21',
  'Punjab': '03',
  'Rajasthan': '08',
  'Sikkim': '11',
  'Tamil Nadu': '33',
  'Telangana': '36',
  'Tripura': '16',
  'Uttar Pradesh': '09',
  'Uttarakhand': '05',
  'West Bengal': '19',
  'Andaman and Nicobar Islands': '35',
  'Chandigarh': '04',
  'Dadra and Nagar Haveli and Daman and Diu': '26',
  'Delhi': '07',
  'Jammu and Kashmir': '01',
  'Ladakh': '38',
  'Lakshadweep': '31',
  'Puducherry': '34'
};

/**
 * Extract state code from GSTIN
 * GSTIN format: 27ABCDE1234F1Z5 (first 2 digits are state code)
 */
export const getStateFromGSTIN = (gstin) => {
  if (!gstin || gstin.length < 2) return null;
  const stateCode = gstin.substring(0, 2);
  
  // Find state name by code
  for (const [state, code] of Object.entries(STATE_CODES)) {
    if (code === stateCode) {
      return state;
    }
  }
  return null;
};

/**
 * Determine if transaction is inter-state or intra-state
 * Returns: { isInterState: boolean, supplierState: string, recipientState: string }
 */
export const determineGSTType = (supplierGSTIN, recipientGSTIN) => {
  const supplierState = getStateFromGSTIN(supplierGSTIN);
  const recipientState = getStateFromGSTIN(recipientGSTIN);
  
  if (!supplierState || !recipientState) {
    return {
      isInterState: false,
      supplierState: null,
      recipientState: null,
      error: 'Invalid GSTIN'
    };
  }
  
  return {
    isInterState: supplierState !== recipientState,
    supplierState,
    recipientState
  };
};

/**
 * Calculate GST breakdown based on transaction type
 * @param {number} baseAmount - Base taxable amount
 * @param {number} gstPercent - GST percentage (e.g., 18)
 * @param {string} supplierGSTIN - Supplier/Company GSTIN
 * @param {string} recipientGSTIN - Recipient/Customer GSTIN
 * @returns {object} GST breakdown with IGST or CGST/SGST
 */
export const calculateGSTBreakdown = (baseAmount, gstPercent, supplierGSTIN, recipientGSTIN) => {
  const gstAmount = (baseAmount * gstPercent) / 100;
  const { isInterState, supplierState, recipientState } = determineGSTType(supplierGSTIN, recipientGSTIN);
  
  if (isInterState) {
    // Inter-state transaction: IGST
    return {
      type: 'IGST',
      igst: gstAmount,
      cgst: 0,
      sgst: 0,
      totalGST: gstAmount,
      supplierState,
      recipientState,
      breakdown: [
        { label: `IGST @ ${gstPercent}%`, amount: gstAmount }
      ]
    };
  } else {
    // Intra-state transaction: CGST + SGST
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    return {
      type: 'CGST/SGST',
      igst: 0,
      cgst: cgst,
      sgst: sgst,
      totalGST: gstAmount,
      supplierState,
      recipientState,
      breakdown: [
        { label: `CGST @ ${gstPercent / 2}%`, amount: cgst },
        { label: `SGST @ ${gstPercent / 2}%`, amount: sgst }
      ]
    };
  }
};

/**
 * GST Rate options (standard rates as per GST Act)
 */
export const GST_RATES = [
  { value: 0, label: '0% - Exempt' },
  { value: 0.25, label: '0.25% - Precious Stones' },
  { value: 3, label: '3% - Gold, Silver' },
  { value: 5, label: '5% - Essential Goods' },
  { value: 12, label: '12% - Standard Goods' },
  { value: 18, label: '18% - Standard Services' },
  { value: 28, label: '28% - Luxury Goods' }
];

/**
 * Format GST breakdown for display
 */
export const formatGSTBreakdown = (gstInfo) => {
  return gstInfo.breakdown.map(item => ({
    label: item.label,
    amount: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(item.amount)
  }));
};
