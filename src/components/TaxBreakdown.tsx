import React from 'react';
import type { TaxCalculationResult, CalculationMode } from '../types/tax.types';
import './TaxBreakdown.css';

interface TaxBreakdownProps {
  result: TaxCalculationResult | null;
  mode: CalculationMode
}

export default function TaxBreakdown({ result, mode }: TaxBreakdownProps) {
  if (!result) {
    return null
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

  const breakdown = result.breakdown;
  const monthlyBreakdown = result.monthlyBreakdown;

  const municipalTaxAmount = mode === 'monthly' 
    ? breakdown.municipalTax / 12 
    : breakdown.municipalTax;

  const stateTaxAmount = mode === 'monthly' 
    ? breakdown.stateTax / 12 
    : breakdown.stateTax;

  const totalTaxAmount = mode === 'monthly'
    ? monthlyBreakdown.taxMonthly
    : breakdown.totalTax;

  const grossAmount = mode === 'monthly'
    ? monthlyBreakdown.grossMonthly
    : result.grossIncome;

  const municipalTaxPercentage = (breakdown.municipalTax / result.grossIncome) * 100;
  const stateTaxPercentage = (breakdown.stateTax / result.grossIncome) * 100;

  return (
    <div className="tax-breakdown-container">
      <div className="breakdown-header">
        <h2>Detailed Tax Breakdown</h2>
        <p className="breakdown-subtitle">
          Understanding your {mode === 'monthly' ? 'monthly' : 'annual'} tax obligations
        </p>
      </div>

      <div className="breakdown-chart">
        <div className="chart-bar">
          <div 
            className="chart-segment municipal"
            style={{ width: `${municipalTaxPercentage}%` }}
            title={`Municipal Tax: ${formatPercentage(municipalTaxPercentage / 100)}`}
          >
            <span className="segment-label">
              {municipalTaxPercentage > 10 ? 'Municipal' : ''}
            </span>
          </div>
          {stateTaxPercentage > 0 && (
            <div 
              className="chart-segment state"
              style={{ width: `${stateTaxPercentage}%` }}
              title={`State Tax: ${formatPercentage(stateTaxPercentage / 100)}`}
            >
              <span className="segment-label">
                {stateTaxPercentage > 5 ? 'State' : ''}
              </span>
            </div>
          )}
          <div 
            className="chart-segment net"
            style={{ width: `${100 - municipalTaxPercentage - stateTaxPercentage}%` }}
            title={`Net Income: ${formatPercentage((100 - municipalTaxPercentage - stateTaxPercentage) / 100)}`}
          >
            <span className="segment-label">
              Net Income
            </span>
          </div>
        </div>
      </div>

      <div className="breakdown-items">
        <div className="breakdown-item">
          <div className="item-header">
            <div className="item-icon municipal">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="item-info">
              <h3>Municipal Tax</h3>
              <p className="item-description">Local municipality tax rate</p>
            </div>
          </div>
          <div className="item-values">
            <p className="item-amount">{formatCurrency(municipalTaxAmount)}</p>
            <p className="item-percentage">{formatPercentage(municipalTaxPercentage / 100)}</p>
          </div>
        </div>

        {stateTaxAmount > 0 && (
          <div className="breakdown-item">
            <div className="item-header">
              <div className="item-icon state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="item-info">
                <h3>State Tax</h3>
                <p className="item-description">Additional tax on high income</p>
              </div>
            </div>
            <div className="item-values">
              <p className="item-amount">{formatCurrency(stateTaxAmount)}</p>
              <p className="item-percentage">{formatPercentage(stateTaxPercentage / 100)}</p>
            </div>
          </div>
        )}

        <div className="breakdown-item total">
          <div className="item-header">
            <div className="item-icon total">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="item-info">
              <h3>Total Tax</h3>
              <p className="item-description">Combined tax amount</p>
            </div>
          </div>
          <div className="item-values">
            <p className="item-amount">{formatCurrency(totalTaxAmount)}</p>
            <p className="item-percentage">{formatPercentage(breakdown.effectiveTaxRate)}</p>
          </div>
        </div>
      </div>

      <div className="breakdown-summary">
        <div className="summary-row">
          <span className="summary-label">Gross Income</span>
          <span className="summary-value">{formatCurrency(grossAmount)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Total Tax</span>
          <span className="summary-value negative">-{formatCurrency(totalTaxAmount)}</span>
        </div>
        <div className="summary-row total">
          <span className="summary-label">Net Income</span>
          <span className="summary-value">{formatCurrency(mode === 'monthly' ? monthlyBreakdown.netMonthly : breakdown.netIncome)}</span>
        </div>
      </div>
    </div>
  )
}