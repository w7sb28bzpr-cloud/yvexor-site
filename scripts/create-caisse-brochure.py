"""Commercial two-page A4 brochure, prices sourced from the public catalogue."""
import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
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
OUT=ROOT/'output/pdf/Brochure-commerciale-YVEXOR-Caisses.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
data=json.loads((ROOT/'data/caisses.json').read_text(encoding='utf-8'))
plans=[p for p in data['plans'] if 'commerce' in p['families']]
post=next(x['once'] for x in data['hardware'] if x['id']=='post')
web=next(x['monthly'] for x in data['options'] if x['id']=='website')
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
W,H=595.276,841.89
navy='#071626';blue='#087AF5';cyan='#62D1FF';ink='#132C43';muted='#4E6578';light='#EDF4FA'
c=canvas.Canvas(str(OUT),pagesize=(W,H))
c.setTitle('YVEXOR Caisses - Brochure commerciale')
c.setAuthor('YVEXOR')
c.setSubject('Caisses pour commerces : logiciel, matériel et configuration')
def box(x,t,w,h,fill,r=0,stroke=None):
 c.setFillColor(HexColor(fill));c.setStrokeColor(HexColor(stroke or fill))
 c.roundRect(x,H-t-h,w,h,r,fill=1,stroke=int(stroke is not None))
def text(s,x,t,w,size=11,color=ink,bold=False,leading=None,maxh=None):
 p=Paragraph(s,ParagraphStyle('p',fontName='ArialBold' if bold else 'Arial',fontSize=size,leading=leading or size*1.35,textColor=HexColor(color),spaceAfter=0))
 _,h=p.wrap(w,H)
 if maxh: assert h<=maxh,(s,h,maxh)
 assert t+h<H-20,(s,t,h)
 p.drawOn(c,x,H-t-h)
 return h
def label(s,x,t,w,color=blue):return text(s,x,t,w,9,color,True,12)
def brand(t=27,dark=False):
 text('YVEXOR',36,t,180,24,'#FFFFFF' if dark else navy,True)
 label('CAISSES POUR LES COMMERCES',36,t+34,300,cyan if dark else blue)
def footer(n):
 c.setStrokeColor(HexColor('#DCE6EF'));c.line(36,43,W-36,43)
 text('yvexor.com/caisse/  •  07 56 91 30 13',36,H-34,400,8,muted)
 text(f'{n} / 2',W-65,H-34,35,8,muted)
def bullet(s,x,t,w,size=10):
 box(x,t+5,4,4,blue,2);return text(s,x+13,t,w-13,size,muted)
def page1():
 box(0,0,W,333,navy)
 brand(dark=True)
 text('Une caisse adaptée<br/>à votre commerce.',36,105,315,31,'#FFFFFF',True,35)
 text('Votre métier. Votre matériel.<br/>Votre façon de travailler.',36,194,280,14,'#C5D9E8',False,20)
 box(36,260,255,39,blue,8)
 text(f'Logiciel dès {plans[0]["monthly"]} € HT / mois',49,268,230,15,'#FFFFFF',True)
 # Existing site illustration, not a contractual photograph of the 380 EUR package.
 img=ImageReader(Image.open(ROOT/'public/solution-commerce-v1.webp'))
 c.drawImage(img,346,H-248,width=213,height=142,mask='auto')
 text('Visuel d’illustration.<br/>Équipements selon configuration.',346,258,213,8,'#B6CBDC')
 label('UN ÉCOSYSTÈME COMMUN, CONFIGURÉ POUR VOTRE ACTIVITÉ',36,356,525)
 text('Épicerie, alimentation, supérette, boulangerie, boutique, fleuriste…',36,378,518,17,ink,True,22)
 text('Organisez vos articles, encaissez et retrouvez vos ventes. Choisissez ensuite le niveau de suivi adapté à votre quotidien.',36,436,515,11,muted)
 cards=[(36,'01  /  VOTRE MATÉRIEL','Gardez votre équipement.', '0 €', 'd’achat de poste YVEXOR', 'Ordinateur, tablette et périphériques compatibles : nous vérifions votre installation avant de confirmer la solution.'),(304,'02  /  POSTE YVEXOR','Équipez votre comptoir.',f'{post} € HT','une seule fois, hors abonnement','Un poste physique complet YVEXOR. La composition et la compatibilité sont confirmées avant commande.')]
 for x,k,h,price,freq,body in cards:
  box(x,492,255,220,light,12)
  label(k,x+18,510,220)
  text(h,x+18,535,220,16,ink,True)
  text(price,x+18,570,220,29,blue,True)
  text(freq,x+18,611,220,10,muted)
  text(body,x+18,638,220,10,muted,maxh=62)
 text('Le logiciel se paie chaque mois. Le matériel ne s’achète que si vous en avez besoin.',36,731,520,12,ink,True)
 footer(1);c.showPage()
def page2():
 brand()
 text('Trois formules. Un choix clair.',36,102,525,26,ink,True)
 text('Choisissez votre niveau de suivi. Aucun achat de poste YVEXOR imposé.',36,145,520,11,muted)
 descriptions=[('Pour encaisser simplement.',['Encaissement et tickets','Articles, catégories, prix et TVA','Historique des ventes et chiffre d’affaires'],'Sans gestion de stock.'),('Pour suivre vos produits.',['Le socle Essentiel','Quantités, mouvements et inventaires*','Alertes et seuils selon configuration*'],'Pour le suivi quotidien.'),('Pour lire vos résultats.',['Le périmètre Stock','Prix d’achat et marges*','Rapports et exports pour votre comptabilité*'],'Ne remplace pas votre comptable.')]
 for i,(plan,content) in enumerate(zip(plans,descriptions)):
  x=36+i*178
  box(x,184,167,268,light if i!=1 else '#E5F2FF',12,blue if i==1 else '#DCE6EF')
  label(plan['name'].upper(),x+14,201,141)
  text(f'{plan["monthly"]} €',x+14,225,141,30,blue,True)
  text('HT / mois',x+14,267,141,10,muted)
  text(content[0],x+14,294,139,11,ink,True)
  yy=334
  for b in content[1]: yy+=bullet(b,x+14,yy,139,9)+8
  text(content[2],x+14,420,139,8,muted,maxh=24)
 text('* Fonctions de stock et de pilotage à valider en démonstration sur votre configuration ; périmètre confirmé au devis.',36,463,523,8.5,muted)
 box(36,503,523,68,navy,10)
 text('Une vitrine pour votre commerce',52,516,345,13,'#FFFFFF',True)
 text('Site internet en option : présentation, horaires et contact.<br/>Contenus et raccordements définis avec vous.',52,538,342,9,'#C5D9E8')
 text(f'+{web} €',426,513,116,23,cyan,True)
 text('HT / mois',427,545,110,9,'#C5D9E8')
 text('TPE / paiement CB ou achat du logiciel sans abonnement ?<br/>Demandez une proposition personnalisée, sans tarif présumé.',36,586,525,10,ink,True)
 text('Parlons de votre commerce.',36,635,390,23,ink,True)
 text('Yannick · YVEXOR',36,674,365,12,ink,True)
 text('07 56 91 30 13',36,698,365,20,blue,True)
 c.linkURL('tel:+33756913013',(36,H-725,280,H-697),relative=0)
 text('yvexor.com/caisse/',36,730,365,11,muted)
 c.linkURL('https://yvexor.com/caisse/',(36,H-747,280,H-727),relative=0)
 widget=qr.QrCodeWidget('https://yvexor.com/caisse/');b=widget.getBounds();size=86
 d=Drawing(size,size,transform=[size/(b[2]-b[0]),0,0,size/(b[3]-b[1]),0,0]);d.add(widget)
 renderPDF.draw(d,c,461,H-730)
 text('Configurez votre caisse',444,733,115,8,muted)
 text('Tarifs HT au 16/09/2026, sous réserve du devis. Installation, configuration, reprise de données et services tiers éventuels chiffrés séparément. Poste hors borne, écran supplémentaire et TPE. Aucun paiement automatique via le configurateur.',36,758,523,7.5,muted,9,maxh=30)
 footer(2);c.showPage()
page1();page2();c.save()
r=PdfReader(OUT);assert len(r.pages)==2
alltext='\n'.join(p.extract_text() for p in r.pages)
for s in ['49','79','119','380','39','07 56 91 30 13','Sans gestion de stock']:assert s in alltext,s
print(str(OUT));print('PASS: 2 pages, commercial prices and contact present')
