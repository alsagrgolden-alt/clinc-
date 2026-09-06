import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Stethoscope,
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  FileText,
  DollarSign,
  UserPlus,
  Filter,
  Check,
  Calendar
} from "lucide-react";

interface Patient {
  id: number;
  fullName: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  emergencyContact: string;
  registeredDate: string;
}

interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  department: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  availableDays: string;
  consultationFee: number;
  isAvailableToday: boolean;
}

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
  reason: string;
}

interface MedicalRecord {
  id: number;
  patientName: string;
  doctorName: string;
  visitDate: string;
  diagnosis: string;
  treatmentPlan: string;
  bp: string;
  heartRate: number;
  temp: number;
  weight: number;
}

interface Invoice {
  id: number;
  patientName: string;
  description: string;
  totalAmount: number;
  status: "Paid" | "Pending";
  issueDate: string;
}

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 1,
    fullName: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    department: "Cardiovascular Center",
    qualification: "MD, FACC, Harvard Medical",
    experienceYears: 14,
    phone: "+1 (555) 234-5678",
    email: "s.jenkins@clinic.org",
    availableDays: "Mon, Wed, Fri",
    consultationFee: 150,
    isAvailableToday: true,
  },
  {
    id: 2,
    fullName: "Dr. Marcus Chen",
    specialty: "Pediatrics",
    department: "Children's Health",
    qualification: "MD, FAAP, Johns Hopkins",
    experienceYears: 10,
    phone: "+1 (555) 345-6789",
    email: "m.chen@clinic.org",
    availableDays: "Mon, Tue, Thu, Sat",
    consultationFee: 120,
    isAvailableToday: true,
  },
  {
    id: 3,
    fullName: "Dr. Elena Rostova",
    specialty: "Dermatology",
    department: "Skin & Laser Clinic",
    qualification: "MD, Stanford Medicine",
    experienceYears: 8,
    phone: "+1 (555) 456-7890",
    email: "e.rostova@clinic.org",
    availableDays: "Tue, Wed, Fri",
    consultationFee: 140,
    isAvailableToday: false,
  },
  {
    id: 4,
    fullName: "Dr. David Kim",
    specialty: "Orthopedics",
    department: "Bone & Joint Center",
    qualification: "MD, MS Ortho, Columbia",
    experienceYears: 16,
    phone: "+1 (555) 567-8901",
    email: "d.kim@clinic.org",
    availableDays: "Mon, Wed, Thu",
    consultationFee: 160,
    isAvailableToday: true,
  },
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    fullName: "James Wilson",
    age: 42,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+1 (555) 111-2233",
    email: "j.wilson@example.com",
    address: "742 Evergreen Terrace, Springfield",
    medicalHistory: "Hypertension, Mild Asthma",
    emergencyContact: "Emily Wilson (+1 555-999-1111)",
    registeredDate: "2026-08-15",
  },
  {
    id: 2,
    fullName: "Amira Al-Mansoor",
    age: 29,
    gender: "Female",
    bloodGroup: "O+",
    phone: "+1 (555) 222-3344",
    email: "amira.m@example.com",
    address: "1200 Ocean Ave, Santa Monica",
    medicalHistory: "Penicillin allergy, No chronic conditions",
    emergencyContact: "Tariq Al-Mansoor (+1 555-888-2222)",
    registeredDate: "2026-08-28",
  },
  {
    id: 3,
    fullName: "Liam O'Connor",
    age: 65,
    gender: "Male",
    bloodGroup: "B-",
    phone: "+1 (555) 333-4455",
    email: "liam.oc@example.com",
    address: "45 Elm Street, Boston",
    medicalHistory: "Type 2 Diabetes, Knee Osteoarthritis",
    emergencyContact: "Grace O'Connor (+1 555-777-3333)",
    registeredDate: "2026-09-01",
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    patientName: "James Wilson",
    doctorId: 1,
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology",
    date: "Today",
    timeSlot: "10:30 AM",
    type: "In-Person",
    status: "Confirmed",
    reason: "Routine cardiac checkup and BP monitoring",
  },
  {
    id: 2,
    patientId: 2,
    patientName: "Amira Al-Mansoor",
    doctorId: 2,
    doctorName: "Dr. Marcus Chen",
    department: "Pediatrics",
    date: "Today",
    timeSlot: "02:00 PM",
    type: "In-Person",
    status: "Scheduled",
    reason: "Annual wellness and seasonal allergy evaluation",
  },
  {
    id: 3,
    patientId: 3,
    patientName: "Liam O'Connor",
    doctorId: 4,
    doctorName: "Dr. David Kim",
    department: "Orthopedics",
    date: "Tomorrow",
    timeSlot: "11:15 AM",
    type: "Follow-Up",
    status: "Scheduled",
    reason: "Post-physical therapy knee evaluation",
  },
];

const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 1,
    patientName: "James Wilson",
    doctorName: "Dr. Sarah Jenkins",
    visitDate: "2026-08-15",
    diagnosis: "Stage 1 Essential Hypertension",
    treatmentPlan: "Prescribed Lisinopril 10mg daily, low-sodium dietary plan",
    bp: "138/88",
    heartRate: 78,
    temp: 36.8,
    weight: 82.5,
  },
  {
    id: 2,
    patientName: "Amira Al-Mansoor",
    doctorName: "Dr. Marcus Chen",
    visitDate: "2026-08-28",
    diagnosis: "Acute Allergic Rhinitis",
    treatmentPlan: "Cetirizine 10mg as needed, nasal saline flush",
    bp: "115/75",
    heartRate: 72,
    temp: 36.5,
    weight: 58.0,
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 1,
    patientName: "James Wilson",
    description: "Cardiology Comprehensive Consultation & ECG",
    totalAmount: 200,
    status: "Paid",
    issueDate: "2026-08-15",
  },
  {
    id: 2,
    patientName: "Amira Al-Mansoor",
    description: "Consultation & Allergy Panel Testing",
    totalAmount: 205,
    status: "Pending",
    issueDate: "2026-09-06",
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "appointments" | "doctors" | "billing">("dashboard");
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [records] = useState<MedicalRecord[]>(INITIAL_RECORDS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [preselectedPatient, setPreselectedPatient] = useState<Patient | null>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);

  // New Patient Form state
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientGender, setNewPatientGender] = useState("Male");
  const [newPatientBlood, setNewPatientBlood] = useState("O+");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");
  const [newPatientAddress, setNewPatientAddress] = useState("");
  const [newPatientHistory, setNewPatientHistory] = useState("");
  const [newPatientEmergency, setNewPatientEmergency] = useState("");

  // New Appointment Form state
  const [bookPatientName, setBookPatientName] = useState("");
  const [bookDoctorId, setBookDoctorId] = useState(1);
  const [bookDate, setBookDate] = useState("Today");
  const [bookTime, setBookTime] = useState("10:00 AM");
  const [bookType, setBookType] = useState("In-Person");
  const [bookReason, setBookReason] = useState("");

  // Metrics
  const totalPatientsCount = patients.length;
  const todayVisitsCount = appointments.filter((a) => a.date === "Today").length;
  const activeDoctorsCount = doctors.filter((d) => d.isAvailableToday).length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === "Pending").length;
  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.totalAmount, 0);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      searchQuery === "" ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Patients
  const filteredPatients = patients.filter((p) => {
    return (
      searchQuery === "" ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName) return;

    const newP: Patient = {
      id: Date.now(),
      fullName: newPatientName,
      age: parseInt(newPatientAge) || 30,
      gender: newPatientGender,
      bloodGroup: newPatientBlood,
      phone: newPatientPhone || "+1 (555) 000-0000",
      email: newPatientEmail || "patient@example.com",
      address: newPatientAddress || "City Center",
      medicalHistory: newPatientHistory || "None reported",
      emergencyContact: newPatientEmergency || "Next of kin",
      registeredDate: "2026-09-06",
    };

    setPatients([newP, ...patients]);
    setShowAddPatientModal(false);
    // Reset form
    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientPhone("");
    setNewPatientEmail("");
    setNewPatientAddress("");
    setNewPatientHistory("");
    setNewPatientEmergency("");
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientName) return;

    const doc = doctors.find((d) => d.id === Number(bookDoctorId)) || doctors[0];
    const newAppt: Appointment = {
      id: Date.now(),
      patientId: preselectedPatient ? preselectedPatient.id : Date.now(),
      patientName: bookPatientName,
      doctorId: doc.id,
      doctorName: doc.fullName,
      department: doc.department,
      date: bookDate,
      timeSlot: bookTime,
      type: bookType,
      status: "Confirmed",
      reason: bookReason || "General consultation",
    };

    setAppointments([newAppt, ...appointments]);
    setShowBookModal(false);
    setBookPatientName("");
    setBookReason("");
    setPreselectedPatient(null);
    setPreselectedDoctor(null);
  };

  const updateApptStatus = (id: number, status: Appointment["status"]) => {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const toggleInvoice = (id: number) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id
          ? { ...inv, status: inv.status === "Paid" ? "Pending" : "Paid" }
          : inv
      )
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-6 h-6 fill-current text-teal-100" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 tracking-tight">Central Clinic</h1>
            <p className="text-xs text-slate-500 font-medium">Healthcare Operations</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <button
            onClick={() => { setActiveTab("dashboard"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setActiveTab("patients"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "patients"
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Patients</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {patients.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("appointments"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "appointments"
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Appointments</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {appointments.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("doctors"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "doctors"
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>Specialists</span>
            <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {doctors.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("billing"); setSearchQuery(""); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "billing"
                ? "bg-teal-50 text-teal-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Billing & Records</span>
          </button>
        </nav>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setShowBookModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Book Visit</span>
          </button>
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patient</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-lg md:text-xl text-slate-800 capitalize">
              {activeTab === "dashboard" && "Clinic Overview"}
              {activeTab === "patients" && "Patient Directory"}
              {activeTab === "appointments" && "Appointment Schedule"}
              {activeTab === "doctors" && "Medical Staff Directory"}
              {activeTab === "billing" && "Health Records & Billing"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBookModal(true)}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Book Visit</span>
            </button>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Patient</span>
            </button>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Metric Cards Banner */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Patients</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalPatientsCount}</p>
                    <p className="text-xs text-teal-600 mt-1 font-medium">Registered records</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Visits</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{todayVisitsCount}</p>
                    <p className="text-xs text-cyan-600 mt-1 font-medium">Active consultations</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">On Duty Doctors</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{activeDoctorsCount}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">Specialists available</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Collected Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue}</p>
                    <p className="text-xs text-amber-600 mt-1 font-medium">{pendingInvoicesCount} invoices pending</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Upcoming Visits & Specialists */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Today's Appointments */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Upcoming Appointments</h3>
                      <p className="text-xs text-slate-500">Consultations scheduled today and upcoming</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appointments.slice(0, 4).map((appt) => (
                      <div
                        key={appt.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 transition-colors bg-slate-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                            {appt.patientName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{appt.patientName}</p>
                            <p className="text-xs text-slate-500">
                              {appt.doctorName} • <span className="text-teal-600 font-medium">{appt.department}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold text-slate-800">{appt.timeSlot}</p>
                            <p className="text-[11px] text-slate-500">{appt.date} • {appt.type}</p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              appt.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : appt.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : appt.status === "Cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Active Specialists */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Clinic Specialists</h3>
                      <p className="text-xs text-slate-500">Active medical staff</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("doctors")}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      All Doctors
                    </button>
                  </div>

                  <div className="space-y-3 flex-1">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{doc.fullName}</p>
                          <p className="text-xs text-teal-600 font-medium">{doc.specialty}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{doc.availableDays}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                              doc.isAvailableToday
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {doc.isAvailableToday ? "Available" : "Off Duty"}
                          </span>
                          <p className="text-xs font-bold text-slate-700 mt-1">${doc.consultationFee}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PATIENTS TAB */}
          {activeTab === "patients" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patients by name, phone, or blood group..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="text-sm text-slate-500 font-medium whitespace-nowrap self-center">
                  Total Patients: <span className="font-bold text-slate-800">{filteredPatients.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 font-bold text-base flex items-center justify-center border border-teal-100">
                            {patient.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{patient.fullName}</h4>
                            <p className="text-xs text-slate-500">
                              {patient.gender}, {patient.age} yrs • <span className="font-semibold text-rose-600">Blood: {patient.bloodGroup}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 mt-2">
                          <p className="font-medium text-[11px] text-slate-500">Medical History</p>
                          <p className="mt-0.5 line-clamp-2">{patient.medicalHistory}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setPreselectedPatient(patient);
                          setBookPatientName(patient.fullName);
                          setShowBookModal(true);
                        }}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Visit</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === "appointments" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search appointments by patient, doctor, or symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {["All", "Scheduled", "Confirmed", "Completed", "Cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                        statusFilter === status
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{appt.patientName}</h4>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              appt.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : appt.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : appt.status === "Cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Attending Physician: <span className="font-semibold text-slate-800">{appt.doctorName}</span> •{" "}
                          <span className="text-teal-600 font-medium">{appt.department}</span>
                        </p>
                        {appt.reason && (
                          <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-2.5 py-1 rounded-md inline-block">
                            Reason: {appt.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <p className="text-sm font-bold text-slate-900">{appt.timeSlot}</p>
                        <p className="text-xs text-slate-500">{appt.date} • {appt.type}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {appt.status !== "Completed" && (
                          <button
                            onClick={() => updateApptStatus(appt.id, "Completed")}
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                            title="Mark as Completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {appt.status !== "Cancelled" && (
                          <button
                            onClick={() => updateApptStatus(appt.id, "Cancelled")}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors"
                            title="Cancel Appointment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCTORS TAB */}
          {activeTab === "doctors" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                            <Stethoscope className="w-7 h-7" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{doc.fullName}</h4>
                            <p className="text-sm font-semibold text-teal-600">{doc.specialty}</p>
                            <p className="text-xs text-slate-500">{doc.department}</p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            doc.isAvailableToday
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {doc.isAvailableToday ? "Available Today" : "Off Duty"}
                        </span>
                      </div>

                      <div className="mt-5 space-y-2 text-xs text-slate-600">
                        <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                          <p className="font-semibold text-slate-700">Credentials & Background</p>
                          <p>{doc.qualification} • {doc.experienceYears}+ years experience</p>
                        </div>
                        <p><span className="font-medium text-slate-500">Consultation Days:</span> {doc.availableDays}</p>
                        <p><span className="font-medium text-slate-500">Phone:</span> {doc.phone}</p>
                        <p><span className="font-medium text-slate-500">Email:</span> {doc.email}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Consultation Fee</p>
                        <p className="text-lg font-bold text-slate-900">${doc.consultationFee}</p>
                      </div>

                      <button
                        onClick={() => {
                          setBookDoctorId(doc.id);
                          setPreselectedDoctor(doc);
                          setShowBookModal(true);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BILLING & MEDICAL RECORDS TAB */}
          {activeTab === "billing" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Medical Records Section */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Patient Medical Records & Vitals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {records.map((rec) => (
                    <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{rec.patientName}</h4>
                          <p className="text-xs text-slate-500">{rec.doctorName} • {rec.visitDate}</p>
                        </div>
                        <span className="text-xs font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md">
                          Verified Record
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700 mb-4">
                        <p><span className="font-semibold text-slate-900">Diagnosis:</span> {rec.diagnosis}</p>
                        <p><span className="font-semibold text-slate-900">Treatment Plan:</span> {rec.treatmentPlan}</p>
                      </div>

                      {/* Vitals metrics */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                          <span className="font-bold text-slate-800">{rec.bp}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                          <span className="font-bold text-slate-800">{rec.heartRate} bpm</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Temperature</span>
                          <span className="font-bold text-slate-800">{rec.temp}°C</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Weight</span>
                          <span className="font-bold text-slate-800">{rec.weight} kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices Section */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Invoices & Billing History</h3>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                        <tr>
                          <th className="px-6 py-3">Patient</th>
                          <th className="px-6 py-3">Description</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-900">{inv.patientName}</td>
                            <td className="px-6 py-4 text-xs text-slate-600">{inv.description}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{inv.issueDate}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">${inv.totalAmount}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  inv.status === "Paid"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => toggleInvoice(inv.id)}
                                className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {inv.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 ${activeTab === "dashboard" ? "text-teal-600" : "text-slate-400"}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("patients")}
          className={`flex flex-col items-center gap-1 ${activeTab === "patients" ? "text-teal-600" : "text-slate-400"}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Patients</span>
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex flex-col items-center gap-1 ${activeTab === "appointments" ? "text-teal-600" : "text-slate-400"}`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Visits</span>
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`flex flex-col items-center gap-1 ${activeTab === "doctors" ? "text-teal-600" : "text-slate-400"}`}
        >
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Doctors</span>
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex flex-col items-center gap-1 ${activeTab === "billing" ? "text-teal-600" : "text-slate-400"}`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Billing</span>
        </button>
      </div>

      {/* REGISTER PATIENT MODAL */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Register New Patient</h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={newPatientBlood}
                    onChange={(e) => setNewPatientBlood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="patient@mail.com"
                    value={newPatientEmail}
                    onChange={(e) => setNewPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Street and City"
                  value={newPatientAddress}
                  onChange={(e) => setNewPatientAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Known Conditions / History</label>
                <textarea
                  rows={2}
                  placeholder="Allergies, chronic conditions, regular medications..."
                  value={newPatientHistory}
                  onChange={(e) => setNewPatientHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  placeholder="Name & Contact number"
                  value={newPatientEmergency}
                  onChange={(e) => setNewPatientEmergency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Book Patient Appointment</h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Search or enter patient name"
                  value={bookPatientName}
                  onChange={(e) => setBookPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Specialist *</label>
                <select
                  value={bookDoctorId}
                  onChange={(e) => setBookDoctorId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} — {d.specialty} (${d.consultationFee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <select
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Next Monday</option>
                    <option>Next Wednesday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>01:00 PM</option>
                    <option>02:30 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Type</label>
                <select
                  value={bookType}
                  onChange={(e) => setBookType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>In-Person</option>
                  <option>Telehealth</option>
                  <option>Follow-Up</option>
                  <option>Urgent / Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
                <textarea
                  rows={2}
                  placeholder="Symptoms, routine follow-up, test review..."
                  value={bookReason}
                  onChange={(e) => setBookReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
