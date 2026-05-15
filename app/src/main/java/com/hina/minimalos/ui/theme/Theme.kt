package com.hina.minimalos.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    background       = Zinc950,
    surface          = Zinc950,
    surfaceVariant   = Zinc900,
    onBackground     = Zinc100,
    onSurface        = Zinc100,
    onSurfaceVariant = Zinc400,
    primary          = Zinc100,
    onPrimary        = Zinc950,
    secondary        = Zinc400,
    onSecondary      = Zinc950,
    outline          = Zinc800,
    outlineVariant   = Zinc900,
    scrim            = Zinc950,
)

@Composable
fun MinimalOSTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content,
    )
}
