package com.example.clinic.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class AppointmentStatus(val displayName: String) {
    SCHEDULED("Scheduled"),
    CONFIRMED("Confirmed"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled")
}

enum class AppointmentType(val displayName: String) {
    IN_PERSON("In-Person"),
    TELEHEALTH("Telehealth"),
    FOLLOW_UP("Follow-Up"),
    EMERGENCY("Emergency")
}

enum class PaymentStatus(val displayName: String) {
    PAID("Paid"),
    PENDING("Pending"),
    OVERDUE("Overdue")
}

@Entity(tableName = "patients")
data class Patient(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val fullName: String,
    val age: Int,
    val gender: String,
    val bloodGroup: String,
    val phone: String,
    val email: String,
    val address: String,
    val medicalHistory: String = "None",
    val emergencyContact: String = "",
    val registeredDate: String
)

@Entity(tableName = "doctors")
data class Doctor(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val fullName: String,
    val specialty: String,
    val department: String,
    val qualification: String,
    val experienceYears: Int,
    val phone: String,
    val email: String,
    val availableDays: String,
    val consultationFee: Double,
    val isAvailableToday: Boolean = true
)

@Entity(tableName = "appointments")
data class Appointment(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val patientId: Long,
    val patientName: String,
    val doctorId: Long,
    val doctorName: String,
    val department: String,
    val date: String,
    val timeSlot: String,
    val type: String,
    val status: String,
    val reason: String = "",
    val notes: String = ""
)

@Entity(tableName = "medical_records")
data class MedicalRecord(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val patientId: Long,
    val patientName: String,
    val doctorName: String,
    val visitDate: String,
    val diagnosis: String,
    val treatmentPlan: String,
    val bloodPressure: String = "120/80",
    val heartRate: Int = 72,
    val temperatureCelsius: Double = 36.6,
    val weightKg: Double = 70.0
)

@Entity(tableName = "invoices")
data class Invoice(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val patientId: Long,
    val patientName: String,
    val description: String,
    val consultationFee: Double,
    val treatmentFee: Double,
    val totalAmount: Double,
    val status: String,
    val issueDate: String,
    val paymentMethod: String = "Card"
)
