# Foodica Dashboard V5 - Google Sheet Integration

## Required Google Sheet columns
Use these headers, or similar names. The app accepts English and Arabic aliases:

- Client ID
- Store Name / Shop Name / Client Name / اسم المحل
- Salesperson / Sales Rep / المندوب
- Region / المنطقة
- Sales Channel / قناة البيع
- Channel Group / مجموعة القناة

`Channel Group` is optional. If missing, the app tries to infer it from Sales Channel.

## Setup

1. Open your Google Sheet.
2. File > Share > Publish to web.
3. Choose the sheet tab and CSV.
4. Copy the published CSV URL.
5. Create `.env.local` in the project root.
6. Add:

```env
GOOGLE_SHEET_CSV_URL="YOUR_CSV_URL_HERE"
GOOGLE_SHEET_CACHE_SECONDS=60
```

7. Restart Next.js:

```bash
Ctrl + C
rmdir /s /q .next
npm run dev -- -p 3001
```

If the URL is missing or fails, the dashboard automatically uses the embedded fallback data.
