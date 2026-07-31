"""Adds Amharic and Afan Oromo for the 31 gallery captions.

These captions never had translation keys, so the gallery showed English in
every language. Keys are indexed to match GALLERY order in data/site.ts.
Machine-assisted, like the rest of the dictionaries.
"""
import io

AM = '''
  // Gallery captions
  "gal.cap.0": "ፋብሪካው ከላይ ሲታይ፣ አዳማ",
  "gal.cap.1": "ፋብሪካው፣ አዳማ",
  "gal.cap.2": "የእህል ማከማቻ ሲሎዎች",
  "gal.cap.3": "አቀባበል",
  "gal.cap.4": "ሰርተፊኬቶች እና ሽልማቶች",
  "gal.cap.5": "ቢሮዎቻችን",
  "gal.cap.6": "የአመራር መቀበያ",
  "gal.cap.7": "የራሳችን የማድረሻ መኪኖች",
  "gal.cap.8": "በመላ አገሪቱ ማከፋፈል",
  "gal.cap.9": "ሌት ተቀን ክትትል",
  "gal.cap.10": "የዱቄት ወፍጮው",
  "gal.cap.11": "የመፍጨት መስመር",
  "gal.cap.12": "የስንዴ ምርት ሰብሰባ",
  "gal.cap.13": "የጥራት ቁጥጥር ላቦራቶሪ",
  "gal.cap.14": "የብስኩት መስመሩ",
  "gal.cap.15": "የUnic መስመሮችን ማሸግ",
  "gal.cap.16": "የተጠናቀቁ ብስኩቶች፣ ለመላክ ዝግጁ",
  "gal.cap.17": "የምርት አዳራሽ",
  "gal.cap.18": "የተጠናከረ ዱቄት፣ ታሽጎ",
  "gal.cap.19": "የUnic ስብስብ",
  "gal.cap.20": "የAbounded ሳንድዊች ብስኩት",
  "gal.cap.21": "Unic ክራከርስ",
  "gal.cap.22": "Unic ዌፈር፣ ቫኒላ",
  "gal.cap.23": "Unic ሃይ ኤነርጂ ብስኩት",
  "gal.cap.24": "Unic ዌፈር ማንጎ",
  "gal.cap.25": "የFikir ቡድን",
  "gal.cap.26": "አመራሩ በሥራ ላይ",
  "gal.cap.27": "ለሻይ ሰዓት የተሠራ",
  "gal.cap.28": "የዕለት ተዕለት ጣፋጭ",
  "gal.cap.29": "በመላ አገሪቱ በመደርደሪያዎች ላይ",
  "gal.cap.30": "ከአንድ ኩባያ ጋር የተሻለ",
'''

OM = '''
  // Gallery captions
  "gal.cap.0": "Warshaan gubbaadhaa, Adaamaa",
  "gal.cap.1": "Warshaa, Adaamaa",
  "gal.cap.2": "Kuusaa midhaanii (sayiloo)",
  "gal.cap.3": "Simannaa",
  "gal.cap.4": "Ragaalee fi badhaasota",
  "gal.cap.5": "Waajjiraalee keenya",
  "gal.cap.6": "Bakka boqonnaa hooggantootaa",
  "gal.cap.7": "Konkolaattota geejjibaa keenya",
  "gal.cap.8": "Guutuu biyyaatti raabsuu",
  "gal.cap.9": "Hordoffii halkanii guyyaa",
  "gal.cap.10": "Daakuu warshaa",
  "gal.cap.11": "Sarara daakuu",
  "gal.cap.12": "Sassaabbii qamadii",
  "gal.cap.13": "Mana qorannoo to'annoo qulqullinaa",
  "gal.cap.14": "Sarara biskuutii",
  "gal.cap.15": "Sarara Unic qopheessuu",
  "gal.cap.16": "Biskuutii xumurame, ergamuuf qophaa'e",
  "gal.cap.17": "Galma oomishaa",
  "gal.cap.18": "Daakuu cimfame, korojootti guutame",
  "gal.cap.19": "Tuuta Unic",
  "gal.cap.20": "Biskuutii saandwiichii Abounded",
  "gal.cap.21": "Unic Crackers",
  "gal.cap.22": "Waafarii Unic, vaanilaa",
  "gal.cap.23": "Biskuutii Anniisaa Olaanaa Unic",
  "gal.cap.24": "Waafarii Maangoo Unic",
  "gal.cap.25": "Gareen Fikir",
  "gal.cap.26": "Hooggansi hojii irratti",
  "gal.cap.27": "Yeroo shaayiitiif kan tolfame",
  "gal.cap.28": "Mi'aa guyyaa guyyaa",
  "gal.cap.29": "Guutuu biyyaatti saanqaa irratti",
  "gal.cap.30": "Kuppii tokko waliin caalaa mi'aawa",
'''

for path, block in (("src/i18n/am.ts", AM), ("src/i18n/om.ts", OM)):
    s = io.open(path, encoding="utf8").read()
    if '"gal.cap.0"' in s:
        print("already present ->", path)
        continue
    anchor = "\n  // Quality steps"
    assert anchor in s, path
    s = s.replace(anchor, block + anchor, 1)
    io.open(path, "w", encoding="utf8").write(s)
    print("added 31 gallery captions ->", path)
