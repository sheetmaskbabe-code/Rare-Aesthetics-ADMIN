import React, { useState } from 'react';
import {
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  CalendarCheck,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Loader2,
  User,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Enquiry } from '../../types';
import { api } from '../../lib/api';

interface EnquiriesManagerProps {
  enquiries: Enquiry[];
  onRefresh: () => void;
}

export const EnquiriesManager: React.FC<EnquiriesManagerProps> = ({
  enquiries,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  const extractDate = (e: Enquiry) => {
    const msg = e.message || '';
    const dateMatch = msg.match(/Scheduled Date:\s*([^\n\r]+)/i);
    if (dateMatch && dateMatch[1]) return dateMatch[1].trim();
    if (e.service?.includes(' at ')) {
      return e.service.replace(/^Consultation:\s*/i, '').split(' at ')[0].trim();
    }
    return 'Scheduled Date';
  };

  const extractTime = (e: Enquiry) => {
    const msg = e.message || '';
    const timeMatch = msg.match(/Selected Time:\s*([^\n\r]+)/i);
    if (timeMatch && timeMatch[1]) return timeMatch[1].trim();
    if (e.service?.includes(' at ')) {
      const parts = e.service.split(' at ');
      if (parts[1]) return parts[1].trim();
    }
    return 'Scheduled Time';
  };

  const getPhoneNumber = (e: Enquiry) => {
    if (e.phone && e.phone.trim()) return e.phone.trim();
    const match = (e.message || '').match(/Phone:\s*([^\n\r]+)/i);
    if (match && match[1] && match[1].trim() !== 'None provided') {
      return match[1].trim();
    }
    return null;
  };

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      (e.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.service || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.message || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSelect = (e: Enquiry) => {
    setSelectedEnquiry(e);
    setNotes(e.notes || '');
  };

  const handleStatusChange = async (id: string, newStatus: Enquiry['status']) => {
    try {
      setUpdatingStatusId(id);
      await api.updateEnquiryStatus(id, newStatus);
      if (selectedEnquiry && (selectedEnquiry._id === id || selectedEnquiry.id === id)) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
      onRefresh();
      if (newStatus === 'accepted') {
        alert(
          'Consultation confirmed! The appointment confirmation email has been auto-filled and dispatched to the customer.'
        );
      }
    } catch (err: any) {
      alert(`Failed to update consultation status: ${err.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSendConfirmationEmail = async (id: string) => {
    try {
      setSendingEmailId(id);
      const res = await api.sendConfirmationEmail(id);
      if (res.mailResult?.skipped) {
        alert(
          `Confirmation email drafted, but SMTP credentials are not yet configured in backend/.env: ${res.mailResult.reason}.\nAdd SMTP_USER and SMTP_PASS to send live emails.`
        );
      } else {
        alert('Appointment confirmation email sent successfully!');
      }
    } catch (err: any) {
      alert(`Failed to send confirmation email: ${err.message}`);
    } finally {
      setSendingEmailId(null);
    }
  };

  const handleDecline = async (id: string, name?: string) => {
    const displayName = name ? ` for "${name}"` : '';
    if (!confirm(`Are you sure you want to decline and delete this consultation request${displayName}?`)) {
      return;
    }

    try {
      setUpdatingStatusId(id);
      await api.deleteEnquiry(id);
      if (selectedEnquiry && (selectedEnquiry._id === id || selectedEnquiry.id === id)) {
        setSelectedEnquiry(null);
      }
      onRefresh();
    } catch (err: any) {
      alert(`Failed to decline and delete consultation: ${err.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    const id = selectedEnquiry._id || selectedEnquiry.id || '';
    try {
      setSavingNotes(true);
      await api.updateEnquiryStatus(id, selectedEnquiry.status, notes);
      setSelectedEnquiry({ ...selectedEnquiry, notes });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to save notes: ${err.message}`);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this consultation record?')) return;

    try {
      setDeletingId(id);
      await api.deleteEnquiry(id);
      if (selectedEnquiry && (selectedEnquiry._id === id || selectedEnquiry.id === id)) {
        setSelectedEnquiry(null);
      }
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete consultation: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search consultations & bookings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'new', label: 'Pending' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'declined', label: 'Declined' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'closed', label: 'Closed' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === id
                    ? id === 'accepted'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : id === 'declined'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 self-end sm:self-auto">
          Showing <span className="text-white font-semibold">{filtered.length}</span> of {enquiries.length} consultations
        </div>
      </div>

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Consultations list */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
              <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No consultations matching your filter.</p>
            </div>
          ) : (
            filtered.map((e) => {
              const id = e.id || e._id || '';
              const isSelected = selectedEnquiry && (selectedEnquiry.id === id || selectedEnquiry._id === id);
              const isUpdating = updatingStatusId === id;

              return (
                <div
                  key={id}
                  onClick={() => handleSelect(e)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{e.name}</h4>
                        {e.company && (
                          <span className="text-[11px] text-slate-400">({e.company})</span>
                        )}
                      </div>
                      <span className="text-[11px] text-purple-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-purple-400 inline shrink-0" />
                        <span className="line-clamp-1">{e.service || 'Cosmetic Consultation'}</span>
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase flex items-center gap-1 shrink-0 ${
                        e.status === 'accepted'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : e.status === 'declined'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                          : e.status === 'new'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : e.status === 'contacted'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                      }`}
                    >
                      {e.status === 'accepted' && <Check className="w-3 h-3 text-emerald-400" />}
                      {e.status === 'declined' && <X className="w-3 h-3 text-rose-400" />}
                      <span>{e.status}</span>
                    </span>
                  </div>

                  {/* Contact Badges: Phone & Email prominently displayed on card */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getPhoneNumber(e) ? (
                      <a
                        href={`tel:${getPhoneNumber(e)}`}
                        onClick={(evt) => evt.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs hover:bg-emerald-500/25 transition-colors cursor-pointer shadow-sm"
                        title="Call Customer Phone"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{getPhoneNumber(e)}</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-500 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-600" />
                        <span>No phone</span>
                      </span>
                    )}

                    {e.email && (
                      <a
                        href={`mailto:${e.email}`}
                        onClick={(evt) => evt.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs hover:bg-purple-500/25 transition-colors cursor-pointer truncate max-w-[240px]"
                        title="Email Customer"
                      >
                        <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{e.email}</span>
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {e.message}
                  </p>

                  {/* Bottom info & Quick Accept / Decline actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-slate-500 mt-3 pt-2.5 border-t border-slate-800/60">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(e.createdAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    {/* Quick Accept / Decline Buttons on the card (hidden once accepted) */}
                    {e.status !== 'accepted' && (
                      <div
                        className="flex items-center gap-2 self-end sm:self-auto"
                        onClick={(evt) => evt.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(id, 'accepted')}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-emerald-600/15 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/30"
                          title="Accept Consultation"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept</span>
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleDecline(id, e.name)}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-rose-600/15 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30"
                          title="Decline and remove consultation"
                        >
                          <X className="w-3 h-3" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected consultation detail drawer */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-24 space-y-5">
          {selectedEnquiry ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <h3 className="text-base font-bold text-white">{selectedEnquiry.name}</h3>
                  </div>
                  <p className="text-xs text-purple-400 font-medium mt-1 flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{selectedEnquiry.service || 'Cosmetic Consultation Request'}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(selectedEnquiry.id || selectedEnquiry._id || '')}
                  disabled={deletingId === (selectedEnquiry.id || selectedEnquiry._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Consultation Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Consultation Decision Box: Accept & Decline Buttons */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-purple-400" />
                    <span>Consultation Decision</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase flex items-center gap-1 ${
                      selectedEnquiry.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : selectedEnquiry.status === 'declined'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {selectedEnquiry.status === 'accepted' && <Check className="w-3 h-3 text-emerald-400" />}
                    {selectedEnquiry.status === 'declined' && <X className="w-3 h-3 text-rose-400" />}
                    Status: {selectedEnquiry.status}
                  </span>
                </div>

                {/* Accept and Decline Action Buttons (hidden once accepted) */}
                {selectedEnquiry.status !== 'accepted' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          selectedEnquiry.id || selectedEnquiry._id || '',
                          'accepted'
                        )
                      }
                      className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white border border-emerald-500/40"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept</span>
                    </button>

                    <button
                      type="button"
                      disabled={updatingStatusId === (selectedEnquiry.id || selectedEnquiry._id)}
                      onClick={() =>
                        handleDecline(
                          selectedEnquiry.id || selectedEnquiry._id || '',
                          selectedEnquiry.name
                        )
                      }
                      className="py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/40"
                      title="Decline and delete consultation request"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline & Remove</span>
                    </button>
                  </div>
                )}

                {/* Additional workflow status transitions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Other Status:</span>
                  <div className="flex items-center gap-1.5">
                    {(['new', 'contacted', 'closed'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          handleStatusChange(selectedEnquiry._id || selectedEnquiry.id || '', st)
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                          selectedEnquiry.status === st
                            ? 'bg-slate-700 text-white border border-slate-600'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirmation Email Auto-Fill Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span>Confirmation Email</span>
                  </span>

                  <button
                    type="button"
                    disabled={sendingEmailId === (selectedEnquiry.id || selectedEnquiry._id)}
                    onClick={() =>
                      handleSendConfirmationEmail(
                        selectedEnquiry.id || selectedEnquiry._id || ''
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                    title="Send or resend confirmation email"
                  >
                    {sendingEmailId === (selectedEnquiry.id || selectedEnquiry._id) ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send / Resend Email</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  <p className="font-semibold text-slate-200 mb-1">Dear {selectedEnquiry.name},</p>
                  <p className="mb-2">Thank you for choosing us!</p>
                  <p className="text-emerald-400 font-semibold mb-2">
                    We are pleased to confirm that your appointment has been successfully booked.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] mb-2 space-y-1">
                    <p className="font-bold text-slate-400 uppercase text-[10px]">Appointment Details:</p>
                    <p>• <strong>Name:</strong> {selectedEnquiry.name}</p>
                    <p>• <strong>Appointment Date:</strong> {extractDate(selectedEnquiry)}</p>
                    <p>• <strong>Appointment Time:</strong> {extractTime(selectedEnquiry)}</p>
                  </div>
                  <p className="text-slate-400 mb-1">We kindly request you to arrive 5–10 minutes before your scheduled appointment.</p>
                  <p className="text-slate-400 mb-2">If you need to reschedule or cancel your appointment, please contact us in advance.</p>
                  <p className="font-semibold text-slate-200 mb-2">We look forward to welcoming you!</p>
                  <p className="text-purple-300 font-bold">Best Regards,<br/>Rare Aesthetics<br/><span className="text-[10px] text-slate-500 font-normal italic">Thank you for choosing us.</span></p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="hover:text-purple-300 hover:underline truncate font-mono text-[11px]"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>

                {getPhoneNumber(selectedEnquiry) ? (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <a
                      href={`tel:${getPhoneNumber(selectedEnquiry)}`}
                      className="hover:text-emerald-300 hover:underline font-mono text-xs font-bold text-emerald-300"
                    >
                      {getPhoneNumber(selectedEnquiry)}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="font-mono text-xs">No phone provided</span>
                  </div>
                )}

                {selectedEnquiry.company && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>Company: {selectedEnquiry.company}</span>
                  </div>
                )}
              </div>

              {/* Consultation / Booking Details Message */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Booking & Message Details</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(selectedEnquiry.createdAt || Date.now()).toLocaleString()}
                  </span>
                </label>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Attachment if present */}
              {selectedEnquiry.attachment && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Uploaded Document
                  </label>
                  <a
                    href={selectedEnquiry.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 text-xs text-purple-300 transition-colors"
                  >
                    <span className="truncate">{selectedEnquiry.attachmentName || 'View Document'}</span>
                    <Download className="w-4 h-4 flex-shrink-0" />
                  </a>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Internal Team Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record call logs, meeting decision, formulation next steps..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                  <span>Save Notes</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>Select a consultation from the list to view complete details, accept/decline, and record notes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};