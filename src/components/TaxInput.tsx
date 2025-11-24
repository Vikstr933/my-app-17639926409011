import React, { useState, useEffect } from 'react';
import type { TaxCalculationInput, CalculationMode } from '../types/tax.types';
import './TaxInput.css';

interface TaxInputProps {
  onCalculate: (input: TaxCalculationInput) => void;
  mode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void
}

const MUNICIPALITIES = [
  'Average',
  'Stockholm',
  'Göteborg',
  'Malmö',
  'Uppsala',
  'Västerås',
  'Örebro',
  'Linköping',
  'Helsingborg',
  'Jönköping',
  'Norrköping',
  'Lund',
  'Umeå',
  'Gävle',
  'Borås',
  'Eskilstuna'
];

export default function TaxInput({ onCalculate, mode, onModeChange }: TaxInputProps) {
  const [income, setIncome] = useState<string>('');
  const [municipality, setMunicipality] = useState<string>('Average');
  const [age, setAge] = useState<string>('');
  const [hasDeductions, setHasDeductions] = useState<boolean>(false);
  const [deductionAmount, setDeductionAmount] = useState<string>('');

  useEffect(() => {
    if (income && parseFloat(income) > 0) {
      handleCalculate()
    }
  }, [income, municipality, age, hasDeductions, deductionAmount, mode]);

  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue) || incomeValue <= 0) {
      return
    };
    const annualIncome = mode === 'monthly' ? incomeValue * 12 : incomeValue;

    const input: TaxCalculationInput = {
      grossIncome: annualIncome,
      municipality,
      age: age ? parseInt(age) : undefined,
      hasDeductions,
      deductionAmount: hasDeductions && deductionAmount ? parseFloat(deductionAmount) : undefined
    };

    onCalculate(input)
  };

  const handleIncomeChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setIncome(value)
    }
  };

  const handleAgeChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setAge(value)
    }
  };

  const handleDeductionChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDeductionAmount(value)
    }
  };

  return (
    <div className="tax-input-container">
      <div className="mode-toggle">
        <button
          className={`mode-button ${mode === 'annual' ? 'active' : ''}`}
          onClick={() => onModeChange('annual')}
          type="button"
        >
          Annual
        </button>
        <button
          className={`mode-button ${mode === 'monthly' ? 'active' : ''}`}
          onClick={() => onModeChange('monthly')}
          type="button"
        >
          Monthly
        </button>
      </div>

      <div className="input-group">
        <label htmlFor="income" className="input-label">
          {mode === 'annual' ? 'Annual' : 'Monthly'} Gross Income (SEK)
        </label>
        <input
          id="income"
          type="text"
          className="input-field"
          value={income}
          onChange={(e) => handleIncomeChange(e.target.value)}
          placeholder={mode === 'annual' ? '500000' : '41667'}
          aria-label={`${mode === 'annual' ? 'Annual' : 'Monthly'} gross income`}
        />
      </div>

      <div className="input-group">
        <label htmlFor="municipality" className="input-label">
          Municipality
        </label>
        <select
          id="municipality"
          className="input-field"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          aria-label="Select municipality"
        >
          {MUNICIPALITIES.map((mun) => (
            <option key={mun} value={mun}>
              {mun}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="age" className="input-label">
          Age (Optional)
        </label>
        <input
          id="age"
          type="text"
          className="input-field"
          value={age}
          onChange={(e) => handleAgeChange(e.target.value)}
          placeholder="30"
          aria-label="Age"
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={hasDeductions}
            onChange={(e) => setHasDeductions(e.target.checked)}
            aria-label="Include deductions"
          />
          <span>Include Deductions</span>
        </label>
      </div>

      {hasDeductions && (
        <div className="input-group">
          <label htmlFor="deduction" className="input-label">
            Deduction Amount (SEK)
          </label>
          <input
            id="deduction"
            type="text"
            className="input-field"
            value={deductionAmount}
            onChange={(e) => handleDeductionChange(e.target.value)}
            placeholder="10000"
            aria-label="Deduction amount"
          />
        </div>
      )}
    </div>
  )
}