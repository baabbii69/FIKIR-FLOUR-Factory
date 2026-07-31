"""Adds the missing Afan Oromo product and footer strings to om.ts.

Machine-assisted like the rest of that file — the header note about having a
native speaker proofread applies to these too.
"""
import io

BLOCK = '''
  // Footer links
  "footer.aboutUs": "Waa'ee Keenya",
  "footer.facilityQuality": "Warshaa fi Qulqullina",
  "footer.careers": "Carraa Hojii",
  "footer.becomeDistributor": "Raabsaa Ta'i",
  "footer.contactLink": "Nu Qunnamaa",
  "footer.linkFlour": "Daakuu",
  "footer.linkBiscuits": "Biskuutii Unic",
  "footer.linkWafers": "Waafarii Unic",
  "footer.linkChips": "Chiipsii Unic",
  "footer.linkAll": "Oomishaalee Hunda",

  // Products
  "prod.special.name": "Daakuu Ispeeshaalii",
  "prod.special.blurb":
    "Daakuu qamadii sadarkaa alergiitti qophaa'e, haphii fi wal fakkaataa ta'ee daakamee hanga Vitaaminii B12'tti cimfame. Warra buddeena baay'inaan tolchaniif filannoo amanamaa.",
  "prod.special.meta": "5 · 10 · 25 · 50 kg",
  "prod.3f.name": "Daakuu 3F",
  "prod.3f.blurb":
    "Daakuu qamadii hojii hundaaf oolu, tolchuu guyyaa guyyaa fi budeenaaf, sadarkaa biyyaalessaatiin cimfamee mana Itoophiyaa keessatti amanamaa.",
  "prod.3f.meta": "25 · 50 kg",
  "prod.1k.name": "Daakuu 1K",
  "prod.1k.blurb":
    "Daakuu qamadii gatii madaalawaa sadarkaa addunyaatiin oomishame, cimfamee raabsitootaaf, gurgurtootaa fi mana nyaataa gurguddaaf qopheeffame.",
  "prod.1k.meta": "25 · 50 kg",
  "prod.corn.name": "Daakuu Boqqolloo",
  "prod.corn.blurb":
    "Daakuu boqqolloo haphii, nyaata aadaa fi ammayyaatiif; sarara ammayyaa fi sadarkaa qulqullina daakuu qamadii keenyaatiin oomishame.",
  "prod.corn.meta": "Gaaffiidhaan",
  "prod.high-energy.name": "Biskuutii Anniisaa Olaanaa Unic",
  "prod.high-energy.blurb":
    "Biskuutii giluukoosiin badhaadhe, anniisaa guyyaa guyyaatiif tolfame. Guutuu biyyaatti jaallatamaa.",
  "prod.high-energy.meta": "Biskuutii mi'aawaa",
  "prod.vanilla-sandwich.name": "Saandwiichii Vaanilaa Unic",
  "prod.vanilla-sandwich.blurb": "Biskuutii cabaa kiriimii vaanilaa lallaafaadhaan guutame.",
  "prod.vanilla-sandwich.meta": "Biskuutii kiriimii",
  "prod.apple-vanilla.name": "Unic Apple Vaanilaa",
  "prod.apple-vanilla.blurb": "Biskuutii saandwiichii kiriimii mi'aa appilii-vaanilaa ifaa qabu.",
  "prod.apple-vanilla.meta": "Biskuutii kiriimii",
  "prod.banana.name": "Unic Muuzii",
  "prod.banana.blurb": "Biskuutii kiriimii mi'aa muuzii qabu, ijoolleen guddaanis jaallatu.",
  "prod.banana.meta": "Biskuutii kiriimii",
  "prod.cappuccino.name": "Unic Kaappuchiinoo",
  "prod.cappuccino.blurb": "Biskuutii kiriimii buna qabu, mi'aa kaappuchiinoo cimaa waliin.",
  "prod.cappuccino.meta": "Biskuutii kiriimii",
  "prod.glucose.name": "Unic Giluukoosii",
  "prod.glucose.blurb": "Biskuutii giluukoosii salphaa fi cabaa, shaayii yookaan aannan waliin mijaa'aa.",
  "prod.glucose.meta": "Biskuutii mi'aawaa",
  "prod.abounded.name": "Saandwiichii Abounded Unic",
  "prod.abounded.blurb":
    "Biskuutii saandwiichii geengoo saanduqa maatiitiin dhihaatu, laancii fi yeroo shaayiitiif filatamaa.",
  "prod.abounded.meta": "Biskuutii saandwiichii saanduqaa",
  "prod.zoo.name": "Biskuutii Zoo Unic",
  "prod.zoo.blurb": "Biskuutii bocaa bineensotaa nama gammachiisu, harka xixiqqaa fi seequu guddaadhaaf.",
  "prod.zoo.meta": "Biskuutii daa'immanii",
  "prod.wafer-chocolate.name": "Waafarii Chokoleetii Unic",
  "prod.wafer-chocolate.blurb": "Waafarii cabaa kiriimii chokoleetii badhaadhaadhaan walitti tuulame.",
  "prod.wafer-chocolate.meta": "Waafarii kiriimii",
  "prod.wafer-vanilla.name": "Waafarii Vaanilaa Unic",
  "prod.wafer-vanilla.blurb": "Waafarii salphaa kiriimii vaanilaa lallaafaa qabu.",
  "prod.wafer-vanilla.meta": "Waafarii kiriimii",
  "prod.wafer-orange.name": "Waafarii Burtukaanaa Unic",
  "prod.wafer-orange.blurb": "Waafarii cabaa kiriimii burtukaanaa mi'aawaadhaan guutame.",
  "prod.wafer-orange.meta": "Waafarii kiriimii",
  "prod.chips-tomato.name": "Chiipsii Timaatimii Unic",
  "prod.chips-tomato.blurb":
    "Chiipsii dinnichaa cabaa qoosaa timaatimii qabu. 100% uumamaa.",
  "prod.chips-tomato.meta": "40g · 120g",
  "prod.chips-paprika.name": "Chiipsii Paaprikaa Unic",
  "prod.chips-paprika.blurb":
    "Chiipsii dinnichaa qoosaa paaprikaa cimaa qabu, dinnicha Itoophiyaa filatamaa irraa hojjetame.",
  "prod.chips-paprika.meta": "40g · 120g",
  "prod.chips-natural.name": "Chiipsii Uumamaa Unic",
  "prod.chips-natural.blurb":
    "Chiipsii dinnichaa uumamaa ashaboo xiqqoo qabu, koolestiroolii hin qabne, 100% uumamaa.",
  "prod.chips-natural.meta": "40g · 120g",
'''

path = "src/i18n/om.ts"
s = io.open(path, encoding="utf8").read()
if '"prod.special.name"' in s:
    print("already present, nothing to do")
else:
    anchor = "\n  // Quality steps"
    assert anchor in s, "anchor not found"
    s = s.replace(anchor, BLOCK + anchor, 1)
    io.open(path, "w", encoding="utf8").write(s)
    print("added Afan Oromo product + footer strings")
