package com.hina.minimalos.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.Font
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.unit.sp
import com.hina.minimalos.R

private val provider = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs
)

val InterFamily = FontFamily(
    Font(googleFont = GoogleFont("Inter"), fontProvider = provider)
)

val JetBrainsFamily = FontFamily(
    Font(googleFont = GoogleFont("JetBrains Mono"), fontProvider = provider)
)

val Typography = Typography(
    displayLarge  = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Light,  fontSize = 72.sp, letterSpacing = (-2).sp),
    displayMedium = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Light,  fontSize = 48.sp),
    titleLarge    = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Normal, fontSize = 18.sp),
    titleMedium   = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Medium, fontSize = 14.sp),
    bodyLarge     = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Normal, fontSize = 16.sp),
    bodyMedium    = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Normal, fontSize = 14.sp),
    bodySmall     = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Normal, fontSize = 12.sp),
    labelLarge    = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Medium, fontSize = 11.sp, letterSpacing = 1.sp),
    labelMedium   = TextStyle(fontFamily = JetBrainsFamily, fontWeight = FontWeight.Normal, fontSize = 10.sp, letterSpacing = 0.5.sp),
    labelSmall    = TextStyle(fontFamily = InterFamily, fontWeight = FontWeight.Medium, fontSize = 10.sp, letterSpacing = 2.sp),
)
