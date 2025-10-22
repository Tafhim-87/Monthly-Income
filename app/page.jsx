"use client";

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MonthlyIncomeCalculator = () => {
  const [incomes, setIncomes] = useState([{ id: 1, name: '', amount: '' }]);
  const [totalIncome, setTotalIncome] = useState(0);
  const pdfRef = useRef();

  // Add new income field
  const addIncome = () => {
    setIncomes([...incomes, { id: Date.now(), name: '', amount: '' }]);
  };

  // Remove income field
  const removeIncome = (id) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  // Handle input changes
  const handleInputChange = (id, field, value) => {
    const updatedIncomes = incomes.map(income =>
      income.id === id ? { ...income, [field]: value } : income
    );
    setIncomes(updatedIncomes);
  };

  // Calculate total income
  const calculateTotal = () => {
    const total = incomes.reduce((sum, income) => {
      const amount = parseFloat(income.amount) || 0;
      return sum + amount;
    }, 0);
    setTotalIncome(total);
    return total;
  };

  // Generate PDF
  const generatePDF = async () => {
    try {
      const element = pdfRef.current;
      
      // Use simpler rendering options to avoid color issues
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        removeContainer: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('monthly-income-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Monthly Income Calculator
          </h1>
          <p style={{ color: '#6b7280' }}>
            Track and calculate your monthly income sources
          </p>
        </div>

        {/* Calculator Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Input Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#1f2937' 
              }}>
                Income Sources
              </h2>
              <button
                onClick={addIncome}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                + Add Income
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incomes.map((income, index) => (
                <div key={income.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Income Name
                    </label>
                    <input
                      type="text"
                      value={income.name}
                      onChange={(e) => handleInputChange(income.id, 'name', e.target.value)}
                      placeholder="e.g., Salary, Freelance, Investment"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={income.amount}
                      onChange={(e) => handleInputChange(income.id, 'amount', e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>
                  {incomes.length > 1 && (
                    <button
                      onClick={() => removeIncome(income.id)}
                      style={{
                        marginTop: '1.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={calculateTotal}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Calculate Total Income
            </button>
          </div>

          {/* Results Section */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Income Summary
            </h3>
            
            {/* PDF Export Section */}
            <div ref={pdfRef} style={{ 
              backgroundColor: '#f9fafb', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937'
                }}>
                  Monthly Income Report
                </h2>
                <p style={{ color: '#6b7280' }}>
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Income List */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1f2937',
                  marginBottom: '0.75rem'
                }}>
                  Income Sources
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {incomes.map((income, index) => (
                    <div key={income.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <span style={{ color: '#374151' }}>
                        {income.name || `Income Source ${index + 1}`}
                      </span>
                      <span style={{ fontWeight: '500', color: '#1f2937' }}>
                        {formatCurrency(parseFloat(income.amount) || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Income */}
              <div style={{ 
                backgroundColor: '#ecfdf5', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                border: '1px solid #a7f3d0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    Total Monthly Income:
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                    {formatCurrency(totalIncome)}
                  </span>
                </div>
              </div>
            </div>

            {/* PDF Export Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={generatePDF}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export as PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 1fr)', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {incomes.length}
            </div>
            <div style={{ color: '#6b7280' }}>Income Sources</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {formatCurrency(totalIncome)}
            </div>
            <div style={{ color: '#6b7280' }}>Total Income</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {formatCurrency(totalIncome / 12)}
            </div>
            <div style={{ color: '#6b7280' }}>Monthly Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyIncomeCalculator;