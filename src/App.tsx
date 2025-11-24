import React, { useState } from 'react';
import TaxInput from './components/TaxInput';
import TaxResult from './components/TaxResult';
import TaxBreakdown from './components/TaxBreakdown';
import { calculateTax } from './utils/taxCalculator';
import type { TaxCalculationInput, TaxCalculationResult, CalculationMode } from './types/tax.types';

export default function App() {
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [mode, setMode] = useState<CalculationMode>('annual');

  const handleCalculate = (input: TaxCalculationInput) => {
    const calculationResult = calculateTax(input);
    setResult(calculationResult)
  };

  const handleModeChange = (newMode: CalculationMode) => {
    setMode(newMode)
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <svg className="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h1>Sweden Tax Calculator</h1>
            </div>
            <p className="header-subtitle">Calculate your Swedish income tax for 2024</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="calculator-grid">
            <div className="calculator-input">
              <TaxInput 
                onCalculate={handleCalculate} 
                mode={mode}
                onModeChange={handleModeChange}
              />
            </div>
            
            <div className="calculator-results">
              <TaxResult result={result} mode={mode} />
              <TaxBreakdown result={result} mode={mode} />
            </div>
          </div>

          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>About Swedish Taxes</h3>
              <p>Sweden has a progressive tax system with municipal and state taxes. Municipal tax rates vary by location, typically ranging from 29% to 35%.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>State Tax</h3>
              <p>State tax of 20% applies to income above 598,500 SEK annually. This is in addition to municipal tax.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3>Accurate Calculations</h3>
              <p>This calculator uses 2024 tax rates and includes municipal variations for major Swedish cities.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Sweden Tax Calculator. For informational purposes only.</p>
          <p className="footer-note">Tax rates are based on 2024 Swedish tax regulations. Consult a tax professional for personalized advice.</p>
        </div>
      </footer>
    </div>
  )
}