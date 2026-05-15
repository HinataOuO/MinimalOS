package com.hina.minimalos

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.rememberNavController
import com.hina.minimalos.ui.navigation.MinimalOSNavGraph
import com.hina.minimalos.ui.theme.MinimalOSTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MinimalOSTheme {
                val navController = rememberNavController()
                MinimalOSNavGraph(navController)
            }
        }
    }
}
