"""Vérification indépendante du ZIP, des prix, textes et images importés."""
import base64,hashlib,html,io,json,re,sys,zipfile
from pathlib import Path
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[1]
products=json.loads((root/'data/boutique-products.json').read_text(encoding='utf-8'))
audit=json.loads((root/'data/boutique-import-audit.json').read_text())
with zipfile.ZipFile(sys.argv[1]) as z:source=z.read('index.html').decode('utf-8')
source_images={hashlib.sha256(raw).hexdigest():raw for raw in [base64.b64decode(v) for v in re.findall(r'data:image/[^;]+;base64,([A-Za-z0-9+/=\r\n]+)',source)]}
assert len(products)==len(re.findall(r'<section class="detail-page"',source))==20
assert len({p['slug'] for p in products})==20
assert set(source_images)=={i['sourceSha256'] for i in audit['images']}
for p in products:
 section=re.search(r'<section class="detail-page" id="detail-'+re.escape(p['id'])+r'">(.*?)</section>',source,re.S)[1]
 assert p['priceLabel']==html.unescape(re.search(r'<div class="detail-price">(.*?)</div>',section)[1])
 assert len(p['features'])==section.count('class="fcard"')
 assert len(p['specifications'])==section.count('<tr>')
 assert all(r in {x['slug'] for x in products} for r in p['relatedProducts'])
 for photo in p['images']:
  for key in ['src','small','medium']:
   path=root/'public'/photo[key].lstrip('/');assert path.exists();Image.open(path).verify()
for record in audit['images']:
 original=Image.open(io.BytesIO(source_images[record['sourceSha256']])).convert('RGBA')
 master=Image.open(root/'public'/record['path'].lstrip('/')).convert('RGBA')
 assert original.size==master.size
 assert ImageChops.difference(original,master).getbbox() is None,record['path']
assert 'data:image/' not in json.dumps(products)
assert not re.search(r'alibaba|aliexpress',json.dumps(products),re.I)
print(f"PASS: {len(products)} produits, tous les prix/textes, {len(source_images)} images uniques, pixels originaux préservés, liens associés valides.")
