// src/pages/funding.tsx
import React from 'react';

const fundingData = [
  {
    category: 'תכנות ופיתוח',
    description: `• פיתוח מנגנון יצירת משחקי AI ב-Unreal Engine – יצירת סצנות, דמויות, חוקים.
• אינטגרציה עם מנוע הפיזיקה של Unreal.
• יצירת מערכת סקריפטינג מבוססת AI.
• שיפור ממשק הניהול למפתחים (דשבורד, ניהול נכסים, שמירה וגיבוי).
• תיקון באגים במנוע, חוויית משתמש, טעינה, אחסון ודאטה.
• עלויות שימוש במודלים: GPT-3.5-turbo ~0.002$/1000 tokens, GPT-4 ~0.03$/1000 tokens, GPT-4.1-mini ~0.01$/1000 tokens.`,
    cost: 480880,
    percent: 30,
  },
  {
    category: 'עיצוב UI/UX',
    description: `• יצירת מסכים מודרניים מותאמים למובייל ולדסקטופ.
• גרפים ודשבורדים לאינטראקציה עם AI.
• אייקונים, תפריטים, אנימציות לשיפור UX.
• ההשקעה גבוהה כי יש צורך במעצבים מקצועיים ובבניית ממשק אינטראקטיבי מתקדם.`,
    cost: 160000,
    percent: 10,
  },
  {
    category: 'אינטגרציה עם AI ו-Unreal Engine',
    description: `• חיבור API של AI ל-Unreal Engine ליצירת תוכן משחקים אוטומטי.
• יצירת דמויות, מפות, אויבים, משימות ואפקטים.
• פיצ'ר למידה חכמה – AI משפר את המשחקים לפי שימושים של המשתמשים.
• עלות API וחיבור: ~50,000 ש"ח כולל תשתיות, תיעוד, SDK, בדיקות.`,
    cost: 320000,
    percent: 20,
  },
  {
    category: 'שיווק ופרסום',
    description: `• פרסום ממומן בגוגל, פייסבוק, YouTube.
• קמפיינים ממוקדים בגיימרים ומפתחים.
• טרגוט לפי תחומי עניין וטכנולוגיות AI.
• עלות משוערת: 200,000 ש"ח, כולל תשלום לכל מודעות, ניהול קמפיינים מקצועי.`,
    cost: 200000,
    percent: 12.5,
  },
  {
    category: 'קידום ע"י אינפלואנסרים וסלבריטאים',
    description: `• תשלום לגיימרים וסטרימרים להצגת הפלטפורמה.
• יצירת תוכן ממומן עם משחקי AI.
• תשלום מוצע: 
   - יוטיוברים עם >400,000 עוקבים: 15,000–20,000 ש"ח כל אחד.
   - טיקטוקרים עם >500,000 עוקבים: 10,000–15,000 ש"ח כל אחד.
• כולל כ-8–10 יוצרים מרכזיים.`,
    cost: 240000,
    percent: 15,
  },
  {
    category: 'שרתים ותשתיות ענן',
    description: `• שימוש ב-Supabase (Pro/Team) לשרתים ומסד נתונים.
• חישובי AI בזמן אמת ואחסון משחקים, נכסים, דמויות ומפות.
• אבטחה, גיבויים וסקיילינג.
• עלויות משוערות: ~10,000 ש"ח לחודש, ~120,000 ש"ח לשנה.
• ניתן להרחיב את השרתים עם Storage וCompute נוספים במידת הצורך.`,
    cost: 120000,
    percent: 7.5,
  },
  {
    category: 'הוצאות שונות / חירום',
    description: `• רישיונות תוכנה, כלים נוספים, עמלות משפטיות.
• הוצאות בלתי צפויות במהלך הפיתוח והשיווק.
• עלות משוערת: 80,000 ש"ח.`,
    cost: 80000,
    percent: 5,
  },
];

const FundingPage: React.FC = () => {
  const totalCost = fundingData.reduce((acc, item) => acc + item.cost, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">טבלת השקעת פרויקט AI משחקים</h1>

        <table className="w-full border border-gray-300 text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">קטגוריה</th>
              <th className="p-3 border-b">תיאור מדויק של הפיצ’רים / מה המתכנתים יעשו</th>
              {/* <th className="p-3 border-b">עלות משוערת (ש"ח)</th> */}
              <th className="p-3 border-b">אחוז מהתקציב</th>
            </tr>
          </thead>
          <tbody>
            {fundingData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border-b align-top">{item.category}</td>
                <td className="p-3 border-b align-top whitespace-pre-line">{item.description}</td>
                <td className="p-3 border-b align-top">{item.cost.toLocaleString()}</td>
                <td className="p-3 border-b align-top">{item.percent}%</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="p-3 border-b">סך הכל דרוש לגיוס</td>
              <td className="p-3 border-b"></td>
              <td className="p-3 border-b">{totalCost.toLocaleString()}</td>
              <td className="p-3 border-b">100%</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">פרטים נוספים והערות</h2>
          {/* <ul className="list-disc pr-5 space-y-2 p-6">
            <li>כדי לגייס 1,600,000 ש"ח ממשקיע, החברה תצטרך להביא 10%-20% מהעלות עצמה (160,000–320,000 ש"ח) כדי להראות מחויבות.</li>
            <li>העלויות מתכנתים כוללות יצירת פיצ'רים ממשיים, אינטגרציה עם Unreal, סקריפטינג מבוסס AI, דשבורדים למפתחים, תיקון באגים ושיפור UX.</li>
            <li>העיצוב UI/UX כולל מסכים למובייל ודסקטופ, גרפים, דשבורדים ואנימציות. ההשקעה גבוהה כדי ליצור ממשק מתקדם ומושך למשקיעים ומשתמשים.</li>
            <li>השקעה באינטגרציה עם AI ו-Unreal כוללת גם עלות חיבור API, SDK, בדיקות ופיתוח פיצ'רים אוטומטיים (~50,000 ש"ח).</li>
            <li>שיווק כולל פרסום ממומן בגוגל, פייסבוק ו-YouTube, ניהול קמפיינים מקצועי וטרגוט לפי תחומי עניין וטכנולוגיות AI (~200,000 ש"ח).</li>
            <li>קידום ע"י אינפלואנסרים: יוטיוברים עם 400k עוקבים יקבלו ~15-20k ש"ח, טיקטוקרים עם >500k עוקבים יקבלו ~10-15k ש"ח כל אחד, כ-8–10 יוצרים מרכזיים.</li>
            <li>תשתיות הענן מבוססות על Supabase Pro/Team. חישובי AI בזמן אמת, אחסון משחקים, אבטחה, גיבויים וסקיילינג (~120,000 ש"ח). ניתן להרחיב לפי דרישה.</li>
            <li>הוצאות שונות / חירום כוללות רישיונות, תוכנות עזר, עמלות משפטיות והוצאות בלתי צפויות (~80,000 ש"ח).</li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default FundingPage;
