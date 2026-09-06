package com.example.clinic.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import com.example.clinic.model.Doctor
import com.example.clinic.model.Patient

@Composable
fun RegisterPatientDialog(
    onDismiss: () -> Unit,
    onConfirm: (
        name: String,
        age: Int,
        gender: String,
        bloodGroup: String,
        phone: String,
        email: String,
        address: String,
        medicalHistory: String,
        emergencyContact: String
    ) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var ageText by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("Male") }
    var bloodGroup by remember { mutableStateOf("O+") }
    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var history by remember { mutableStateOf("") }
    var emergency by remember { mutableStateOf("") }

    val bloodGroups = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    val genders = listOf("Male", "Female", "Other")

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "Register New Patient",
                    style = MaterialTheme.typography.titleLarge
                )
                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name *") },
                    modifier = Modifier.fillMaxWidth().testTag("input_patient_name"),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))

                Row(modifier = Modifier.fillMaxWidth()) {
                    OutlinedTextField(
                        value = ageText,
                        onValueChange = { ageText = it },
                        label = { Text("Age *") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f).testTag("input_patient_age"),
                        singleLine = true
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Gender", style = MaterialTheme.typography.labelMedium)
                        Row {
                            genders.take(2).forEach { g ->
                                FilterChip(
                                    selected = gender == g,
                                    onClick = { gender = g },
                                    label = { Text(g) },
                                    modifier = Modifier.padding(end = 4.dp)
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                Text("Blood Group", style = MaterialTheme.typography.labelMedium)
                Row(modifier = Modifier.fillMaxWidth()) {
                    bloodGroups.take(4).forEach { bg ->
                        FilterChip(
                            selected = bloodGroup == bg,
                            onClick = { bloodGroup = bg },
                            label = { Text(bg) },
                            modifier = Modifier.padding(end = 4.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone Number *") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier.fillMaxWidth().testTag("input_patient_phone"),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier.fillMaxWidth().testTag("input_patient_email"),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = address,
                    onValueChange = { address = it },
                    label = { Text("Residential Address") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = history,
                    onValueChange = { history = it },
                    label = { Text("Known Allergies / Medical History") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = emergency,
                    onValueChange = { emergency = it },
                    label = { Text("Emergency Contact (Name & Phone)") },
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            val age = ageText.toIntOrNull() ?: 30
                            if (name.isNotBlank()) {
                                onConfirm(
                                    name, age, gender, bloodGroup,
                                    phone, email, address, history, emergency
                                )
                                onDismiss()
                            }
                        },
                        modifier = Modifier.testTag("btn_submit_patient"),
                        enabled = name.isNotBlank() && ageText.isNotBlank()
                    ) {
                        Text("Save Patient")
                    }
                }
            }
        }
    }
}

@Composable
fun BookAppointmentDialog(
    doctors: List<Doctor>,
    initialPatient: Patient? = null,
    initialDoctor: Doctor? = null,
    onDismiss: () -> Unit,
    onConfirm: (
        patientName: String,
        doctor: Doctor,
        date: String,
        timeSlot: String,
        type: String,
        reason: String
    ) -> Unit
) {
    var patientName by remember { mutableStateOf(initialPatient?.fullName ?: "") }
    var selectedDoctor by remember { mutableStateOf(initialDoctor ?: doctors.firstOrNull()) }
    var selectedDate by remember { mutableStateOf("Today") }
    var selectedTimeSlot by remember { mutableStateOf("10:00 AM") }
    var selectedType by remember { mutableStateOf("In-Person") }
    var reason by remember { mutableStateOf("") }

    val dates = listOf("Today", "Tomorrow", "Next Monday")
    val timeSlots = listOf("09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM")
    val types = listOf("In-Person", "Telehealth", "Follow-Up")

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                Text(
                    text = "Book Appointment",
                    style = MaterialTheme.typography.titleLarge
                )
                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    value = patientName,
                    onValueChange = { patientName = it },
                    label = { Text("Patient Name *") },
                    modifier = Modifier.fillMaxWidth().testTag("input_appt_patient_name"),
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(12.dp))

                Text("Select Doctor", style = MaterialTheme.typography.labelMedium)
                doctors.forEach { doc ->
                    FilterChip(
                        selected = selectedDoctor?.id == doc.id,
                        onClick = { selectedDoctor = doc },
                        label = { Text("${doc.fullName} (${doc.specialty})") },
                        modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp)
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))

                Text("Day", style = MaterialTheme.typography.labelMedium)
                Row(modifier = Modifier.fillMaxWidth()) {
                    dates.forEach { d ->
                        FilterChip(
                            selected = selectedDate == d,
                            onClick = { selectedDate = d },
                            label = { Text(d) },
                            modifier = Modifier.padding(end = 6.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                Text("Time Slot", style = MaterialTheme.typography.labelMedium)
                Row(modifier = Modifier.fillMaxWidth()) {
                    timeSlots.take(3).forEach { ts ->
                        FilterChip(
                            selected = selectedTimeSlot == ts,
                            onClick = { selectedTimeSlot = ts },
                            label = { Text(ts) },
                            modifier = Modifier.padding(end = 4.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                Text("Type", style = MaterialTheme.typography.labelMedium)
                Row(modifier = Modifier.fillMaxWidth()) {
                    types.forEach { t ->
                        FilterChip(
                            selected = selectedType == t,
                            onClick = { selectedType = t },
                            label = { Text(t) },
                            modifier = Modifier.padding(end = 6.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = reason,
                    onValueChange = { reason = it },
                    label = { Text("Reason for visit / symptoms") },
                    modifier = Modifier.fillMaxWidth().testTag("input_appt_reason")
                )

                Spacer(modifier = Modifier.height(20.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Cancel")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            selectedDoctor?.let { doc ->
                                if (patientName.isNotBlank()) {
                                    onConfirm(
                                        patientName, doc, selectedDate,
                                        selectedTimeSlot, selectedType, reason
                                    )
                                    onDismiss()
                                }
                            }
                        },
                        modifier = Modifier.testTag("btn_submit_appointment"),
                        enabled = patientName.isNotBlank() && selectedDoctor != null
                    ) {
                        Text("Confirm Booking")
                    }
                }
            }
        }
    }
}
