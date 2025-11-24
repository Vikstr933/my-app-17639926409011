import type {
  TaxCalculationInput,
  TaxCalculationResult,
  TaxBreakdown,
  TaxBracket,
  TaxConstants
} from '../types/tax.types';

// Swedish tax constants for 2024
const TAX_CONSTANTS: TaxConstants = {
  basicAllowance: 14000,
  stateTaxThreshold: 598500,
  stateTaxRate: 0.20,
  averageMunicipalRate: 0.32,
  pensionContributionRate: 0.07
};

// Municipal tax rates for major Swedish municipalities (2024)
const MUNICIPAL_TAX_RATES: Record<string, number> = {
  'Stockholm': 0.3012,
  'Göteborg': 0.3212,
  'Malmö': 0.3244,
  'Uppsala': 0.3212,
  'Västerås': 0.3312,
  'Örebro': 0.3312,
  'Linköping': 0.3212,
  'Helsingborg': 0.3144,
  'Jönköping': 0.3312,
  'Norrköping': 0.3312,
  'Lund': 0.3144,
  'Umeå': 0.3312,
  'Gävle': 0.3412,
  'Borås': 0.3212,
  'Eskilstuna': 0.3312,
  'Average': TAX_CONSTANTS.averageMunicipalRate
};

// State tax brackets (income above threshold)
const STATE_TAX_BRACKETS: TaxBracket[] = [
  {
    min: 0,
    max: 598500,
    rate: 0,
    name: 'No state tax'
  },
  {
    min: 598500,
    max: null,
    rate: 0.20,
    name: 'State tax'
  }
];

/**
 * Calculate basic allowance (grundavdrag) based on income
 * The basic allowance reduces taxable income
 */
export function calculateBasicAllowance(grossIncome: number): number {
  if (grossIncome <= 0) return 0;
  
  // Simplified basic allowance calculation
  // In reality, this is more complex with different formulas for different income levels
  if (grossIncome < 44000) {
    return Math.min(grossIncome * 0.293, grossIncome)
  } else if (grossIncome < 150000) {
    return 14000 + (grossIncome - 44000) * 0.0387
  } else if (grossIncome < 598500) {
    return 18102
  } else {
    return Math.max(18102 - (grossIncome - 598500) * 0.10, 0)
  }
}

/**
 * Get municipal tax rate for a specific municipality
 */
export function getMunicipalTaxRate(municipality?: string): number {
  if (!municipality) {
    return TAX_CONSTANTS.averageMunicipalRate
  }
  
  return MUNICIPAL_TAX_RATES[municipality] || TAX_CONSTANTS.averageMunicipalRate
}

/**
 * Calculate municipal tax (kommunalskatt)
 */
function calculateMunicipalTax(
  taxableIncome: number,
  municipalRate: number
): number {
  if (taxableIncome <= 0) return 0;
  return taxableIncome * municipalRate
}

/**
 * Calculate state tax (statlig skatt)
 * Applied on income above threshold
 */
function calculateStateTax(taxableIncome: number): number {
  if (taxableIncome <= TAX_CONSTANTS.stateTaxThreshold) {
    return 0
  }
  
  const taxableAmount = taxableIncome - TAX_CONSTANTS.stateTaxThreshold;
  return taxableAmount * TAX_CONSTANTS.stateTaxRate
}

/**
 * Calculate total tax breakdown
 */
function calculateTaxBreakdown(
  taxableIncome: number,
  municipalRate: number
): TaxBreakdown {
  const municipalTax = calculateMunicipalTax(taxableIncome, municipalRate);
  const stateTax = calculateStateTax(taxableIncome);
  const totalTax = municipalTax + stateTax;
  const netIncome = taxableIncome - totalTax;
  const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
  
  return {
    municipalTax: Math.round(municipalTax),
    stateTax: Math.round(stateTax),
    totalTax: Math.round(totalTax),
    netIncome: Math.round(netIncome),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100
  }
}

/**
 * Main tax calculation function
 */
export function calculateTax(
  input: TaxCalculationInput
): TaxCalculationResult {
  const {
    grossIncome,
    municipality,
    hasDeductions = false,
    deductionAmount = 0
  } = input;
  
  // Validate input
  if (grossIncome < 0) {
    throw new Error('Gross income cannot be negative')
  }
  
  if (hasDeductions && deductionAmount < 0) {
    throw new Error('Deduction amount cannot be negative')
  }
  
  // Calculate basic allowance
  const basicAllowance = calculateBasicAllowance(grossIncome);
  
  // Calculate taxable income after basic allowance and deductions
  let taxableIncome = grossIncome - basicAllowance;
  
  if (hasDeductions && deductionAmount > 0) {
    taxableIncome = Math.max(0, taxableIncome - deductionAmount)
  }
  
  // Get municipal tax rate
  const municipalRate = getMunicipalTaxRate(municipality);
  
  // Calculate tax breakdown
  const breakdown = calculateTaxBreakdown(taxableIncome, municipalRate);
  
  // Calculate actual net income from gross (not from taxable)
  const actualNetIncome = grossIncome - breakdown.totalTax;
  const actualEffectiveRate = grossIncome > 0 ? (breakdown.totalTax / grossIncome) * 100 : 0;
  
  // Update breakdown with actual values
  breakdown.netIncome = Math.round(actualNetIncome);
  breakdown.effectiveTaxRate = Math.round(actualEffectiveRate * 100) / 100;
  
  // Calculate monthly breakdown
  const monthlyBreakdown = {
    grossMonthly: Math.round(grossIncome / 12),
    taxMonthly: Math.round(breakdown.totalTax / 12),
    netMonthly: Math.round(actualNetIncome / 12)
  };
  
  // Prepare result
  const result: TaxCalculationResult = {
    grossIncome: Math.round(grossIncome),
    breakdown,
    monthlyBreakdown
  };
  
  // Add deduction info if applicable
  if (hasDeductions && deductionAmount > 0) {
    result.deductions = {
      amount: Math.round(deductionAmount),
      taxableIncome: Math.round(taxableIncome)
    }
  }
  
  return result
}

/**
 * Calculate tax from monthly income
 */
export function calculateTaxFromMonthly(
  monthlyIncome: number,
  municipality?: string,
  hasDeductions?: boolean,
  deductionAmount?: number
): TaxCalculationResult {
  const annualIncome = monthlyIncome * 12;
  const annualDeduction = deductionAmount ? deductionAmount * 12 : 0;
  
  return calculateTax({
    grossIncome: annualIncome,
    municipality,
    hasDeductions,
    deductionAmount: annualDeduction
  })
}

/**
 * Get list of available municipalities
 */
export function getAvailableMunicipalities(): string[] {
  return Object.keys(MUNICIPAL_TAX_RATES).sort()
}

/**
 * Get tax constants
 */
export function getTaxConstants(): TaxConstants {
  return { ...TAX_CONSTANTS }
}

/**
 * Format currency in SEK
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

/**
 * Calculate net income from desired net (reverse calculation)
 */
export function calculateGrossFromNet(
  desiredNet: number,
  municipality?: string
): number {
  // This is an approximation using iterative approach;
  let grossEstimate = desiredNet * 1.5; // Start with 50% tax estimate
  let iterations = 0;
  const maxIterations = 20;
  const tolerance = 100; // SEK tolerance
  
  while (iterations < maxIterations) {
    const result = calculateTax({
      grossIncome: grossEstimate,
      municipality
    });
    
    const netDifference = result.breakdown.netIncome - desiredNet;
    
    if (Math.abs(netDifference) < tolerance) {
      return Math.round(grossEstimate)
    }
    
    // Adjust estimate
    grossEstimate = grossEstimate - netDifference;
    iterations++
  }
  
  return Math.round(grossEstimate)
}

export default {
  calculateTax,
  calculateTaxFromMonthly,
  calculateBasicAllowance,
  getMunicipalTaxRate,
  getAvailableMunicipalities,
  getTaxConstants,
  formatCurrency,
  formatPercentage,
  calculateGrossFromNet
};