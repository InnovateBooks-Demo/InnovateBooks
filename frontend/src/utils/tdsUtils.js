/**
 * TDS Utility Functions
 * Handles TDS calculations and section mappings as per Income Tax Act
 */

/**
 * TDS Sections as per Income Tax Act, 1961
 */
export const TDS_SECTIONS = [
  { 
    value: '194C', 
    label: 'Section 194C - Payment to Contractors',
    rate: 1.0,
    description: 'Payment to contractors for work contracts'
  },
  { 
    value: '194H', 
    label: 'Section 194H - Commission or Brokerage',
    rate: 5.0,
    description: 'Commission or brokerage payments'
  },
  { 
    value: '194I', 
    label: 'Section 194I - Rent',
    rate: 10.0,
    description: 'Rent for land, building, or furniture'
  },
  { 
    value: '194J', 
    label: 'Section 194J - Professional/Technical Services',
    rate: 10.0,
    description: 'Fees for professional or technical services'
  },
  { 
    value: '194Q', 
    label: 'Section 194Q - Purchase of Goods',
    rate: 0.1,
    description: 'Purchase of goods exceeding ₹50 lakhs'
  },
  { 
    value: '194O', 
    label: 'Section 194O - E-commerce Participants',
    rate: 1.0,
    description: 'Payment to e-commerce participants'
  },
  { 
    value: '194A', 
    label: 'Section 194A - Interest other than on Securities',
    rate: 10.0,
    description: 'Interest payment (not on securities)'
  },
  { 
    value: '194D', 
    label: 'Section 194D - Insurance Commission',
    rate: 5.0,
    description: 'Insurance commission payments'
  },
  { 
    value: '194G', 
    label: 'Section 194G - Commission on Lottery Tickets',
    rate: 5.0,
    description: 'Commission on sale of lottery tickets'
  },
  { 
    value: '194LA', 
    label: 'Section 194LA - Compensation on Land Acquisition',
    rate: 10.0,
    description: 'Compensation for land acquisition'
  },
  { 
    value: '194M', 
    label: 'Section 194M - Contract/Professional Fees (Individuals/HUF)',
    rate: 5.0,
    description: 'Payment to individuals/HUF for contract or professional services'
  },
  { 
    value: 'None', 
    label: 'No TDS',
    rate: 0,
    description: 'No TDS applicable'
  }
];

/**
 * Get TDS section details by section code
 */
export const getTDSSection = (sectionCode) => {
  return TDS_SECTIONS.find(section => section.value === sectionCode) || null;
};

/**
 * Calculate TDS amount
 * @param {number} amount - Base amount for TDS calculation
 * @param {string} sectionCode - TDS section code (e.g., '194J')
 * @param {number} customRate - Custom TDS rate (optional, overrides section rate)
 * @returns {object} TDS calculation details
 */
export const calculateTDS = (amount, sectionCode, customRate = null) => {
  const section = getTDSSection(sectionCode);
  
  if (!section || sectionCode === 'None') {
    return {
      section: 'None',
      rate: 0,
      amount: 0,
      description: 'No TDS applicable'
    };
  }
  
  const rate = customRate !== null ? customRate : section.rate;
  const tdsAmount = (amount * rate) / 100;
  
  return {
    section: section.value,
    sectionLabel: section.label,
    rate: rate,
    amount: tdsAmount,
    description: section.description,
    netPayable: amount - tdsAmount
  };
};

/**
 * Format TDS details for display
 */
export const formatTDSDisplay = (tdsInfo) => {
  if (!tdsInfo || tdsInfo.section === 'None') {
    return 'No TDS';
  }
  
  return {
    section: tdsInfo.sectionLabel,
    rate: `${tdsInfo.rate}%`,
    amount: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(tdsInfo.amount)
  };
};

/**
 * Determine if TDS is applicable based on amount threshold
 * Different sections have different threshold limits
 */
export const isTDSApplicable = (amount, sectionCode) => {
  const thresholds = {
    '194C': 30000,     // Single payment or aggregate
    '194H': 15000,     // Brokerage/Commission
    '194I': 240000,    // Rent
    '194J': 30000,     // Professional services
    '194Q': 5000000,   // Purchase of goods (50 lakhs)
    '194O': 500000,    // E-commerce
    '194A': 40000,     // Interest (for individuals)
    '194M': 50000      // Contract/Professional fees for individuals
  };
  
  const threshold = thresholds[sectionCode] || 0;
  return amount >= threshold;
};

/**
 * Get commonly used TDS sections (for quick selection)
 */
export const COMMON_TDS_SECTIONS = [
  TDS_SECTIONS.find(s => s.value === '194J'),
  TDS_SECTIONS.find(s => s.value === '194C'),
  TDS_SECTIONS.find(s => s.value === '194I'),
  TDS_SECTIONS.find(s => s.value === '194H'),
  TDS_SECTIONS.find(s => s.value === 'None')
];
