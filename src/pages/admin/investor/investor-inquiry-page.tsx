import { useState, useEffect, useRef } from "react";
import { useGetInvestorAllDataQuery, useGetInvestorsQuery } from "@/services/investorApi";
import type { Investor } from "@/services/investorApi";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  Building,
  CreditCard,
  FileText,
  Users,
  AlertCircle,
  Building2,
  Coins,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";

export default function InvestorInquiryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [queryId, setQueryId] = useState<string | null>(null);

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch investor suggestions as the user types
  const { data: suggestionsResponse, isFetching: isSearchingSuggestions } = useGetInvestorsQuery(
    { search: debouncedSearch },
    { skip: debouncedSearch.trim().length < 2 }
  );

  const { data: allDataResponse, isLoading, error } = useGetInvestorAllDataQuery(
    queryId!,
    { skip: !queryId }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectInvestor = (item: Investor) => {
    setSearchTerm(item.applicant_full_name || item.investor_name);
    setQueryId(String(item.id));
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTerm = searchTerm.trim();
    if (!cleanTerm) {
      toast.error("Please enter a name, file number, or ID.");
      return;
    }
    // If it's a pure number, search directly by ID
    if (/^\d+$/.test(cleanTerm)) {
      setQueryId(cleanTerm);
      setShowSuggestions(false);
    } else {
      // Fallback: Use the first suggestion result if available
      if (suggestionsResponse?.data && suggestionsResponse.data.length > 0) {
        handleSelectInvestor(suggestionsResponse.data[0]);
      } else {
        toast.error("No matching investor found. Please select a suggestion.");
      }
    }
  };

  const investor = allDataResponse?.data?.personal;
  const summary = allDataResponse?.data?.summary;
  const familyMembers = allDataResponse?.data?.family_members || [];
  const installments = allDataResponse?.data?.installments || [];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Investor Inquiry</h1>
        <p className="text-gray-600">Retrieve a complete snapshot of an investor's personal profile, nominee details, family tree, and payment history.</p>
      </div>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-xl flex gap-3 items-end">
        <div className="flex-1 space-y-1.5 relative" ref={suggestionsRef}>
          <Label htmlFor="searchTerm" className="font-bold text-gray-700">Search Investor by Name, File Number, or ID</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type investor name, file number, or ID..."
              className="pl-10 h-11"
              autoComplete="off"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && searchTerm.trim().length >= 2 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-100">
              {isSearchingSuggestions ? (
                <div className="p-3 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...
                </div>
              ) : suggestionsResponse?.data && suggestionsResponse.data.length > 0 ? (
                suggestionsResponse.data.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    onClick={() => handleSelectInvestor(item)}
                  >
                    {item.applicant_image ? (
                      <img
                        src={item.applicant_image}
                        alt={item.applicant_full_name || item.investor_name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {item.applicant_full_name || item.investor_name}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                        <span>File: {item.file_number || "-"}</span>
                        <span>•</span>
                        <span>ID: {item.id}</span>
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-500">
                  No matching investors found
                </div>
              )}
            </div>
          )}
        </div>
        <Button
          type="submit"
          className="bg-[#0B1B3D] hover:bg-[#0B1B3D]/95 text-white h-11 px-6 font-semibold shrink-0"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Search
        </Button>
      </form>

      {/* Loading / Error / Empty States */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#0B1B3D]" />
          <p className="text-sm text-gray-500 font-medium">Retrieving investor all data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex gap-3 text-red-700 max-w-xl">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Investor Not Found</h3>
            <p className="text-xs text-red-600 mt-1">
              Could not retrieve data for Investor ID: <strong>{queryId}</strong>. Please check the ID and try again.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && allDataResponse && investor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Personal & Profile Details (2 Cols on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="bg-[#0B1B3D]/5 p-2 rounded-lg text-primary">
                  <User className="w-5 h-5 text-[#0B1B3D]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Personal Profile</h2>
                  <p className="text-xs text-gray-500">Applicant ID: #{investor.id} | File Number: {investor.file_number}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Photo Preview */}
                {investor.applicant_image ? (
                  <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <img src={investor.applicant_image} alt="Applicant Photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 shrink-0 text-center p-2">
                    <User className="w-8 h-8 mb-1 text-gray-300" />
                    <span className="text-[10px]">No Photo</span>
                  </div>
                )}

                {/* Profile attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 flex-1">
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Applicant Full Name</Label>
                    <p className="text-sm font-bold text-gray-900">{investor.applicant_full_name || investor.investor_name}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Fathers Name</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.fathers_name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Mothers Name</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.mothers_name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Spouses Name</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.spouses_name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">NID / PP / BC Number</Label>
                    <p className="text-sm font-semibold text-gray-800">{investor.nid_pp_bc_number || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">TIN Number</Label>
                    <p className="text-sm font-medium text-gray-800">{investor.tin_number || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Date of Birth</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.date_of_birth || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Nationality</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.nationality || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Extended Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t pt-4 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Religion</span>
                  <span className="text-sm font-medium text-gray-800">{investor.religion || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Mobile Number</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {investor.mobile_number}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Email Address</span>
                  <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {investor.email || investor.email_address}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Profession</span>
                  <span className="text-sm font-medium text-gray-800">{investor.profession || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Marital Status</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{investor.marital_status || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Residency Status</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{investor.residency_status || "-"}</span>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Present Address</span>
                  <span className="text-sm font-medium text-gray-700 whitespace-pre-line mt-1 block">{investor.present_address || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Permanent Address</span>
                  <span className="text-sm font-medium text-gray-700 whitespace-pre-line mt-1 block">{investor.permanent_address || "-"}</span>
                </div>
              </div>
            </div>

            {/* Nominee Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="bg-[#0B1B3D]/5 p-2 rounded-lg text-primary">
                  <Users className="w-5 h-5 text-[#0B1B3D]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Nominee Information</h2>
                  <p className="text-xs text-gray-500">Designated heir/receiver of nominee allocation</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Photo Preview */}
                {investor.nominee_image ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    <img src={investor.nominee_image} alt="Nominee Photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 shrink-0">
                    <User className="w-6 h-6 mb-1 text-gray-300" />
                    <span className="text-[10px]">No Photo</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 flex-1">
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Nominee Name</Label>
                    <p className="text-sm font-bold text-gray-900">{investor.nominee_name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Relation</Label>
                    <p className="text-sm font-medium text-gray-700 capitalize">{investor.nominee_relation || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Nominee Mobile</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.nominee_mobile_number || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-400 uppercase">Nominee NID / PP</Label>
                    <p className="text-sm font-medium text-gray-700">{investor.nominee_nid_pp_bc_number || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Nominee Present Address</span>
                  <span className="text-sm font-medium text-gray-700 whitespace-pre-line mt-1 block">{investor.nominee_present_address || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Nominee Permanent Address</span>
                  <span className="text-sm font-medium text-gray-700 whitespace-pre-line mt-1 block">{investor.nominee_permanent_address || "-"}</span>
                </div>
              </div>
            </div>

            {/* Share Allocation details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="bg-[#0B1B3D]/5 p-2 rounded-lg text-primary">
                  <Coins className="w-5 h-5 text-[#0B1B3D]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Share Mappings & Project Details</h2>
                  <p className="text-xs text-gray-500">Allocated hospital shares and discount mappings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Project Name</span>
                  <span className="text-sm font-medium text-gray-800">{investor.project_name || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Category of Share</span>
                  <span className="text-sm font-semibold text-primary">{investor.category_of_share || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Payment Mode</span>
                  <span className="text-sm font-medium text-gray-800 capitalize">{investor.mode_of_payment || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Agreed Price</span>
                  <span className="text-sm font-bold text-green-700">${Number(investor.agreed_price).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Installment Start From</span>
                  <span className="text-sm font-medium text-gray-800">{investor.installment_start_from || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Installment End To</span>
                  <span className="text-sm font-medium text-gray-800">{investor.installment_start_to || "-"}</span>
                </div>
              </div>

              {/* References */}
              <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Primary Reference A</span>
                  <span className="text-sm font-medium text-gray-800">{investor.reference_name_a || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block uppercase">Secondary Reference B</span>
                  <span className="text-sm font-medium text-gray-800">{investor.reference_name_b || "-"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Financial Overview & Relations (1 Col) */}
          <div className="space-y-8">
            
            {/* Premium Financial Summary Card */}
            {summary && (
              <div className="bg-gradient-to-br from-[#0B1B3D] to-[#1e3465] text-white rounded-3xl p-6 shadow-md relative overflow-hidden space-y-6">
                {/* Decorative background circles */}
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 translate-y-8 pointer-events-none" />
                <div className="absolute left-1/3 top-10 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />

                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <span className="text-xs text-white/70 uppercase tracking-widest font-semibold">Payment Summary</span>
                  <DollarSign className="w-5 h-5 text-white/55" />
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block">Total Share Price</span>
                    <span className="text-3xl font-black">${summary.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] text-white/60 uppercase block">Paid Amount</span>
                      <span className="text-lg font-bold text-green-400">${summary.paid_amount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/60 uppercase block">Due Amount</span>
                      <span className="text-lg font-bold text-amber-300">${summary.due_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-white/60 uppercase block">Booking Money</span>
                      <span className="text-sm font-semibold">${summary.booking_money.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/60 uppercase block">Down Payment</span>
                      <span className="text-sm font-semibold">${summary.down_payment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-white/60 uppercase block">Monthly Installment Rate</span>
                    <span className="text-md font-bold text-sky-300">${summary.installment_per_month.toLocaleString()} / month</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs text-white/60">
                    <span>Shares Purchased: <strong>{summary.number_of_hss} HSS</strong></span>
                    <span>HSS Rate: <strong>${summary.price_per_hss.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Family Members Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0B1B3D]" />
                Family Mappings
              </h3>
              
              {familyMembers.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No family members registered.</p>
              ) : (
                <div className="space-y-3">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex justify-between items-start text-xs border-b border-gray-50 pb-2.5 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{member.relationship}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-1 py-0.2 rounded text-[9px] font-semibold tracking-wide uppercase ${
                          member.is_alive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {member.is_alive ? "Alive" : "Deceased"}
                        </span>
                        {member.mobile_number && <p className="text-[10px] text-slate-500 mt-0.5">{member.mobile_number}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Installment Log Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#0B1B3D]" />
                Installments Records
              </h3>

              {installments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No installment payments recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {installments.map((inst, index) => (
                    <div key={index} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-slate-800">Installment #{index + 1}</p>
                        <p className="text-[10px] text-slate-400">{inst.due_date || inst.payment_date || "-"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0B1B3D]">${Number(inst.amount).toLocaleString()}</p>
                        <span className={`inline-block text-[9px] uppercase font-bold ${
                          inst.status === "paid" ? "text-green-600" : "text-amber-500"
                        }`}>
                          {inst.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Welcome / Empty Search screen */}
      {!isLoading && !error && !allDataResponse && (
        <div className="border-2 border-dashed border-slate-100 rounded-3xl p-16 flex flex-col items-center justify-center text-center text-slate-400 bg-white shadow-sm">
          <Building2 className="w-16 h-16 mb-4 text-[#0B1B3D]/10" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Search Investor Records</h3>
          <p className="text-sm text-slate-500 max-w-sm">Enter an Investor ID in the search box above to load detailed personal profiling, nominees, family tree details, and installment payments logs.</p>
        </div>
      )}
    </div>
  );
}
