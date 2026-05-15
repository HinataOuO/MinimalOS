package com.hina.minimalos.ui.navigation

sealed class Route(val path: String) {
    data object Home     : Route("home")
    data object Drawer   : Route("drawer")
    data object Settings : Route("settings")
}
