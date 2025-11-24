export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  name: string
}

export interface MunicipalityTax {
  municipality: string;
  rate: number
}

export interface TaxCalculationInput {
  grossIncome: number;
  municipality?: string;
  age?: number;
  hasDeductions?: boolean;
  deductionAmount?: number
}

export interface TaxBreakdown {
  municipalTax: number;
  stateTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number
}

export interface TaxCalculationResult {
  grossIncome: number;
  breakdown: TaxBreakdown;
  monthlyBreakdown: {
    grossMonthly: number;
    taxMonthly: number;
    netMonthly: number
  };
  deductions?: {
    amount: number;
    taxableIncome: number
  }
}

export interface TaxConstants {
  basicAllowance: number;
  stateTaxThreshold: number;
  stateTaxRate: number;
  averageMunicipalRate: number;
  pensionContributionRate: number
}

export type CalculationMode = 'annual' | 'monthly';

export interface FormErrors {
  grossIncome?: string;
  deductionAmount?: string;
  municipality?: string
}