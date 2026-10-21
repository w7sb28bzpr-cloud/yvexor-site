"""Restaurant OS brochure: source user commercial guide, hardware confirmed by user."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF
from PIL import Image
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/Brochure-commerciale-YVEXOR-Restaurant-OS.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
W,H=595.276,841.89
navy='#071626';blue='#087AF5';cyan='#62D1FF';ink='#132C43';muted='#4E6578';light='#EDF4FA'
URL='https://yvexor.com/solutions-restaurants/'
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('YVEXOR Restaurant OS - Brochure commerciale')
c.setAuthor('YVEXOR')
def box(x,t,w,h,fill,r=0,stroke=None):
 c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill));c.roundRect(x,H-t-h,w,h,r,fill=1,stroke=int(stroke is not None))
def text(s,x,t,w,size=11,color=ink,bold=False,leading=None,maxh=None):
 p=Paragraph(s,ParagraphStyle('p',fontName='ArialBold' if bold else 'Arial',fontSize=size,leading=leading or size*1.35,textColor=HexColor(color)))
 _,h=p.wrap(w,H)
 if maxh: assert h<=maxh,(s,h,maxh)
 assert t+h<H-20,(s,t,h)
 p.drawOn(c,x,H-t-h);return h
def label(s,x,t,w,color=blue):return text(s,x,t,w,9,color,True,12)
def brand(dark=False):
 text('YVEXOR',36,27,220,24,'#FFFFFF' if dark else navy,True)
 label('RESTAURANT OS',36,61,300,cyan if dark else blue)
def footer(n):
 c.setStrokeColor(HexColor('#DCE6EF'));c.line(36,43,W-36,43)
 text('yvexor.com  •  07 56 91 30 13',36,H-34,400,8,muted)
 text(f'{n} / 2',W-65,H-34,35,8,muted)

box(0,0,W,329,navy);brand(True)
text('Une caisse.<br/>Tout un restaurant<br/>à connecter.',36,104,335,29,'#FFFFFF',True,34)
text('Salle, cuisine, bar et pilotage :<br/>un environnement qui évolue avec vous.',36,220,320,12,'#C5D9E8',False,18)
box(36,274,288,34,blue,8)
text('Caisse+ dès 49 € HT / mois',49,281,264,14,'#FFFFFF',True)
img=Image.open(ROOT/'public/solution-restaurant-v1.webp')
c.drawImage(ImageReader(img),389,H-289,width=158,height=237,mask='auto')
text('Visuel d’illustration, non contractuel.',360,304,205,7.5,'#B6CBDC')
label('RESTAURANTS • BRASSERIES • ÉTABLISSEMENTS AVEC SERVICE',36,349,525)
text('Votre service mérite des outils qui se parlent.',36,373,525,20,ink,True)
text('Commencez par l’encaissement. Selon votre offre et les modules activés, reliez les commandes, la préparation, les équipes et le suivi de votre activité.',36,413,520,11,muted)
cards=[(36,'01 / VOUS AVEZ DÉJÀ VOTRE POSTE','Gardez votre matériel.','0 €','d’achat de poste YVEXOR','Votre abonnement logiciel, sur votre équipement compatible. Nous vérifions les appareils et les périphériques avant activation.'),(304,'02 / VOUS SOUHAITEZ ÊTRE ÉQUIPÉ','Choisissez un poste YVEXOR.','380 € HT','une seule fois, en plus du logiciel','Achat d’un poste physique complet. Composition confirmée au devis ; abonnement, installation et autres équipements séparés.')]
for x,k,h,price,freq,body in cards:
 box(x,477,255,219,light,12);label(k,x+16,494,225)
 text(h,x+16,524,223,15,ink,True,maxh=42)
 text(price,x+16,565,223,29,blue,True)
 text(freq,x+16,605,223,10,muted)
 text(body,x+16,632,223,9.5,muted,maxh=54)
text('Exemple : Restaurant OS à 179 € HT/mois<br/>+ poste acheté 380 € HT une seule fois.',36,715,520,13,ink,True,18)
text('Executive Full constitue une formule distincte avec matériel : voir au verso.',36,764,520,9,muted)
footer(1);c.showPage()

brand();text('Une offre pour chaque étape.',36,103,525,25,ink,True)
text('Abonnements Restaurant OS : tarifs HT par mois, hors options sauf indication.',36,143,525,10,muted)
plans=[
 ('FREE','0 €','Pour démarrer',['Caisse simple et ticket numérique','CA du jour, historique limité']),
 ('CAISSE+','49 €','Petit établissement',['Caisse complète, 1 téléphone serveur','Suivi client, YVEXOR Connect et recherche de personnel']),
 ('SERVICE','99 €','Service connecté',['Jusqu’à 5 téléphones, cuisine connectée','IA minimum, accès multi-site','Site et réservation en option']),
 ('RESTAURANT','179 €','Le cœur de votre restaurant',['Téléphones illimités, cuisine et bar','Préparation, planning employés','Site + réservations inclus','Pilotage financier avancé']),
 ('INTELLIGENCE','389 €','Analyse et automatisation',['IA avancée, scan de factures','Marges et prévisions','Analyse concurrence et matching intelligent']),
 ('EXECUTIVE','599 €','Logiciel Executive',['IA de direction et pilotage global','Paie selon conditions et effectif','Full : 699 € HT/mois avec matériel défini au devis'])]
for i,(name,price,subtitle,features) in enumerate(plans):
 x=36+(i%3)*178;t=178+(i//3)*181
 box(x,t,167,169,'#E5F2FF' if i==3 else light,10,blue if i==3 else '#DCE6EF')
 label(name,x+13,t+12,143)
 text(price,x+13,t+31,140,25,blue,True)
 text('HT / mois',x+13,t+66,140,8,muted)
 text(subtitle,x+13,t+86,140,9,ink,True)
 yy=t+106
 for item in features:
  yy+=text('• '+item,x+13,yy,141,8,muted,leading=10.3)+3
 assert yy<t+166,(name,yy,t)
text('Téléphones : nombre d’appareils utilisables, non fournis avec l’abonnement logiciel seul.',36,536,525,8,muted)
text('Périmètres issus du guide commercial Restaurant OS 2026. Disponibilité des modules, équipements et services tiers à confirmer en démonstration et au devis.',36,552,525,8,muted)
box(36,584,523,67,navy,9)
text('Les options qui complètent votre service',50,595,490,12,'#FFFFFF',True)
text('Sur Service : bar +15 € / mois • planning +20 € / mois<br/>Site + réservations +39 € / mois. Ces trois modules sont inclus dès Restaurant.',50,618,490,9,'#C5D9E8',leading=12)
text('Parlons de votre établissement.',36,670,410,21,ink,True)
text('Yannick · YVEXOR',36,705,365,11,ink,True)
text('07 56 91 30 13',36,726,350,20,blue,True)
c.linkURL('tel:+33756913013',(36,H-754,280,H-725),relative=0)
widget=qr.QrCodeWidget(URL);b=widget.getBounds();size=80
d=Drawing(size,size,transform=[size/(b[2]-b[0]),0,0,size/(b[3]-b[1]),0,0]);d.add(widget);renderPDF.draw(d,c,466,H-751)
c.linkURL(URL,(460,H-755,550,H-665),relative=0)
text('Découvrir Restaurant OS',443,752,117,7.5,muted)
text('Tarifs HT au 16/09/2026, selon devis. Poste à 380 € : achat matériel distinct, hors abonnement et équipements supplémentaires. Executive Full : composition, conditions et effectif à préciser. Installation, configuration et services tiers éventuels séparés.',36,771,523,7,muted,8.5,maxh=26)
footer(2);c.showPage();c.save()
r=PdfReader(OUT);assert len(r.pages)==2
content='\n'.join(p.extract_text() for p in r.pages)
for s in ['49','99','179','389','599','699','380','07 56 91 30 13']:assert s in content
print(OUT);print('PASS: two pages, Restaurant OS prices and hardware checked')
