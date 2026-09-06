package com.example.clinic.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.clinic.model.Doctor
import com.example.clinic.ui.components.AppointmentCard
import com.example.clinic.ui.components.MetricCard
import com.example.clinic.ui.theme.*
import com.example.clinic.viewmodel.ClinicViewModel

@Composable
fun DashboardScreen(
    viewModel: ClinicViewModel,
    onNavigateToPatients: () -> Unit,
    onNavigateToAppointments: () -> Unit,
    onNavigateToDoctors: () -> Unit,
    onOpenBookAppointment: () -> Unit,
    onOpenRegisterPatient: () -> Unit,
    modifier: Modifier = Modifier
) {
    val stats by viewModel.dashboardStats.collectAsState()
    val appointments by viewModel.appointments.collectAsState()
    val doctors by viewModel.doctors.collectAsState()

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp)
    ) {
        // Welcome Header Banner
        item {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Central Clinic Care",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Active operations • ${doctors.size} Specialists on Duty",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )
                    }
                }
            }
        }

        // Quick Action Buttons
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onOpenBookAppointment,
                    modifier = Modifier.weight(1f).testTag("quick_btn_book_appt"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.AddCircle, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Book Visit")
                }
                OutlinedButton(
                    onClick = onOpenRegisterPatient,
                    modifier = Modifier.weight(1f).testTag("quick_btn_reg_patient"),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Add Patient")
                }
            }
        }

        // Metrics Grid (Row 1)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "Total Patients",
                    value = "${stats.totalPatients}",
                    icon = Icons.Default.People,
                    iconColor = TealPrimary,
                    containerColor = TealPrimaryContainer,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Today's Visits",
                    value = "${stats.todayAppointments}",
                    icon = Icons.Default.CalendarToday,
                    iconColor = CyanSecondary,
                    containerColor = CyanSecondaryContainer,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Metrics Grid (Row 2)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "Active Doctors",
                    value = "${stats.activeDoctors}",
                    icon = Icons.Default.LocalHospital,
                    iconColor = StatusSuccess,
                    containerColor = StatusSuccessContainer,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Pending Bills",
                    value = "${stats.pendingInvoices}",
                    icon = Icons.Default.ReceiptLong,
                    iconColor = StatusWarning,
                    containerColor = StatusWarningContainer,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Available Doctors Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Medical Specialists",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = onNavigateToDoctors) {
                    Text("View All")
                }
            }
        }

        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(horizontal = 4.dp)
            ) {
                items(doctors) { doctor ->
                    Card(
                        modifier = Modifier
                            .width(220.dp)
                            .testTag("dashboard_doctor_${doctor.id}"),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Text(
                                text = doctor.fullName,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = doctor.specialty,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "${doctor.department}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "$${doctor.consultationFee.toInt()} / consult",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Today's Appointments Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Upcoming Appointments",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = onNavigateToAppointments) {
                    Text("Manage")
                }
            }
        }

        if (appointments.isEmpty()) {
            item {
                Text(
                    text = "No appointments scheduled.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 12.dp)
                )
            }
        } else {
            items(appointments.take(4)) { appt ->
                AppointmentCard(
                    appointment = appt,
                    onStatusChange = { newStatus ->
                        viewModel.updateAppointmentStatus(appt.id, newStatus)
                    },
                    onDelete = {
                        viewModel.deleteAppointment(appt)
                    }
                )
            }
        }
    }
}
