# Bojxona Yig'imlari Kalkulyatori Pro

Bu loyiha mustaqil ishlaydigan front-end web-ilova.

## Nima qila oladi
- BYD bo'yicha asosiy bojxona yig'imini hisoblaydi
- Dastlabki deklaratsiyalash uchun 20% chegirma qo'llaydi
- Tranzit, kuryer, BYD tuzatish, ko'rik, bojxona omborida saqlash, hamrohlikda kuzatib borish, vaqtincha saqlash va boshqa xizmatlarni hisoblaydi
- USD kursini CBU JSON endpointidan olishga urinadi
- Natijalarni localStorage tarixiga saqlaydi
- Tarixni JSON qilib eksport qiladi

## Ishga tushirish
### Variant 1
`index.html` faylini brauzerda oching.

### Variant 2
Mahalliy server bilan ishga tushiring:
```bash
cd bojxona-kalkulyator-real
python -m http.server 8000
```
Keyin brauzerda `http://localhost:8000` ni oching.

## Muhim
Bu ilova amaliy yordamchi vosita. Yakuniy hisob-kitobni rasmiy hujjat va amaldagi stavkalar bilan tekshirish kerak.
