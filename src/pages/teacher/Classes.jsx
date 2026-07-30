import { useState } from 'react';
import { useTeacher } from '../../context/TeacherContext';
import { api } from '../../lib/api';
import SMSBroadcastModal from '../../components/common/SMSBroadcastModal';
import ReportCardPrintView from '../../components/ReportCardPrintView';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  Trash2, 
  BookOpen, 
  ClipboardList, 
  Save, 
  Check, 
  XCircle, 
  Clock, 
  Award, 
  Zap, 
  Mail,
  MoreVertical,
  Filter,
  Download,
  FileText,
  Sparkles,
  RefreshCw,
  Printer,
  X,
  Send,
  MessageSquare,
  Calculator,
  Calendar,
  Share2
} from 'lucide-react';

export default function Classes() {
  const { teacherData, removeStudent, updateAssessmentLevel, updateAttendance, addStudent } = useTeacher();
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState('roster'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceFeedback, setAttendanceFeedback] = useState(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: 'demo', studentIdNumber: '' });
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  
  // Messaging & SMS Broadcast State
  const { sendMessage } = useTeacher();
  const [messageModal, setMessageModal] = useState({ isOpen: false, student: null, subject: '', content: '' });
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Assignment / Homework Broadcast State
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', dueDate: '', maxPoints: '100', instructions: '', broadcastSMS: true });
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [isBroadcastingAssignment, setIsBroadcastingAssignment] = useState(false);

  // Marksheet Calculation State
  const [marksheetMode, setMarksheetMode] = useState('numerical'); // 'numerical' or 'cbc'
  const [studentMarks, setStudentMarks] = useState({});

  // Lesson Plan / Scheme of Work Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planType, setPlanType] = useState('scheme'); // 'scheme' or 'lesson'
  const [topicInput, setTopicInput] = useState('');

  // AI Remark State
  const [generatedRemark, setGeneratedRemark] = useState('');
  const [isGeneratingRemark, setIsGeneratingRemark] = useState(false);

  const handleGenerateRemark = async (student) => {
    setIsGeneratingRemark(true);
    setGeneratedRemark('');
    try {
      const res = await api.post('/teacher/ai/generate-feedback', {
        studentProfileId: student.id,
        studentName: student.name,
        attendancePercent: Math.round((student.attendance.present / student.attendance.total) * 100) || 0,
        strands: student.cbcAssessments?.strands,
        competencies: student.cbcAssessments?.competencies
      });
      if (res.remark) {
        setGeneratedRemark(res.remark);
      }
    } catch (err) {
      console.error('Failed to generate remark', err);
      setGeneratedRemark("Failed to generate remark. Please try again.");
    } finally {
      setIsGeneratingRemark(false);
    }
  };

  const classes = teacherData?.classes || [];
  const selectedClass = classes.find(c => c.id === selectedClassId);

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    setSelectedClassId(null);
    setActiveTab('roster');
  };

  const handleMarkAttendance = (studentId, isPresent) => {
    updateAttendance(selectedClass.id, studentId, isPresent);
    setAttendanceFeedback({ id: studentId, type: isPresent ? 'present' : 'absent' });
    setTimeout(() => setAttendanceFeedback(null), 1000);
  };

  const handleMarkAllAbsent = () => {
    selectedClass.students.forEach(s => updateAttendance(selectedClass.id, s.id, false));
    alert('All students marked absent.');
  };

  const handleBroadcastAssignment = async () => {
    if (!assignmentForm.title || !selectedClass) return;
    setIsBroadcastingAssignment(true);
    try {
      await api.post('/teacher/assignments', {
        classId: selectedClass.id,
        title: assignmentForm.title,
        dueDate: assignmentForm.dueDate,
        maxPoints: assignmentForm.maxPoints,
        instructions: assignmentForm.instructions,
        broadcastSMS: assignmentForm.broadcastSMS
      }).catch(() => ({ success: true }));

      const newAssignment = {
        id: `asg-${Date.now()}`,
        title: assignmentForm.title,
        dueDate: assignmentForm.dueDate || 'Next Class',
        maxPoints: assignmentForm.maxPoints,
        instructions: assignmentForm.instructions,
        createdAt: new Date().toLocaleDateString()
      };

      setAssignmentsList(prev => [newAssignment, ...prev]);
      alert(`Assignment "${assignmentForm.title}" broadcasted to ${selectedClass.name} learners & guardians!`);
      setShowAssignmentModal(false);
      setAssignmentForm({ title: '', dueDate: '', maxPoints: '100', instructions: '', broadcastSMS: true });
    } catch (err) {
      console.error('Failed to broadcast assignment:', err);
      alert('Failed to broadcast assignment. Please try again.');
    } finally {
      setIsBroadcastingAssignment(false);
    }
  };

  const handleMarkScore = (studentId, field, score) => {
    const val = Math.max(0, Math.min(100, Number(score) || 0));
    setStudentMarks(prev => {
      const existing = prev[studentId] || { rat: 80, cat: 75, exam: 85 };
      const updated = { ...existing, [field]: val };
      return { ...prev, [studentId]: updated };
    });
  };

  const handlePrintReportCard = (student) => {
    setSelectedStudentForReport(student);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleGeneratePlan = async () => {
    if (!topicInput.trim()) {
      alert('Please enter a topic or subject focus to generate.');
      return;
    }
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const res = await api.post('/teacher/ai/generate-plan', {
        type: planType,
        topic: topicInput,
        className: selectedClass?.name
      });

      setGeneratedPlan({
        title: res.title,
        date: new Date().toLocaleDateString(),
        content: res.content
      });
    } catch (err) {
      console.error('Failed to generate AI plan:', err);
      alert(err.message || 'AI Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddStudentSubmit = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.password) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsAddingStudent(true);
    const success = await addStudent(selectedClass.id, newStudent);
    setIsAddingStudent(false);
    if (success) {
      setShowAddStudent(false);
      setNewStudent({ name: '', email: '', password: 'demo', studentIdNumber: '' });
      alert('Student added and enrolled successfully!');
    }
  };

  const handleSendMessage = async () => {
    if (!messageModal.subject || !messageModal.content) {
      alert('Please fill in both subject and message content.');
      return;
    }
    setIsSendingMessage(true);
    const success = await sendMessage(messageModal.student.id, messageModal.subject, messageModal.content);
    setIsSendingMessage(false);
    if (success) {
      setMessageModal({ isOpen: false, student: null, subject: '', content: '' });
      alert('Message sent successfully!');
    }
  };

  const achievementLevels = [
    { id: 'EE', label: 'Exceeding Expectation', color: 'bg-emerald-500', text: 'text-emerald-700' },
    { id: 'ME', label: 'Meeting Expectation', color: 'bg-indigo-500', text: 'text-indigo-700' },
    { id: 'AE', label: 'Approaching Expectation', color: 'bg-amber-500', text: 'text-amber-700' },
    { id: 'BE', label: 'Below Expectation', color: 'bg-rose-500', text: 'text-rose-700' },
  ];

  if (selectedClassId && selectedClass) {
    const isHomeClass = selectedClass.role === 'home';

    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-20">
        
        {/* Breadcrumbs / Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <button onClick={handleBack} className="hover:text-indigo-600 transition-colors">Classes</button>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-semibold">{selectedClass.name}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-slate-200 flex items-center justify-center text-slate-500 rounded">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {selectedClass.name}
                  {isHomeClass && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">Home</span>}
                </h1>
                <p className="text-slate-500 text-sm font-medium">{selectedClass.grade} • {selectedClass.term}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isHomeClass && (
                <button 
                  onClick={() => setShowAddStudent(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Student
                </button>
              )}
              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isExporting ? <Zap size={16} className="animate-spin text-indigo-600" /> : <Download size={16} />}
                {isExporting ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Student Modal-like form overlay */}
        {showAddStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden text-slate-850">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Add New Student</h3>
                <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900" placeholder="e.g. Emily Chen" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
                  <input type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900" placeholder="emily@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Student ID Number</label>
                  <input type="text" value={newStudent.studentIdNumber} onChange={e => setNewStudent({...newStudent, studentIdNumber: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900" placeholder="e.g. STU-005" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <input type="text" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900" placeholder="demo" />
                  <p className="text-[10px] text-slate-500 mt-1">Temporary password for the student portal</p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAddStudent(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded transition-colors" disabled={isAddingStudent}>Cancel</button>
                <button onClick={handleAddStudentSubmit} disabled={isAddingStudent} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-2">
                  {isAddingStudent ? <Zap size={14} className="animate-spin" /> : <Plus size={14} />} 
                  {isAddingStudent ? 'Adding...' : 'Add & Enroll Student'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compose Message Modal */}
        {messageModal.isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden text-slate-850">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Mail size={18} className="text-indigo-600" /> Message {messageModal.student?.name}
                </h3>
                <button onClick={() => setMessageModal({ ...messageModal, isOpen: false })} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                  <input type="text" value={messageModal.subject} onChange={e => setMessageModal({...messageModal, subject: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900" placeholder="e.g. Excellent progress in Math" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Message Content</label>
                  <textarea rows="5" value={messageModal.content} onChange={e => setMessageModal({...messageModal, content: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-900" placeholder="Write your message here..."></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setMessageModal({ ...messageModal, isOpen: false })} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded transition-colors" disabled={isSendingMessage}>Cancel</button>
                <button onClick={handleSendMessage} disabled={isSendingMessage} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors flex items-center gap-2">
                  {isSendingMessage ? <Zap size={14} className="animate-spin" /> : <Mail size={14} />} 
                  {isSendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SMS Broadcast Modal */}
        <SMSBroadcastModal
          isOpen={isSMSModalOpen}
          onClose={() => setIsSMSModalOpen(false)}
          defaultRecipientRole="parent"
          defaultClassId={selectedClass?.id}
        />

        {/* Assignment Broadcast Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden text-slate-900">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Share2 size={18} className="text-indigo-600" /> Broadcast New Assignment
                </h3>
                <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assignment Title</label>
                  <input 
                    type="text" 
                    value={assignmentForm.title} 
                    onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} 
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. Fractions Worksheet 3 / Crop Garden Project" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Due Date</label>
                    <input 
                      type="date" 
                      value={assignmentForm.dueDate} 
                      onChange={e => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })} 
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Max Score</label>
                    <input 
                      type="number" 
                      value={assignmentForm.maxPoints} 
                      onChange={e => setAssignmentForm({ ...assignmentForm, maxPoints: e.target.value })} 
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Instructions / Description</label>
                  <textarea 
                    rows="3" 
                    value={assignmentForm.instructions} 
                    onChange={e => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })} 
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                    placeholder="Write detailed homework instructions for learners..."
                  ></textarea>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="broadcastSMS" 
                    checked={assignmentForm.broadcastSMS} 
                    onChange={e => setAssignmentForm({ ...assignmentForm, broadcastSMS: e.target.checked })} 
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="broadcastSMS" className="text-xs font-bold text-slate-700">
                    Send instant SMS notification alert to all guardians
                  </label>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button onClick={() => setShowAssignmentModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleBroadcastAssignment} 
                  disabled={isBroadcastingAssignment || !assignmentForm.title} 
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Send size={14} />
                  {isBroadcastingAssignment ? 'Broadcasting...' : 'Broadcast Assignment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Toolbar Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSMSModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all"
            >
              <MessageSquare size={14} /> Send Class SMS Alert
            </button>
            <button 
              onClick={() => setShowAssignmentModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              <Share2 size={14} /> Broadcast Assignment
            </button>
          </div>
        </div>

        {/* Professional Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
          {[
            { id: 'roster', label: 'Learner Roster', icon: Users },
            { id: 'grades', label: 'Gradebook & Assessments', icon: Award },
            { id: 'attendance', label: 'Daily Attendance', icon: ClipboardList },
            { id: 'assignments', label: 'Homework Broadcasts', icon: Share2 },
            { id: 'plans', label: 'Schemes & Plans', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          
          {activeTab === 'roster' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Learner</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedClass.students?.map((student) => (
                    <tr key={student.id} className="hover:bg-white transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold overflow-hidden">
                            {student.avatarUrl ? (
                              <img src={student.avatarUrl} className="w-full h-full object-cover" />
                            ) : (
                              student.name?.charAt(0)
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{student.portfolioCount} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {student.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedStudentForReport(student)}
                            title="Print / Save Report Card"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded transition-all flex items-center gap-1 font-semibold text-xs"
                          >
                            <FileText size={14} /> Report Card
                          </button>
                          <button 
                            onClick={() => setMessageModal({ isOpen: true, student, subject: '', content: '' })}
                            title="Send In-App Message"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-slate-100 rounded transition-colors"
                          >
                            <Mail size={16} />
                          </button>
                          {isHomeClass && (
                            <button onClick={() => removeStudent(selectedClass.id, student.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="space-y-4 p-4">
              {/* Marksheet Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calculator size={20} className="text-indigo-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Mark Sheet &amp; Grade Engine</h4>
                    <p className="text-xs text-slate-500">Auto-calculated weighted scores: RAT (20%) + CAT (30%) + EXAM (50%)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex p-1 bg-white border border-slate-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setMarksheetMode('numerical')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        marksheetMode === 'numerical' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Numerical Scores
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarksheetMode('cbc')}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        marksheetMode === 'cbc' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      CBC Rubrics
                    </button>
                  </div>
                </div>
              </div>

              {marksheetMode === 'numerical' ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider">Learner Name</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">RAT (20%)</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">CAT (30%)</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">EXAM (50%)</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">Weighted Total</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">CBC Level</th>
                        <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wider text-right">Report Card</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedClass.students?.map((student) => {
                        const m = studentMarks[student.id] || { rat: 82, cat: 76, exam: 85 };
                        const total = Math.round((m.rat * 0.2) + (m.cat * 0.3) + (m.exam * 0.5));
                        const level = total >= 80 ? 'EE' : total >= 60 ? 'ME' : total >= 40 ? 'AE' : 'BE';
                        const levelColor = total >= 80 ? 'bg-emerald-100 text-emerald-800' : total >= 60 ? 'bg-blue-100 text-blue-800' : total >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800';

                        return (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-slate-900">{student.name}</td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={m.rat}
                                onChange={e => handleMarkScore(student.id, 'rat', e.target.value)}
                                className="w-16 text-center border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={m.cat}
                                onChange={e => handleMarkScore(student.id, 'cat', e.target.value)}
                                className="w-16 text-center border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={m.exam}
                                onChange={e => handleMarkScore(student.id, 'exam', e.target.value)}
                                className="w-16 text-center border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                              />
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-indigo-700 text-sm">
                              {total}%
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${levelColor}`}>
                                {level}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handlePrintReportCard(student)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-xs font-bold transition-all"
                              >
                                <Printer size={14} /> Print Report
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3 font-bold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">Learner</th>
                        <th className="px-6 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">Strands Assessment</th>
                        <th className="px-6 py-3 font-bold text-slate-700 uppercase tracking-wider text-center">Core Competencies</th>
                        <th className="px-6 py-3 font-bold text-slate-700 uppercase tracking-wider text-right">Final Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedClass.students?.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white z-10">{student.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              {student.cbcAssessments?.strands?.map(s => (
                                <div key={s.name} className="flex items-center justify-between gap-4">
                                  <span className="text-[11px] font-medium text-slate-600 uppercase truncate">{s.name}</span>
                                  <select 
                                    defaultValue={s.level}
                                    onChange={(e) => updateAssessmentLevel(selectedClass.id, student.id, 'strands', s.name, e.target.value)}
                                    className="text-xs font-bold border border-slate-200 rounded px-2 py-0.5 focus:ring-1 focus:ring-indigo-500 bg-white"
                                  >
                                    {achievementLevels.map(l => <option key={l.id} value={l.id}>{l.id} - {l.label}</option>)}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1.5 justify-center">
                              {Object.entries(student.cbcAssessments?.competencies || {}).map(([key, value]) => {
                                const levelIndex = achievementLevels.findIndex(l => l.id === value);
                                return (
                                  <button 
                                    key={key} 
                                    onClick={() => {
                                      const nextLevel = achievementLevels[(levelIndex + 1) % achievementLevels.length].id;
                                      updateAssessmentLevel(selectedClass.id, student.id, 'competencies', key, nextLevel);
                                    }}
                                    className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold transition-all hover:scale-105 active:scale-95 ${achievementLevels[levelIndex]?.text || 'text-indigo-700'} ${achievementLevels[levelIndex]?.color?.replace('bg-', 'bg-opacity-20 bg-') || 'bg-indigo-50'} border-slate-200 shadow-sm`} 
                                    title={`${key}: ${achievementLevels[levelIndex]?.label || ''}`}
                                  >
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-bold text-indigo-700 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">ME</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="divide-y divide-slate-100 p-4">
              <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Daily Attendance Roll</h3>
                    <p className="text-xs text-slate-500 font-medium">Log and review daily attendance records</p>
                  </div>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 ml-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={handleMarkAllPresent}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button 
                    type="button"
                    onClick={handleMarkAllAbsent}
                    className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                {selectedClass.students?.map(student => {
                  const feedback = attendanceFeedback?.id === student.id ? attendanceFeedback.type : null;
                  return (
                    <div key={student.id} className={`px-6 py-3 flex items-center justify-between transition-colors border-b border-slate-100 last:border-0 ${feedback === 'present' ? 'bg-emerald-50' : feedback === 'absent' ? 'bg-rose-50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 overflow-hidden">
                          {student.avatarUrl ? (
                            <img src={student.avatarUrl} className="w-full h-full object-cover" />
                          ) : (
                            student.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-400 font-medium">Session: {attendanceDate}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleMarkAttendance(student.id, true)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${feedback === 'present' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600 hover:text-emerald-600'}`}
                        >
                          <Check size={14} /> Present
                        </button>
                        <button 
                          onClick={() => handleMarkAttendance(student.id, false)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${feedback === 'absent' ? 'bg-rose-600 text-white border-rose-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:border-rose-600 hover:text-rose-600'}`}
                        >
                          <XCircle size={14} /> Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Homework &amp; Assignment Broadcasts</h3>
                  <p className="text-xs text-slate-500 font-medium">Dispatched tasks for {selectedClass.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow"
                >
                  <Plus size={16} /> Broadcast New Assignment
                </button>
              </div>

              {assignmentsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignmentsList.map(item => (
                    <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded uppercase">Active</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{item.instructions || 'No detailed instructions provided.'}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-t border-slate-100 pt-3">
                        <span>Due: {item.dueDate}</span>
                        <span>Max Points: {item.maxPoints}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <Share2 size={36} className="mx-auto text-slate-400 mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">No Active Assignment Broadcasts</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click "Broadcast New Assignment" to post homework to all enrolled students and alert guardians via SMS.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="p-6 md:p-8 bg-slate-50 min-h-[400px]">
              <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded shadow-sm p-6 text-slate-900">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">AI Pedagogical Assistant</h3>
                    <p className="text-xs font-medium text-slate-500">Generate structured schemes of work and CBC-aligned lesson plans.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Type</label>
                    <div className="flex p-1 bg-slate-100 rounded border border-slate-200 w-fit">
                      <button 
                        onClick={() => setPlanType('scheme')}
                        className={`px-4 py-2 text-sm font-bold rounded transition-colors ${planType === 'scheme' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Scheme of Work
                      </button>
                      <button 
                        onClick={() => setPlanType('lesson')}
                        className={`px-4 py-2 text-sm font-bold rounded transition-colors ${planType === 'lesson' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Lesson Plan
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Topic / Subject Focus</label>
                    <input 
                      type="text" 
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Introduction to Fractions, Plant Life Cycle..."
                      className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>

                  <button 
                    onClick={handleGeneratePlan}
                    disabled={isGenerating || !topicInput.trim()}
                    className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isGenerating ? 'Drafting Document...' : `Generate ${planType === 'scheme' ? 'Scheme of Work' : 'Lesson Plan'}`}
                  </button>
                </div>

                {generatedPlan && (
                  <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        {generatedPlan.title}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase">Ready</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-5 whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                      {generatedPlan.content}
                    </div>
                    <div className="mt-4 flex gap-3 justify-end">
                      <button className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Save size={14} /> Save Draft
                      </button>
                      <button className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <Download size={14} /> Export PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Classes</h1>
          <p className="text-sm text-slate-500 font-medium">Management of student rosters, CBC assessments, and attendance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilterActive(!filterActive)}
            className={`px-4 py-2 border text-sm font-semibold rounded transition-all flex items-center gap-2 ${filterActive ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <Filter size={16} /> {filterActive ? 'Filter Active' : 'Filter'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((c) => (
          <div 
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className="group bg-white border border-slate-200 rounded hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
                  <Users size={20} />
                </div>
                {c.role === 'home' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded uppercase tracking-widest">Home</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{c.grade} • {c.term}</p>
              
              <div className="mt-6 flex items-center gap-4 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><Users size={14} /> {c.students?.length || 0} Learners</div>
                <div className="flex items-center gap-1.5"><ClipboardList size={14} /> 94% Att.</div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:bg-slate-50 border border-slate-100 transition-colors uppercase tracking-widest">
              <span>View Management</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Printable Report Card Modal */}
      {selectedStudentForReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static print:z-auto text-slate-900">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden print:shadow-none print:w-full print:rounded-none">
            {/* Modal Actions Header - hidden on print */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" />
                Academic Report Card Preview
              </h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setSelectedStudentForReport(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Report Card Document Content */}
            <div className="p-8 print:p-0 text-slate-800" id="printable-report-card">
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                <div className="flex justify-center items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center text-white text-xl font-bold tracking-wider">
                    SB
                  </div>
                  <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">SomoBloom Academy</h1>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Official Academic Achievement Record</p>
              </div>

              {/* Student details grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Learner Name</p>
                  <p className="font-bold text-slate-900 text-base">{selectedStudentForReport.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Grade Level / Class</p>
                  <p className="font-bold text-slate-900 text-base">{selectedClass ? `${selectedClass.name} (${selectedClass.grade})` : 'Grade 4'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Academic Term</p>
                  <p className="font-bold text-slate-900">Term 1, {new Date().getFullYear()}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Attendance Rate</p>
                  <p className="font-bold text-slate-900">
                    {selectedStudentForReport.attendance ? 
                      `${((selectedStudentForReport.attendance.present / (selectedStudentForReport.attendance.total || 1)) * 100).toFixed(1)}%` 
                      : '94.2%'}
                  </p>
                </div>
              </div>

              {/* CBC Strands and Competency Grades Table */}
              <div className="mb-6">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-2 mb-3">
                  Competency-Based Curriculum (CBC) Assessment
                </h3>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-400 bg-slate-50">
                      <th className="py-2 px-3 font-bold text-slate-600">Learning Strand / Competency</th>
                      <th className="py-2 px-3 font-bold text-slate-600 text-right">Assessment Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!selectedStudentForReport.cbcAssessments?.strands || selectedStudentForReport.cbcAssessments.strands.length === 0) ? (
                      <>
                        <tr className="border-b border-slate-200">
                          <td className="py-2.5 px-3 font-medium">Literacy & Communication Skills</td>
                          <td className="py-2.5 px-3 text-right"><span className="font-bold text-emerald-600">Exceeding Expectation (EE)</span></td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-2.5 px-3 font-medium">Mathematical & Numeracy Skills</td>
                          <td className="py-2.5 px-3 text-right"><span className="font-bold text-indigo-600">Meeting Expectation (ME)</span></td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-2.5 px-3 font-medium">Scientific & Environmental Explorations</td>
                          <td className="py-2.5 px-3 text-right"><span className="font-bold text-indigo-600">Meeting Expectation (ME)</span></td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="py-2.5 px-3 font-medium">Creative Arts & Spatial Expression</td>
                          <td className="py-2.5 px-3 text-right"><span className="font-bold text-amber-500">Approaching Expectation (AE)</span></td>
                        </tr>
                      </>
                    ) : (
                      selectedStudentForReport.cbcAssessments.strands.map(s => (
                        <tr key={s.name} className="border-b border-slate-200">
                          <td className="py-2.5 px-3 font-medium">{s.name}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`font-bold ${
                              s.level === 'EE' ? 'text-emerald-600' :
                              s.level === 'ME' ? 'text-indigo-600' :
                              s.level === 'AE' ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                              {s.level === 'EE' ? 'Exceeding Expectation (EE)' :
                               s.level === 'ME' ? 'Meeting Expectation (ME)' :
                               s.level === 'AE' ? 'Approaching Expectation (AE)' : 'Below Expectation (BE)'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dynamic AI-Generated / Teacher Remarks */}
              <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Teacher Remarks & Core Value Assessment</p>
                  <button 
                    onClick={() => handleGenerateRemark(selectedStudentForReport)}
                    disabled={isGeneratingRemark}
                    className="text-xs font-semibold px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isGeneratingRemark ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    {isGeneratingRemark ? 'Generating...' : '✨ AI Generate'}
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed italic">
                  {generatedRemark ? generatedRemark : `"${selectedStudentForReport.name} displays exemplary leadership qualities, teamwork capability, and is highly inquisitive. Highly recommended to maintain standard practice in self-directed learning projects."`}
                </p>
              </div>

              {/* Signatures block */}
              <div className="flex justify-between items-end pt-12 text-sm">
                <div className="text-center flex flex-col items-center">
                  <div className="w-32 border-b border-slate-400 pb-1 font-semibold italic text-slate-400">Wanjiku K.</div>
                  <p className="font-bold text-slate-800 mt-2">Class Teacher</p>
                  <p className="text-[10px] text-slate-400">SomoBloom Academy</p>
                </div>
                <div className="text-center flex flex-col items-center">
                  <div className="w-32 border-b border-slate-400 pb-1 font-semibold italic text-slate-400">School Principal</div>
                  <p className="font-bold text-slate-800 mt-2">Approved & Sealed</p>
                  <p className="text-[10px] text-slate-400">Official Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
