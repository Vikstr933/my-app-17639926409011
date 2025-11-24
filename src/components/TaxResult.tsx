import React from 'react';
import type { TaxCalculationResult, CalculationMode } from '../types/tax.types';
import './TaxResult.css';

interface TaxResultProps {
  result: TaxCalculationResult | null;
  mode: CalculationMode
}

export default function TaxResult({ result, mode }: TaxResultProps) {
  if (!result) {
    return (
      <div className="tax-result-container empty">
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h3>Enter your income to calculate taxes</h3>
          <p>Fill in the form to see your tax breakdown</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  };

  const formatPercentage = (rate: number): string => {
    return `${(rate * 100).toFixed(2)}%`
  };

  const displayData = mode === 'monthly' ? result.monthlyBreakdown : {
    grossMonthly: result.grossIncome,
    taxMonthly: result.breakdown.totalTax,
    netMonthly: result.breakdown.netIncome
  };

  return (
    <div className="tax-result-container">
      <div className="result-header">
        <h2>Tax Calculation Results</h2>
        <span className="result-mode">{mode === 'monthly' ? 'Monthly' : 'Annual'}</span>
      </div>

      <div className="result-cards">
        <div className="result-card gross">
          <div className="card-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="card-content">
            <p className="card-label">Gross Income</p>
            <p className="card-value">{formatCurrency(displayData.grossMonthly)}</p>
          </div>
        </div>

        <div className="result-card tax">
          <div className="card-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
          <div className="card-content">
            <p className="card-label">Total Tax</p>
            <p className="card-value">{formatCurrency(displayData.taxMonthly)}</p>
            <p className="card-rate">{formatPercentage(result.breakdown.effectiveTaxRate)}</p>
          </div>
        </div>

        <div className="result-card net">
          <div className="card-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="card-content">
            <p className="card-label">Net Income</p>
            <p className="card-value">{formatCurrency(displayData.netMonthly)}</p>
          </div>
        </div>
      </div>

      {result.deductions && (
        <div className="deductions-info">
          <div className="info-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="deductions-content">
            <p className="deductions-label">Deductions Applied</p>
            <p className="deductions-amount">{formatCurrency(result.deductions.amount)}</p>
            <p className="deductions-taxable">Taxable Income: {formatCurrency(result.deductions.taxableIncome)}</p>
          </div>
        </div>
      )}
    </div>
  )
}