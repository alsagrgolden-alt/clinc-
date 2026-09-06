package com.example.clinic

import android.app.Application
import com.example.clinic.data.ClinicDatabase
import com.example.clinic.data.ClinicRepository

class ClinicApplication : Application() {
    val database by lazy { ClinicDatabase.getDatabase(this) }
    val repository by lazy { ClinicRepository(database) }
}
