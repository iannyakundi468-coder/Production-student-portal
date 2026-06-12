import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CircleDollarSign, Download, Plus, Trash2 } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'successful', 'failed', 'overdue'];
const TERMS = ['all', 'Term 1 2026', 'Term 2 2026'];

function statusBadge(status) {
  const map = { successful: 'badge-green', failed: 'badge-red', overdue: 'badge-yellow' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

function exportCSV(data) {
  const rows = [
    ['Date', 'Student', 'Parent', 'Amount (KES)', 'Method', 'Status', 'Term', 'Reference'],
    ...data.map(p => [p.date, p.student, p.parent, p.amount, p.method, p.status, p.term, p.ref]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
  URL.revokeObjectURL(url);
}

function FeeStructuresTab() {
  const { feeStructures, classes, addFeeStructure } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ classId: '', term: 'Term 2 2026', breakdown: [{ name: '', cost: 0 }] });

  const totalCost = form.breakdown.reduce((sum, item) => sum + Number(item.cost || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.classId) return alert('Select a class');
    const validBreakdown = form.breakdown.filter(b => b.name && Number(b.cost) > 0).map(b => ({ ...b, cost: Number(b.cost) }));
    if (validBreakdown.length === 0) return alert('Add at least one valid fee item with a cost > 0');
    
    addFeeStructure({
      classId: form.classId,
      term: form.term,
      breakdown: validBreakdown,
      totalAmount: validBreakdown.reduce((s, i) => s + i.cost, 0)
    });
    setIsModalOpen(false);
    setForm({ classId: '', term: 'Term 2 2026', breakdown: [{ name: '', cost: 0 }] });
  };

  const getClassName = (id) => classes.find(c => c.id === id)?.name || id;

  return (
    <div className="card">
      <div className="toolbar" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Active Fee Structures</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Create Structure
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Term</th>
              <th>Total Amount (KES)</th>
              <th>Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {(!feeStructures || feeStructures.length === 0) && (
              <tr><td colSpan={4}><div className="empty"><p>No fee structures defined yet.</p></div></td></tr>
            )}
            {feeStructures?.map(f => {
              let parsed = [];
              try { parsed = typeof f.breakdown === 'string' ? JSON.parse(f.breakdown) : f.breakdown; } catch (e) {}
              return (
                <tr key={f.id}>
                  <td><strong>{getClassName(f.classId)}</strong></td>
                  <td>{f.term}</td>
                  <td><strong>KES {f.totalAmount?.toLocaleString()}</strong></td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {parsed.map((item, i) => (
                      <div key={i}>{item.name}: {item.cost?.toLocaleString()}</div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal card" style={{ width: '100%', maxWidth: 500, padding: 0, margin: 16 }}>
            <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>New Fee Structure</h2>
              <button className="btn-close" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: 20 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Class</label>
                  <select className="select" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} value={form.classId} onChange={e => setForm({...form, classId: e.target.value})} required>
                    <option value="">-- Select Class --</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Term</label>
                  <select className="select" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} value={form.term} onChange={e => setForm({...form, term: e.target.value})} required>
                    {TERMS.filter(t => t !== 'all').map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Breakdown Items</label>
                  {form.breakdown.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <input className="input" placeholder="e.g. Tuition Fee" value={item.name} onChange={e => {
                        const newB = [...form.breakdown];
                        newB[idx].name = e.target.value;
                        setForm({ ...form, breakdown: newB });
                      }} style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} required />
                      <input className="input" type="number" placeholder="Cost" value={item.cost} onChange={e => {
                        const newB = [...form.breakdown];
                        newB[idx].cost = e.target.value;
                        setForm({ ...form, breakdown: newB });
                      }} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} required min="0" />
                      <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => {
                        setForm({ ...form, breakdown: form.breakdown.filter((_, i) => i !== idx) });
                      }}><Trash2 size={16} color="#ef4444" /></button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }} onClick={() => setForm({ ...form, breakdown: [...form.breakdown, { name: '', cost: 0 }] })}>
                    + Add Item
                  </button>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16, marginTop: 12, color: 'var(--primary)' }}>
                  Total: KES {totalCost.toLocaleString()}
                </div>
                <div className="modal-footer" style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Save Structure</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinancialOverview() {
  const { payments, metrics } = useAdmin();
  const [activeTab, setActiveTab] = useState('transactions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchTerm = termFilter === 'all' || p.term === termFilter;
    const matchFrom = !dateFrom || p.date >= dateFrom;
    const matchTo = !dateTo || p.date <= dateTo;
    return matchStatus && matchTerm && matchFrom && matchTo;
  });

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CircleDollarSign size={32} /> Financial Oversight</h1>
        <p>Manage school fee structures and audit received payments.</p>
      </div>

      <div className="tabs" style={{ marginBottom: 24, display: 'flex', gap: 16, borderBottom: '1px solid var(--border)' }}>
        <button 
          className="tab-btn"
          style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'transactions' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'transactions' ? 'bold' : 'normal', color: activeTab === 'transactions' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('transactions')}
        >
          Payment Audit
        </button>
        <button 
          className="tab-btn"
          style={{ padding: '8px 16px', background: 'none', border: 'none', borderBottom: activeTab === 'fees' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'fees' ? 'bold' : 'normal', color: activeTab === 'fees' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('fees')}
        >
          Fee Structures
        </button>
      </div>

      {activeTab === 'transactions' ? (
        <>
          {/* Summary cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="label">Total Collected</div>
              <div className="value green">KES {metrics.totalCollected.toLocaleString()}</div>
            </div>
            <div className="summary-card">
              <div className="label">Outstanding / Overdue</div>
              <div className="value red">KES {metrics.pendingFees.toLocaleString()}</div>
            </div>
            <div className="summary-card">
              <div className="label">Failed / Flagged Transactions</div>
              <div className="value yellow">{metrics.failedPayments}</div>
            </div>
          </div>

          <div className="card">
            {/* Toolbar */}
            <div className="toolbar">
              <select className="select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <select className="select" style={{ width: 'auto' }} value={termFilter} onChange={e => setTermFilter(e.target.value)}>
                {TERMS.map(t => <option key={t} value={t}>{t === 'all' ? 'All Terms' : t}</option>)}
              </select>
              <input className="input" type="date" style={{ width: 'auto' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
              <input className="input" type="date" style={{ width: 'auto' }} value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
              <div style={{ flex: 1 }} />
              <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(filtered)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={16} /> Export CSV</button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Parent</th>
                    <th>Amount (KES)</th>
                    <th>Method</th>
                    <th>Term</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8}><div className="empty"><p>No payments match the current filters.</p></div></td></tr>
                  )}
                  {filtered.map(p => (
                    <tr key={p.id} style={p.status !== 'successful' ? { background: p.status === 'overdue' ? 'rgba(245,158,11,0.04)' : 'rgba(239,68,68,0.04)' } : {}}>
                      <td>{p.date}</td>
                      <td><strong>{p.student}</strong></td>
                      <td>{p.parent}</td>
                      <td><strong>KES {p.amount.toLocaleString()}</strong></td>
                      <td>{p.method}</td>
                      <td>{p.term}</td>
                      <td>{statusBadge(p.status)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
              Showing {filtered.length} of {payments.length} transactions · Read-only audit view
            </div>
          </div>
        </>
      ) : (
        <FeeStructuresTab />
      )}
    </div>
  );
}
