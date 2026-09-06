package com.example.clinic.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.clinic.model.Doctor
import com.example.clinic.ui.components.DoctorCard
import com.example.clinic.viewmodel.ClinicViewModel

@Composable
fun DoctorsScreen(
    viewModel: ClinicViewModel,
    onBookWithDoctor: (Doctor) -> Unit,
    modifier: Modifier = Modifier
) {
    val doctors by viewModel.doctors.collectAsState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Clinic Medical Staff (${doctors.size})",
            style = MaterialTheme.typography.titleLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Board-certified doctors across specialized departments",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 24.dp)
        ) {
            items(doctors, key = { it.id }) { doctor ->
                DoctorCard(
                    doctor = doctor,
                    onBookAppointment = { onBookWithDoctor(doctor) }
                )
            }
        }
    }
}
