import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle, 
  FileText, 
  Upload, 
  Download, 
  Video, 
  AlertCircle, 
  Sparkles, 
  Search, 
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningHub() {
  const { studentData } = useStudent();
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'resources' | 'timetable'
  
  // Submission modal state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFileLink, setSubmissionFileLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedIds, setSubmittedIds] = useState([]);

  // Resources state
  const [resourceSearch, setResourceSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Baseline assignments list
  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Bean Seedling Growth Experiment Log',
      subject: 'Integrated Science',
      dueDate: '2026-08-05',
      maxScore: 100,
      instructions: 'Upload a clear photograph of your bean seedling along with a 3-sentence summary of watering cycles.',
      urgent: true
    },
    {
      id: 'asg-2',
      title: 'Kiswahili Insha: Usafi wa Mazingira',
      subject: 'Kiswahili Language',
      dueDate: '2026-08-08',
      maxScore: 50,
      instructions: 'Andika insha ya maneno 200 kuhusu jinsi ya kutunza mazingira ya shule yetu.',
      urgent: false
    },
    {
      id: 'asg-3',
      title: 'Fractions & Percentages Practice Worksheet',
      subject: 'Mathematics',
      dueDate: '2026-08-10',
      maxScore: 100,
      instructions: 'Complete exercises 1 to 15 on page 42 of your Mathematics workbook.',
      urgent: false
    }
  ]);

  // Digital Resources
  const digitalResources = [
    { id: 1, title: 'CBC Grade 6 Science Revision Booklet', subject: 'Integrated Science', type: 'pdf', size: '2.4 MB', author: 'Mrs. Janet Bloom' },
    { id: 2, title: 'Fractions & Decimals Masterclass Notes', subject: 'Mathematics', type: 'pdf', size: '1.8 MB', author: 'Mr. Solomon Nyakundi' },
    { id: 3, title: 'Insha Writing Model Answers & Vocabulary Guide', subject: 'Kiswahili Language', type: 'pdf', size: '3.1 MB', author: 'Mwalimu Beatrice Auma' },
    { id: 4, title: 'Organic Kitchen Gardening Video Tutorial', subject: 'Agriculture', type: 'video', size: '14 mins', author: 'Mr. Erick Ombogo' },
    { id: 5, title: 'Chromebook Digital Literacy Shortcuts Sheet', subject: 'Creative Arts & Sports', type: 'pdf', size: '950 KB', author: 'Miss Clara Zawadi' }
  ];

  // Weekly Timetable
  const weeklyTimetable = [
    { time: '08:00 AM - 08:40 AM', mon: 'Mathematics', tue: 'Kiswahili', wed: 'Integrated Science', thu: 'Mathematics', fri: 'Creative Arts' },
    { time: '08:40 AM - 09:20 AM', mon: 'Kiswahili', tue: 'Mathematics', wed: 'Agriculture', thu: 'Kiswahili', fri: 'Digital Literacy' },
    { time: '09:20 AM - 10:00 AM', mon: 'Integrated Science', tue: 'Agriculture', wed: 'Mathematics', thu: 'Integrated Science', fri: 'Physical Ed.' },
    { time: '10:00 AM - 10:30 AM', mon: '☕ TEA BREAK', tue: '☕ TEA BREAK', wed: '☕ TEA BREAK', thu: '☕ TEA BREAK', fri: '☕ TEA BREAK' },
    { time: '10:30 AM - 11:10 AM', mon: 'Agriculture', tue: 'Integrated Science', wed: 'Kiswahili', thu: 'Creative Arts', fri: 'Mathematics' },
    { time: '11:10 AM - 11:50 AM', mon: 'Creative Arts', tue: 'Digital Literacy', wed: 'Creative Arts', thu: 'Agriculture', fri: 'Kiswahili' }
  ];

  const filteredResources = digitalResources.filter(r => {
    const matchSubject = selectedSubject === 'all' || r.subject === selectedSubject;
    const matchSearch = r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || r.subject.toLowerCase().includes(resourceSearch.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmittedIds(prev => [...prev, selectedAssignment.id]);
      setSubmitting(false);
      setSelectedAssignment(null);
      setSubmissionText('');
      setSubmissionFileLink('');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-indigo-200 backdrop-blur-sm mb-3">
            <Sparkles size={14} /> Student Digital Hub
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Learning Hub</h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Access your active homework tasks, digital study resources, and live weekly timetable in one place.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 overflow-x-auto">
        {[
          { id: 'assignments', label: 'Homework & Submissions', icon: FileText, count: assignments.length - submittedIds.length },
          { id: 'resources', label: 'Digital Resources Library', icon: BookOpen, count: digitalResources.length },
          { id: 'timetable', label: 'Live Weekly Timetable', icon: Calendar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                activeTab === tab.id ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 dark:text-white">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">{selectedAssignment.subject}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedAssignment.title}</h3>
              </div>
              <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Text Answer / Explanation
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Type your homework answer or observations here..."
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  File Attachment / Cloud Drive Link (Optional)
                </label>
                <input
                  type="text"
                  value={submissionFileLink}
                  onChange={e => setSubmissionFileLink(e.target.value)}
                  placeholder="e.g. https://drive.google.com/... or photograph URL"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <span>Due Date: <strong>{selectedAssignment.dueDate}</strong></span>
                <span>Max Points: <strong>{selectedAssignment.maxScore}</strong></span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !submissionText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow disabled:opacity-50"
                >
                  <Send size={14} />
                  {submitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 1: Homework & Submissions */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(asg => {
              const isSubmitted = submittedIds.includes(asg.id);
              return (
                <div key={asg.id} className={`p-6 bg-white dark:bg-slate-900 border rounded-3xl shadow-sm flex flex-col justify-between transition-all ${
                  isSubmitted ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg uppercase tracking-wider">
                        {asg.subject}
                      </span>
                      {isSubmitted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                          <CheckCircle size={12} /> Submitted
                        </span>
                      ) : asg.urgent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                          <Clock size={12} /> Urgent
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                          Pending
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{asg.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">{asg.instructions}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Due: <strong>{asg.dueDate}</strong></span>
                    {isSubmitted ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle size={14} /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(asg)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow"
                      >
                        <Upload size={14} /> Submit Work
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Digital Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={resourceSearch}
                onChange={e => setResourceSearch(e.target.value)}
                placeholder="Search notes, revision guides, e-books..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Subject:</span>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none"
              >
                <option value="all">All Learning Areas</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Integrated Science">Integrated Science</option>
                <option value="Kiswahili Language">Kiswahili Language</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(res => (
              <div key={res.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    {res.type === 'video' ? <Video size={20} /> : <BookOpen size={20} />}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded uppercase tracking-wider">
                    {res.subject}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mt-2 mb-1">{res.title}</h4>
                  <p className="text-xs text-slate-400">Author: {res.author}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500 font-medium">{res.size}</span>
                  <button
                    onClick={() => alert(`Downloading resource: ${res.title}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Timetable */}
      {activeTab === 'timetable' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Grade 6 Weekly Live Timetable</h3>
              <p className="text-xs text-slate-500">St. Joseph's Kisii South Academy official class schedule</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 rounded-xl text-xs font-bold">
              Term 2 Live
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Time Period</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Monday</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Tuesday</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Wednesday</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Thursday</th>
                <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Friday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {weeklyTimetable.map((row, idx) => (
                <tr key={idx} className={row.mon.includes('TEA') ? 'bg-amber-50/50 dark:bg-amber-950/20 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{row.time}</td>
                  <td className="p-4">{row.mon}</td>
                  <td className="p-4">{row.tue}</td>
                  <td className="p-4">{row.wed}</td>
                  <td className="p-4">{row.thu}</td>
                  <td className="p-4">{row.fri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
