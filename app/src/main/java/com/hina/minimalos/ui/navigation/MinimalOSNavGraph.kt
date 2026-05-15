package com.hina.minimalos.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.hina.minimalos.ui.home.HomeScreen

@Composable
fun MinimalOSNavGraph(navController: NavHostController) {
    NavHost(navController, startDestination = Route.Home.path) {
        composable(Route.Home.path)     { HomeScreen() }
        composable(Route.Drawer.path)   { }
        composable(Route.Settings.path) { }
    }
}
