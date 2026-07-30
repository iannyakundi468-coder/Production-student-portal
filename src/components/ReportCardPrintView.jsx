import React from 'react';

export default function ReportCardPrintView({ student, portfolio, competencies, attendance, remark }) {
  if (!student) return null;

  const attendancePercent = attendance?.total > 0 
    ? ((attendance.present / attendance.total) * 100).toFixed(0)
    : (attendance?.percentage || '100');

  return (
    <div className="print-only" style={{ display: 'none', padding: 40, fontFamily: 'Arial, sans-serif', color: '#1e293b' }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only, .print-only * {
              visibility: visible;
            }
            .print-only {
              display: block !important;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              padding: 24px;
            }
            .no-print {
              display: none !important;
            }
            @page { size: A4; margin: 1.2cm; }
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 25, borderBottom: '3px double #0f172a', paddingBottom: 15 }}>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 1, color: '#1e1b4b', textTransform: 'uppercase' }}>
          St. Joseph's Kisii South Academy
        </h1>
        <p style={{ margin: '4px 0', fontSize: 13, color: '#475569' }}>
          P.O. Box 4500 - 40200 Kisii, Kenya | Email: info@somobloom.co.ke
        </p>
        <h2 style={{ margin: '12px 0 4px 0', fontSize: 18, color: '#4338ca', fontWeight: 'bold' }}>
          OFFICIAL CBC PROGRESS REPORT CARD
        </h2>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 'bold', color: '#64748b' }}>Term 2, 2026</p>
      </div>

      {/* Student Meta Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25, padding: 16, border: '1px solid #cbd5e1', borderRadius: 8, backgroundColor: '#f8fafc' }}>
        <div>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Learner Name:</strong> {student.name}</p>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Admission No:</strong> {student.id || 'SB-2026-6819'}</p>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Grade / Level:</strong> {student.grade || 'Grade 6 Junior School'}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Attendance Rate:</strong> {attendancePercent}% ({attendance?.present || 0} / {attendance?.total || 0} Days)</p>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Learning Interests:</strong> {student.interests || 'Robotics, Science, Agriculture'}</p>
          <p style={{ margin: '3px 0', fontSize: 13 }}><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Subject Mark Sheet & Assessment Rubric */}
      <div style={{ marginBottom: 25 }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: 15, textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #cbd5e1', paddingBottom: 4 }}>
          Academic Mark Sheet &amp; Learning Areas
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, fontSize: 12 }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'left' }}>Learning Area</th>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'center' }}>RAT (20%)</th>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'center' }}>CAT (30%)</th>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'center' }}>EXAM (50%)</th>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'center' }}>Weighted Total</th>
              <th style={{ border: '1px solid #94a3b8', padding: 8, textAlign: 'center' }}>CBC Rubric Level</th>
            </tr>
          </thead>
          <tbody>
            {(competencies && competencies.length > 0) ? (
              competencies.map((c, i) => {
                const rat = c.rat ?? 82;
                const cat = c.cat ?? 78;
                const exam = c.exam ?? 85;
                const total = Math.round((rat * 0.2) + (cat * 0.3) + (exam * 0.5));
                const level = total >= 80 ? 'EE (Exceeding)' : total >= 60 ? 'ME (Meeting)' : total >= 40 ? 'AE (Approaching)' : 'BE (Below)';
                
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, fontWeight: 'bold' }}>{c.subject || c.name || `Learning Area ${i+1}`}</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center' }}>{rat}%</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center' }}>{cat}%</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center' }}>{exam}%</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center', fontWeight: 'bold', color: '#1e40af' }}>{total}%</td>
                    <td style={{ border: '1px solid #cbd5e1', padding: 8, textAlign: 'center', fontWeight: 'bold' }}>{level}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ border: '1px solid #cbd5e1', padding: 12, textAlign: 'center', color: '#64748b' }}>
                  No subject marks recorded for this academic term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CBC Rubric Legend */}
      <div style={{ marginBottom: 20, padding: 10, border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, backgroundColor: '#f8fafc' }}>
        <strong>CBC Rubric Key:</strong> EE = Exceeding Expectations (80-100%) | ME = Meeting Expectations (60-79%) | AE = Approaching Expectations (40-59%) | BE = Below Expectations (0-39%)
      </div>

      {/* Remarks Section */}
      <div style={{ marginBottom: 30, padding: 14, border: '1px solid #cbd5e1', borderRadius: 8, backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 6px 0', fontSize: 13, textTransform: 'uppercase', color: '#334155' }}>
          Class Teacher's Remarks &amp; Feedback:
        </h4>
        <p style={{ margin: 0, fontSize: 12, fontStyle: 'italic', color: '#1e293b', lineHeight: 1.5 }}>
          "{remark || student.teacherComment || `${student.name} has demonstrated excellent commitment to learning, teamwork, and critical problem solving across all core CBC strands this term.`}"
        </p>
      </div>

      {/* Signatures */}
      <div style={{ marginTop: 45, display: 'flex', justifyContent: 'space-between', paddingTop: 15 }}>
        <div style={{ width: '42%', textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: 8 }}>
          <strong style={{ fontSize: 12 }}>Class Teacher Signature</strong>
        </div>
        <div style={{ width: '42%', textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: 8 }}>
          <strong style={{ fontSize: 12 }}>Head Teacher Signature &amp; Stamp</strong>
        </div>
      </div>
      
      <div style={{ marginTop: 30, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
        Official Document generated by SomoBloom Education System on {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
