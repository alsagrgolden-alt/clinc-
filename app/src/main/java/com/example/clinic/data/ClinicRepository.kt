package com.example.clinic.data

import com.example.clinic.model.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch

class ClinicRepository(private val database: ClinicDatabase) {

    private val patientDao = database.patientDao()
    private val doctorDao = database.doctorDao()
    private val appointmentDao = database.appointmentDao()
    private val medicalRecordDao = database.medicalRecordDao()
    private val invoiceDao = database.invoiceDao()

    val allPatients: Flow<List<Patient>> = patientDao.getAllPatients()
    val allDoctors: Flow<List<Doctor>> = doctorDao.getAllDoctors()
    val allAppointments: Flow<List<Appointment>> = appointmentDao.getAllAppointments()
    val allMedicalRecords: Flow<List<MedicalRecord>> = medicalRecordDao.getAllRecords()
    val allInvoices: Flow<List<Invoice>> = invoiceDao.getAllInvoices()

    init {
        CoroutineScope(Dispatchers.IO).launch {
            seedInitialDataIfNeeded()
        }
    }

    private suspend fun seedInitialDataIfNeeded() {
        val doctors = doctorDao.getAllDoctors().firstOrNull()
        if (doctors.isNullOrEmpty()) {
            val sampleDoctors = listOf(
                Doctor(
                    fullName = "Dr. Sarah Jenkins",
                    specialty = "Cardiology",
                    department = "Cardiovascular Center",
                    qualification = "MD, FACC, Harvard Medical",
                    experienceYears = 14,
                    phone = "+1 (555) 234-5678",
                    email = "s.jenkins@clinic.org",
                    availableDays = "Mon, Wed, Fri",
                    consultationFee = 150.0,
                    isAvailableToday = true
                ),
                Doctor(
                    fullName = "Dr. Marcus Chen",
                    specialty = "Pediatrics",
                    department = "Children's Health",
                    qualification = "MD, FAAP, Johns Hopkins",
                    experienceYears = 10,
                    phone = "+1 (555) 345-6789",
                    email = "m.chen@clinic.org",
                    availableDays = "Mon, Tue, Thu, Sat",
                    consultationFee = 120.0,
                    isAvailableToday = true
                ),
                Doctor(
                    fullName = "Dr. Elena Rostova",
                    specialty = "Dermatology",
                    department = "Skin & Laser Clinic",
                    qualification = "MD, Stanford Medicine",
                    experienceYears = 8,
                    phone = "+1 (555) 456-7890",
                    email = "e.rostova@clinic.org",
                    availableDays = "Tue, Wed, Fri",
                    consultationFee = 140.0,
                    isAvailableToday = false
                ),
                Doctor(
                    fullName = "Dr. David Kim",
                    specialty = "Orthopedics",
                    department = "Bone & Joint Center",
                    qualification = "MD, MS Ortho, Columbia",
                    experienceYears = 16,
                    phone = "+1 (555) 567-8901",
                    email = "d.kim@clinic.org",
                    availableDays = "Mon, Wed, Thu",
                    consultationFee = 160.0,
                    isAvailableToday = true
                )
            )
            doctorDao.insertAllDoctors(sampleDoctors)

            // Seed Patients
            val p1Id = patientDao.insertPatient(
                Patient(
                    fullName = "James Wilson",
                    age = 42,
                    gender = "Male",
                    bloodGroup = "A+",
                    phone = "+1 (555) 111-2233",
                    email = "j.wilson@example.com",
                    address = "742 Evergreen Terrace, Springfield",
                    medicalHistory = "Hypertension, Mild Asthma",
                    emergencyContact = "Emily Wilson (+1 555-999-1111)",
                    registeredDate = "2026-08-15"
                )
            )
            val p2Id = patientDao.insertPatient(
                Patient(
                    fullName = "Amira Al-Mansoor",
                    age = 29,
                    gender = "Female",
                    bloodGroup = "O+",
                    phone = "+1 (555) 222-3344",
                    email = "amira.m@example.com",
                    address = "1200 Ocean Ave, Santa Monica",
                    medicalHistory = "No chronic conditions, Penicillin allergy",
                    emergencyContact = "Tariq Al-Mansoor (+1 555-888-2222)",
                    registeredDate = "2026-08-28"
                )
            )
            val p3Id = patientDao.insertPatient(
                Patient(
                    fullName = "Liam O'Connor",
                    age = 65,
                    gender = "Male",
                    bloodGroup = "B-",
                    phone = "+1 (555) 333-4455",
                    email = "liam.oc@example.com",
                    address = "45 Elm Street, Boston",
                    medicalHistory = "Type 2 Diabetes, Knee Osteoarthritis",
                    emergencyContact = "Grace O'Connor (+1 555-777-3333)",
                    registeredDate = "2026-09-01"
                )
            )

            // Seed Appointments
            appointmentDao.insertAppointment(
                Appointment(
                    patientId = p1Id,
                    patientName = "James Wilson",
                    doctorId = 1,
                    doctorName = "Dr. Sarah Jenkins",
                    department = "Cardiology",
                    date = "Today",
                    timeSlot = "10:30 AM",
                    type = "In-Person",
                    status = "Confirmed",
                    reason = "Routine cardiac checkup and BP monitoring",
                    notes = "Patient reports mild dizziness after morning runs"
                )
            )
            appointmentDao.insertAppointment(
                Appointment(
                    patientId = p2Id,
                    patientName = "Amira Al-Mansoor",
                    doctorId = 2,
                    doctorName = "Dr. Marcus Chen",
                    department = "Pediatrics",
                    date = "Today",
                    timeSlot = "02:00 PM",
                    type = "In-Person",
                    status = "Scheduled",
                    reason = "Annual wellness and allergy evaluation",
                    notes = "Review recent seasonal allergies"
                )
            )
            appointmentDao.insertAppointment(
                Appointment(
                    patientId = p3Id,
                    patientName = "Liam O'Connor",
                    doctorId = 4,
                    doctorName = "Dr. David Kim",
                    department = "Orthopedics",
                    date = "Tomorrow",
                    timeSlot = "11:15 AM",
                    type = "Follow-Up",
                    status = "Scheduled",
                    reason = "Post-physical therapy knee evaluation",
                    notes = "Bring recent X-ray films"
                )
            )

            // Seed Medical Records
            medicalRecordDao.insertRecord(
                MedicalRecord(
                    patientId = p1Id,
                    patientName = "James Wilson",
                    doctorName = "Dr. Sarah Jenkins",
                    visitDate = "2026-08-15",
                    diagnosis = "Stage 1 Essential Hypertension",
                    treatmentPlan = "Prescribed Lisinopril 10mg daily, low-sodium dietary plan",
                    bloodPressure = "138/88",
                    heartRate = 78,
                    temperatureCelsius = 36.8,
                    weightKg = 82.5
                )
            )

            // Seed Invoices
            invoiceDao.insertInvoice(
                Invoice(
                    patientId = p1Id,
                    patientName = "James Wilson",
                    description = "Cardiology Comprehensive Consultation & ECG",
                    consultationFee = 150.0,
                    treatmentFee = 50.0,
                    totalAmount = 200.0,
                    status = "Paid",
                    issueDate = "2026-08-15",
                    paymentMethod = "Credit Card"
                )
            )
            invoiceDao.insertInvoice(
                Invoice(
                    patientId = p2Id,
                    patientName = "Amira Al-Mansoor",
                    description = "Consultation & Allergy Panel Testing",
                    consultationFee = 120.0,
                    treatmentFee = 85.0,
                    totalAmount = 205.0,
                    status = "Pending",
                    issueDate = "2026-09-06",
                    paymentMethod = "Insurance"
                )
            )
        }
    }

    // Patient CRUD
    suspend fun addPatient(patient: Patient) = patientDao.insertPatient(patient)
    suspend fun updatePatient(patient: Patient) = patientDao.updatePatient(patient)
    suspend fun deletePatient(patient: Patient) = patientDao.deletePatient(patient)

    // Doctor CRUD
    suspend fun addDoctor(doctor: Doctor) = doctorDao.insertDoctor(doctor)
    suspend fun updateDoctor(doctor: Doctor) = doctorDao.updateDoctor(doctor)

    // Appointment CRUD
    suspend fun bookAppointment(appointment: Appointment) = appointmentDao.insertAppointment(appointment)
    suspend fun updateAppointmentStatus(id: Long, status: String) = appointmentDao.updateAppointmentStatus(id, status)
    suspend fun deleteAppointment(appointment: Appointment) = appointmentDao.deleteAppointment(appointment)

    // Medical Record CRUD
    suspend fun addMedicalRecord(record: MedicalRecord) = medicalRecordDao.insertRecord(record)

    // Invoice CRUD
    suspend fun createInvoice(invoice: Invoice) = invoiceDao.insertInvoice(invoice)
    suspend fun updateInvoiceStatus(id: Long, status: String) = invoiceDao.updateInvoiceStatus(id, status)
}
