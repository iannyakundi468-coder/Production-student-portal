import React, { useState } from 'react';
import { CreditCard, CheckCircle, Search, AlertCircle } from 'lucide-react';
import { useParentContext } from '../../context/ParentContext';
import { motion } from 'framer-motion';

export default function PaymentFlow() {
  const { activeChild, t, addPayment } = useParentContext();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('mpesa');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [search, setSearch] = useState('');

  if (!activeChild) return null;

  const handlePay = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.8) {
        setStatus('error');
      } else {
        addPayment(activeChild.id, amount, method);
        setStatus('success');
      }
    }, 1500);
  };

  const filteredHistory = activeChild.fees.history.filter(tx => 
    tx.ref.toLowerCase().includes(search.toLowerCase()) || tx.date.includes(search)
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="balance-card" style={{ marginBottom: '2rem' }}>
        <div className="balance-label">{t.currentBalance}</div>
        <div className="balance-amount">
          {activeChild.fees.currency} {activeChild.fees.totalBalance.toLocaleString()}
        </div>
        <div className="balance-meta">
          <div className="balance-meta-item">
            <span className="balance-meta-lbl">Paid Amount</span>
            <span className="balance-meta-val">
              {activeChild.fees.currency} {(activeChild.fees.paidAmount || 0).toLocaleString()}
            </span>
          </div>
          <div className="balance-meta-item">
            <span className="balance-meta-lbl">Total Fee Structure</span>
            <span className="balance-meta-val">
              {activeChild.fees.currency} {((activeChild.fees.paidAmount || 0) + activeChild.fees.totalBalance).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <h2 className="section-title">{t.checkout}</h2>
      
      {status === 'loading' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {method === 'mpesa' ? (
            <div className="mpesa-sim-box">
              <div className="mpesa-logo-sim" style={{ color: '#4ade80', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-1px', marginBottom: '1rem' }}>M-PESA PUSH SIMULATOR</div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', opacity: 0.9 }}>
                Please check your phone for the M-Pesa STK PIN Prompt...
              </p>
              <div className="mpesa-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#4ade80', borderRadius: '50%', margin: '1.5rem auto' }} />
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
                Processing payment of {activeChild.fees.currency} {Number(amount).toLocaleString()}
              </p>
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CreditCard size={48} className="login-spinner" style={{ animation: 'spin 1.5s linear infinite', border: 'none', color: 'var(--primary)' }} />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Processing Credit Card</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Contacting your bank gateway. Do not refresh this page.
              </p>
            </div>
          )}
        </div>
      ) : status === 'success' ? (
        <div className="success-state">
          <CheckCircle className="success-icon" />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t.success}</h3>
          <button className="btn-primary" onClick={() => { setStatus('idle'); setAmount(''); }}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handlePay} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          
          {status === 'error' && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              {t.error}
            </div>
          )}

          <div className="form-group">
            <label>Amount ({activeChild.fees.currency})</label>
            <input 
              type="number" 
              className="form-control" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select className="form-control" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="mpesa">Mobile Money (M-PESA)</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
            disabled={status === 'loading'}
          >
            <CreditCard size={20} /> {t.payNow}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>{t.paymentHistory}</h2>
        <div style={{ position: 'relative', width: '150px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            style={{ paddingLeft: '2rem', padding: '0.5rem 0.5rem 0.5rem 2rem' }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Ref</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td style={{ fontFamily: 'monospace' }}>{tx.ref}</td>
                  <td>{tx.amount.toLocaleString()}</td>
                  <td>
                    <span className="status-badge">{tx.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {t.noPaymentHistory}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
