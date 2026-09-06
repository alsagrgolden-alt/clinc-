package com.example.clinic.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.clinic.data.ClinicRepository
import com.example.clinic.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class ClinicDashboardStats(
    val totalPatients: Int = 0,
    val todayAppointments: Int = 0,
    val activeDoctors: Int = 0,
    val pendingInvoices: Int = 0,
    val totalRevenue: Double = 0.0
)

class ClinicViewModel(private val repository: ClinicRepository) : ViewModel() {

    val patients: StateFlow<List<Patient>> = repository.allPatients
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val doctors: StateFlow<List<Doctor>> = repository.allDoctors
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val appointments: StateFlow<List<Appointment>> = repository.allAppointments
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val medicalRecords: StateFlow<List<MedicalRecord>> = repository.allMedicalRecords
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val invoices: StateFlow<List<Invoice>> = repository.allInvoices
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // UI state filters
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedStatusFilter = MutableStateFlow("All")
    val selectedStatusFilter: StateFlow<String> = _selectedStatusFilter.asStateFlow()

    private val _selectedDepartmentFilter = MutableStateFlow("All")
    val selectedDepartmentFilter: StateFlow<String> = _selectedDepartmentFilter.asStateFlow()

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setStatusFilter(status: String) {
        _selectedStatusFilter.value = status
    }

    fun setDepartmentFilter(dept: String) {
        _selectedDepartmentFilter.value = dept
    }

    // Filtered Appointments
    val filteredAppointments: StateFlow<List<Appointment>> = combine(
        appointments,
        _searchQuery,
        _selectedStatusFilter,
        _selectedDepartmentFilter
    ) { appts, query, status, dept ->
        appts.filter { item ->
            val matchesQuery = query.isBlank() ||
                    item.patientName.contains(query, ignoreCase = true) ||
                    item.doctorName.contains(query, ignoreCase = true) ||
                    item.reason.contains(query, ignoreCase = true)

            val matchesStatus = status == "All" || item.status.equals(status, ignoreCase = true)
            val matchesDept = dept == "All" || item.department.equals(dept, ignoreCase = true)

            matchesQuery && matchesStatus && matchesDept
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Filtered Patients
    val filteredPatients: StateFlow<List<Patient>> = combine(
        patients,
        _searchQuery
    ) { patientList, query ->
        if (query.isBlank()) patientList
        else patientList.filter {
            it.fullName.contains(query, ignoreCase = true) ||
                    it.phone.contains(query, ignoreCase = true) ||
                    it.bloodGroup.contains(query, ignoreCase = true) ||
                    it.medicalHistory.contains(query, ignoreCase = true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Dashboard Stats
    val dashboardStats: StateFlow<ClinicDashboardStats> = combine(
        patients,
        appointments,
        doctors,
        invoices
    ) { pList, aList, dList, invList ->
        val todayCount = aList.count { it.date.equals("Today", ignoreCase = true) }
        val activeDocCount = dList.count { it.isAvailableToday }
        val pendingInvCount = invList.count { it.status.equals("Pending", ignoreCase = true) }
        val revenue = invList.filter { it.status.equals("Paid", ignoreCase = true) }.sumOf { it.totalAmount }

        ClinicDashboardStats(
            totalPatients = pList.size,
            todayAppointments = todayCount,
            activeDoctors = activeDocCount,
            pendingInvoices = pendingInvCount,
            totalRevenue = revenue
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), ClinicDashboardStats())

    // Patient Actions
    fun registerPatient(
        fullName: String,
        age: Int,
        gender: String,
        bloodGroup: String,
        phone: String,
        email: String,
        address: String,
        medicalHistory: String,
        emergencyContact: String
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val newPatient = Patient(
                fullName = fullName,
                age = age,
                gender = gender,
                bloodGroup = bloodGroup,
                phone = phone,
                email = email,
                address = address,
                medicalHistory = medicalHistory.ifBlank { "None" },
                emergencyContact = emergencyContact,
                registeredDate = dateStr
            )
            repository.addPatient(newPatient)
        }
    }

    fun deletePatient(patient: Patient) {
        viewModelScope.launch {
            repository.deletePatient(patient)
        }
    }

    // Appointment Actions
    fun bookAppointment(
        patientId: Long,
        patientName: String,
        doctorId: Long,
        doctorName: String,
        department: String,
        date: String,
        timeSlot: String,
        type: String,
        reason: String,
        notes: String
    ) {
        viewModelScope.launch {
            val appt = Appointment(
                patientId = patientId,
                patientName = patientName,
                doctorId = doctorId,
                doctorName = doctorName,
                department = department,
                date = date,
                timeSlot = timeSlot,
                type = type,
                status = "Confirmed",
                reason = reason,
                notes = notes
            )
            repository.bookAppointment(appt)
        }
    }

    fun updateAppointmentStatus(id: Long, newStatus: String) {
        viewModelScope.launch {
            repository.updateAppointmentStatus(id, newStatus)
        }
    }

    fun deleteAppointment(appointment: Appointment) {
        viewModelScope.launch {
            repository.deleteAppointment(appointment)
        }
    }

    // Medical Record Actions
    fun addMedicalRecord(
        patientId: Long,
        patientName: String,
        doctorName: String,
        diagnosis: String,
        treatmentPlan: String,
        bloodPressure: String,
        heartRate: Int,
        temperatureCelsius: Double,
        weightKg: Double
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val record = MedicalRecord(
                patientId = patientId,
                patientName = patientName,
                doctorName = doctorName,
                visitDate = dateStr,
                diagnosis = diagnosis,
                treatmentPlan = treatmentPlan,
                bloodPressure = bloodPressure,
                heartRate = heartRate,
                temperatureCelsius = temperatureCelsius,
                weightKg = weightKg
            )
            repository.addMedicalRecord(record)
        }
    }

    // Billing Actions
    fun createInvoice(
        patientId: Long,
        patientName: String,
        description: String,
        consultationFee: Double,
        treatmentFee: Double,
        status: String = "Pending"
    ) {
        viewModelScope.launch {
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
            val invoice = Invoice(
                patientId = patientId,
                patientName = patientName,
                description = description,
                consultationFee = consultationFee,
                treatmentFee = treatmentFee,
                totalAmount = consultationFee + treatmentFee,
                status = status,
                issueDate = dateStr
            )
            repository.createInvoice(invoice)
        }
    }

    fun toggleInvoiceStatus(invoice: Invoice) {
        viewModelScope.launch {
            val newStatus = if (invoice.status == "Paid") "Pending" else "Paid"
            repository.updateInvoiceStatus(invoice.id, newStatus)
        }
    }

    class Factory(private val repository: ClinicRepository) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return ClinicViewModel(repository) as T
        }
    }
}
