package com.example.clinic

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import com.example.clinic.model.Doctor
import com.example.clinic.model.Patient
import com.example.clinic.ui.components.BookAppointmentDialog
import com.example.clinic.ui.components.RegisterPatientDialog
import com.example.clinic.ui.screens.*
import com.example.clinic.ui.theme.ClinicTheme
import com.example.clinic.viewmodel.ClinicViewModel

enum class ClinicTab(val title: String, val selectedIcon: ImageVector, val unselectedIcon: ImageVector) {
    DASHBOARD("Dashboard", Icons.Filled.Dashboard, Icons.Outlined.Dashboard),
    PATIENTS("Patients", Icons.Filled.People, Icons.Outlined.People),
    APPOINTMENTS("Visits", Icons.Filled.Event, Icons.Outlined.Event),
    DOCTORS("Doctors", Icons.Filled.MedicalServices, Icons.Outlined.MedicalServices),
    BILLING("Records", Icons.Filled.ReceiptLong, Icons.Outlined.ReceiptLong)
}

class MainActivity : ComponentActivity() {

    private val viewModel: ClinicViewModel by viewModels {
        val app = application as ClinicApplication
        ClinicViewModel.Factory(app.repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            ClinicTheme {
                ClinicApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClinicApp(viewModel: ClinicViewModel) {
    var currentTab by remember { mutableStateOf(ClinicTab.DASHBOARD) }

    var showRegisterPatientDialog by remember { mutableStateOf(false) }
    var showBookAppointmentDialog by remember { mutableStateOf(false) }
    var selectedPatientForBooking by remember { mutableStateOf<Patient?>(null) }
    var selectedDoctorForBooking by remember { mutableStateOf<Doctor?>(null) }

    val doctors by viewModel.doctors.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row {
                        Icon(
                            imageVector = Icons.Default.LocalHospital,
                            contentDescription = "Clinic Logo",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(end = 8.dp)
                        )
                        Text(
                            text = "Central Clinic",
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    IconButton(
                        onClick = { showRegisterPatientDialog = true },
                        modifier = Modifier.testTag("topbar_add_patient")
                    ) {
                        Icon(Icons.Default.PersonAdd, contentDescription = "Add Patient")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = NavigationBarDefaults.Elevation
            ) {
                ClinicTab.values().forEach { tab ->
                    val selected = currentTab == tab
                    NavigationBarItem(
                        selected = selected,
                        onClick = { currentTab = tab },
                        icon = {
                            Icon(
                                imageVector = if (selected) tab.selectedIcon else tab.unselectedIcon,
                                contentDescription = tab.title
                            )
                        },
                        label = { Text(tab.title) },
                        modifier = Modifier.testTag("nav_${tab.name.lowercase()}")
                    )
                }
            }
        }
    ) { innerPadding ->
        val modifier = Modifier.padding(innerPadding)

        when (currentTab) {
            ClinicTab.DASHBOARD -> DashboardScreen(
                viewModel = viewModel,
                onNavigateToPatients = { currentTab = ClinicTab.PATIENTS },
                onNavigateToAppointments = { currentTab = ClinicTab.APPOINTMENTS },
                onNavigateToDoctors = { currentTab = ClinicTab.DOCTORS },
                onOpenBookAppointment = {
                    selectedPatientForBooking = null
                    selectedDoctorForBooking = null
                    showBookAppointmentDialog = true
                },
                onOpenRegisterPatient = { showRegisterPatientDialog = true },
                modifier = modifier
            )
            ClinicTab.PATIENTS -> PatientsScreen(
                viewModel = viewModel,
                onOpenRegisterPatient = { showRegisterPatientDialog = true },
                onBookAppointmentForPatient = { patient ->
                    selectedPatientForBooking = patient
                    selectedDoctorForBooking = null
                    showBookAppointmentDialog = true
                },
                modifier = modifier
            )
            ClinicTab.APPOINTMENTS -> AppointmentsScreen(
                viewModel = viewModel,
                onOpenBookAppointment = {
                    selectedPatientForBooking = null
                    selectedDoctorForBooking = null
                    showBookAppointmentDialog = true
                },
                modifier = modifier
            )
            ClinicTab.DOCTORS -> DoctorsScreen(
                viewModel = viewModel,
                onBookWithDoctor = { doctor ->
                    selectedDoctorForBooking = doctor
                    selectedPatientForBooking = null
                    showBookAppointmentDialog = true
                },
                modifier = modifier
            )
            ClinicTab.BILLING -> BillingRecordsScreen(
                viewModel = viewModel,
                modifier = modifier
            )
        }

        // Dialogs
        if (showRegisterPatientDialog) {
            RegisterPatientDialog(
                onDismiss = { showRegisterPatientDialog = false },
                onConfirm = { name, age, gender, bloodGroup, phone, email, address, history, emergency ->
                    viewModel.registerPatient(
                        fullName = name,
                        age = age,
                        gender = gender,
                        bloodGroup = bloodGroup,
                        phone = phone,
                        email = email,
                        address = address,
                        medicalHistory = history,
                        emergencyContact = emergency
                    )
                }
            )
        }

        if (showBookAppointmentDialog) {
            BookAppointmentDialog(
                doctors = doctors,
                initialPatient = selectedPatientForBooking,
                initialDoctor = selectedDoctorForBooking,
                onDismiss = { showBookAppointmentDialog = false },
                onConfirm = { patientName, doctor, date, timeSlot, type, reason ->
                    viewModel.bookAppointment(
                        patientId = selectedPatientForBooking?.id ?: 0,
                        patientName = patientName,
                        doctorId = doctor.id,
                        doctorName = doctor.fullName,
                        department = doctor.department,
                        date = date,
                        timeSlot = timeSlot,
                        type = type,
                        reason = reason,
                        notes = ""
                    )
                }
            )
        }
    }
}
