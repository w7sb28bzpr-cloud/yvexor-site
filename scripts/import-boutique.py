"""Import auditable du catalogue ZIP (Python + Pillow), sans exécuter son HTML."""
import base64, hashlib, html, io, json, re, sys, zipfile
from decimal import Decimal
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
archive=Path(sys.argv[1])
with zipfile.ZipFile(archive) as z:
    assert z.namelist()==['index.html'], 'Archive changed: inspect additional entries before import'
    source=z.read('index.html').decode('utf-8')
assets=root/'public/media/boutique'; assets.mkdir(parents=True,exist_ok=True)
def text(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
def grab(pattern,s):return text(re.search(pattern,s,re.S)[1])
images={}; occurrences=[]
def extract(m):
    raw=base64.b64decode(m[2]); digest=hashlib.sha256(raw).hexdigest(); occurrences.append(digest)
    if digest not in images: images[digest]={'raw':raw,'mime':m[1]}
    return 'asset:'+digest
source=re.sub(r'data:(image/[^;]+);base64,([A-Za-z0-9+/=\r\n]+)',extract,source)
products=[]; manifest=[]
for section in re.findall(r'<section class="detail-page".*?</section>',source,re.S):
    id=re.search(r'id="detail-(.*?)"',section)[1]
    slug=re.sub(r'-(?:\d[\d-]*)(?:-2-visuels-separes|-galerie|-catalogue)?$','',id.removeprefix('yvexor-'))
    if id=='yvexor-borne-paiement-especes-3099':slug='borne-paiement-especes-tout-en-un'
    if '3500-2-visuels' in id:slug='borne-paiement-especes-rendu-monnaie'
    if 'ecran-menu-android' in id:slug='ecran-menu-android-10-1'
    if 'brochure-video-lcd' in id:slug='brochure-video-lcd-7'
    name=grab(r'<h2>(.*?)</h2>',section).rstrip('.')
    category=grab(r'<div class="kicker">(.*?)</div>',section)
    original_category=category
    if 'borne-paiement' in slug:category='Bornes'
    if any(x in slug for x in ['mini-caisse','systeme-caisse','terminal-pos']):category='Caisses & POS'
    price_text=grab(r'<div class="detail-price">(.*?)</div>',section)
    price=int(Decimal(price_text.replace('€','').replace(' ','').replace(',','.'))*100)
    description=grab(r'<h2>.*?</h2>\s*<p>(.*?)</p>',section)
    features=[{'title':text(a),'description':text(b)} for a,b in re.findall(r'<div class="fcard"><strong>(.*?)</strong><p>(.*?)</p></div>',section,re.S)]
    specs=[{'label':text(a),'value':text(b)} for a,b in re.findall(r'<tr><td>(.*?)</td><td>(.*?)</td></tr>',section,re.S)]
    if not description or description.endswith('modules d') or description=='Système d':
        description={'appel-serveur-sans-fil':"Système d’appel sans fil avec boutons de table et bracelets récepteurs vibrants pour le service.",'borne-murale-commande-paiement':"Borne murale YVEXOR avec écran tactile et impression ticket pour la commande et le paiement selon configuration.",'borne-tactile':"Borne tactile de commande et d’accueil, murale ou sur pied, avec impression ticket et interface personnalisable."}[slug]
    if slug=='lecteur-rfid-nfc-usb':description='Lecteur-graveur RFID/NFC USB YVEXOR 13,56 MHz pour badges employés, identification et contrôle d’accès selon configuration.'
    gallery=[]
    for i,digest in enumerate(dict.fromkeys(re.findall(r'asset:([a-f0-9]{64})',section)),1):
        item=images[digest]; stem=f'{slug}-{i:02d}'
        img=Image.open(io.BytesIO(item['raw'])); img.load()
        # Lossless master preserves all source pixels; responsive copies serve small screens.
        img.save(assets/(stem+'.webp'),'WEBP',lossless=True,method=6)
        for size in [480,960]:
            small=img.copy();small.thumbnail((size,size));small.save(assets/f'{stem}-{size}.webp','WEBP',quality=90,method=6)
        url='/media/boutique/'+stem+'.webp'
        gallery.append({'src':url,'small':f'/media/boutique/{stem}-480.webp','medium':f'/media/boutique/{stem}-960.webp','alt':f'{name} — vue {i}','width':img.width,'height':img.height})
        manifest.append({'sourceSha256':digest,'sourceBytes':len(item['raw']),'product':slug,'path':url,'outputBytes':(assets/(stem+'.webp')).stat().st_size})
    variants=[s for s in specs if s['label'] in ['Tailles','Mémoire','Stockage']]
    products.append(dict(id=id,slug=slug,name=name,category=category,sourceCategory=original_category,price=price,currency='EUR',priceLabel=price_text,shortDescription=description,description=description,images=gallery,features=features,specifications=specs,variants=variants,relatedProducts=[],active=True))
relations={'Bornes':['imprimante-thermique-pos','lecteur-rfid-nfc-usb','terminal-mobile-commande-paiement','systeme-caisse-pos'],'Caisses & POS':['tiroir-caisse-4b3c','imprimante-thermique-pos','lecteur-rfid-nfc-usb','kds'],'Affichage':['bracelet-connecte-caisse','borne-tactile','terminal-mobile-commande-paiement','imprimante-thermique-wifi'],'Imprimantes':['systeme-caisse-pos','tiroir-caisse-4b3c','terminal-pos-portable','kds'],'Accessoires':['systeme-caisse-pos','terminal-mobile-commande-paiement','kds','borne-tactile'],'Robotique':['borne-tactile','tablette-android-poe-nfc','ecran-menu-android-10-1']}
slugs={p['slug'] for p in products}
for p in products:p['relatedProducts']=[s for s in relations[p['category']] if s in slugs and s!=p['slug']]
assert len(products)==20 and len(slugs)==20
assert set(images)=={m['sourceSha256'] for m in manifest},'Unassigned image'
(root/'data/boutique-products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root/'data/boutique-import-audit.json').write_text(json.dumps({'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'productCount':len(products),'imageOccurrences':len(occurrences),'uniqueSourceImages':len(images),'images':manifest},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'products':len(products),'occurrences':len(occurrences),'uniqueImages':len(images),'galleries':sum(len(p['images']) for p in products)},indent=2))
