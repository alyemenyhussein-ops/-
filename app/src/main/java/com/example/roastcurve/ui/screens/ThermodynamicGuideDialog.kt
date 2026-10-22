package com.example.roastcurve.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.ui.theme.*

@Composable
fun ThermodynamicGuideDialog(
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = CopperPrimary)
            ) {
                Text("إغلاق الدليل", fontWeight = FontWeight.Bold)
            }
        },
        title = {
            Column {
                Text(
                    text = "الدليل العلمي لديناميكا تحميص القهوة المختصة",
                    color = SteamText,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Thermodynamics & Roast Curve Troubleshooting Guide",
                    color = CopperPrimary,
                    fontSize = 11.sp
                )
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 500.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Section 1: RoR Laws
                GuideSection(
                    title = "1. قوانين معدل الارتفاع (RoR Dynamics)",
                    content = """
                    • قاعدة التناقص الرتيب: بعد قمة الـ RoR، يجب أن ينحدر المنحنى بشكل سلس وتنازلي مستمر دون أي تسطح أو صعود مفاجئ.
                    • الانهيار الحراري (RoR Crash): هبوط حاد في RoR عند القرقعة الأولى نتيجة التبخير الماص للحرارة، يسبب طعماً مخبوزاً (Baked) وتسطح الحلاوة. العلاج: خفض الغاز مسبقاً بـ 45 ثانية ورفع تدفق الهواء.
                    • القفزة الحرارية (RoR Flick): تسارع RoR في نهاية التحميص نتيجة التفاعل الطارد، يسبب طعم رماد وجفافاً قابضاً. العلاج: منع رفع الغاز في التطور وتبريد البيئة برفع سحب الهواء.
                    """.trimIndent()
                )

                // Section 2: Phase Ratios
                GuideSection(
                    title = "2. النسب الزمنية للمراحل ونسبة التطور (DTR)",
                    content = """
                    • مرحلة التجفيف (Drying Phase): النطاق القياسي 35% إلى 45%. أقل من 32% يهدد بلسع السطح (Scorching).
                    • مرحلة مايلارد (Maillard Phase): 35% إلى 45%. إطالتها تزيد الميلانويدين والقوام على حساب الحمضية.
                    • نسبة وقت التطور (DTR %): للفلتر 14% إلى 18% وفرق حرارة 6-10°C. للإسبريسو 18% إلى 24% وفرق حرارة 10-16°C.
                    • التحميص المخبوز: DTR > 20% مع فرق حرارة < 6°C.
                    """.trimIndent()
                )

                // Section 3: Agtron
                GuideSection(
                    title = "3. مقياس الأجترون وتدرج النواة (ΔAgtron)",
                    content = """
                    • قراءة الحبة الكاملة (Whole): تعكس تكرمل السطح الخارجي.
                    • قراءة البن المطحون (Ground): تعكس نضج واختراق الحرارة للقلب.
                    • الفارق المتوازن (ΔAgtron = Ground - Whole): 8 إلى 14 نقطة للتحميص الفاتح.
                    • تدرج مفرط (> 18): سطح محترق ولب نيء وعشبي.
                    • تدرج راكد (< 5 مع وقت طويل): تحميص مخبوز متسطح.
                    """.trimIndent()
                )

                // Section 4: Water Chemistry
                GuideSection(
                    title = "4. هندسة مياه الاستخلاص لمعادلة العيوب",
                    content = """
                    • للقهوة المخبوزة: ماء منخفض القلوية (KH: 20 ppm) لحفظ الحمضية المتبقية، وصلابة مرتفعة بالمغنيسيوم (GH: 85 ppm) لجذب السكريات.
                    • للقفزة الحرارية والمرارة: ماء منخفض الصلابة (GH: 50 ppm) وتقنية التخطي المائي (Bypass Brewing).
                    • للتحميص الناقص (Underdeveloped): ماء مرتفع القلوية (KH: 65 ppm) لعمل دارئة كيميائية تعادل الأحماض الحادة.
                    """.trimIndent()
                )
            }
        },
        containerColor = BgBasalt
    )
}

@Composable
private fun GuideSection(title: String, content: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(10.dp)
    ) {
        Text(title, color = CopperPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(4.dp))
        Text(content, color = SteamText, fontSize = 11.sp, lineHeight = 16.sp)
    }
}
