# Guide French Revolve — Site complet

---

## 1. Structure des fichiers

```
websitefrenchrevolve/
├── index.html        → Page d'accueil
├── boutique.html     → Boutique + panier
├── devis.html        → Formulaire de devis
├── success.html      → Page après paiement réussi
├── style.css         → Styles de toutes les pages
├── boutique.css      → Styles spécifiques boutique + panier
├── script.js         → JS global (nav mobile, formulaires contact)
├── cart.js           → JS panier (ajouter, supprimer, checkout)
├── api/
│   └── checkout.js   → Fonction Vercel pour Stripe Checkout
├── package.json      → Dépendance Stripe (ne pas toucher)
├── vercel.json       → Config Vercel (ne pas toucher)
└── GUIDE.md          → Ce fichier
```

---

## 2. Intégrations

### Formspree (formulaires de contact + devis)
Les formulaires HTML envoient un email à contact@frenchrevolve.fr via Formspree.

**Où configurer :**
- `devis.html` ligne avec `action="https://formspree.io/f/VOTRE_ID"`
- `index.html` section contact, même ligne

**Comment obtenir ton ID :**
1. formspree.io → créer un compte gratuit
2. New Form → mettre contact@frenchrevolve.fr
3. Copier l'ID (exemple : `xpwzabcd`)
4. Remplacer `VOTRE_ID_FORMSPREE` par ton ID dans les deux fichiers

---

### Stripe (paiement boutique)
Le panier envoie les articles à la fonction `/api/checkout.js` qui crée une session Stripe Checkout.

**Clé secrète Stripe :**
→ Déjà configurée dans Vercel (variable `STRIPE_SECRET_KEY`)
→ Ne jamais mettre la clé secrète dans un fichier HTML/JS

**Price IDs — à configurer dans `api/checkout.js` :**
Stripe dashboard → ton produit → section "Prix" → copier l'ID `price_xxx`

```js
const PRICES = {
  'cnc-aluminium':  'price_TON_ID_ICI',
  '3d-fdm':         'price_TON_ID_ICI',
  '3d-sls':         'price_TON_ID_ICI',
  'gravure-laser':  'price_TON_ID_ICI',
  'plaque':         'price_TON_ID_ICI',
  'portecle':       'price_TON_ID_ICI',
  'gravure-objet':  'price_TON_ID_ICI',
};
```

Chaque clé (ex: `cnc-aluminium`) correspond au `data-id` de la carte produit dans `boutique.html`.

---

## 3. Modifier le texte

### Accroche principale (index.html)
Chercher dans `index.html` :
```html
<h1>Fabrication<br /><em>sur mesure.</em></h1>
<p class="hero-sub">Atelier de fabrication...</p>
```
Changer le texte directement.

### Texte "L'atelier" (index.html)
Chercher `<section id="apropos"` → modifier les deux paragraphes `<p class="about-text">`.

### Texte d'un produit (boutique.html)
Chaque produit ressemble à :
```html
<div class="product-card" data-cat="cnc"
     data-id="cnc-aluminium" data-name="Pièce CNC aluminium" data-price="35">
```
- `data-name` → nom affiché dans le panier
- `data-price` → prix de base (en entier, en euros)
- Le `<h2>`, `<p>` et `<ul>` en dessous → texte de la carte

---

## 4. Ajouter une image

### Mettre une image dans un dossier
Créer un dossier `images/` à la racine du projet et y mettre tes fichiers.
Formats recommandés : `.webp` (le plus léger), `.jpg`, `.png`
Nommage : pas d'espaces, pas d'accents → `cnc-piece.webp`, `hero-atelier.jpg`

### Image de fond d'une section (CSS)
Dans `style.css` ou `boutique.css`, trouver la classe de la section et ajouter :
```css
#hero {
  background-image: url('images/hero-atelier.jpg');
  background-size: cover;
  background-position: center;
}
```

### Image de fond d'une carte produit (boutique.html / boutique.css)
Chaque carte a une classe couleur de fond comme `.product-img-cnc`.
Dans `boutique.css`, remplacer la couleur par une image :
```css
.product-img-cnc {
  background-image: url('images/cnc-piece.jpg');
  background-size: cover;
  background-position: center;
}
```

### Image dans la galerie réalisations (index.html)
Chercher `<div class="gallery-grid">`. Chaque item ressemble à :
```html
<div class="gallery-item">
  <div class="gallery-thumb" data-label="CNC"></div>
  <p>Chassis fibre de carbone</p>
</div>
```
Pour mettre une vraie photo, dans `style.css` ajouter :
```css
.gallery-item:nth-child(1) .gallery-thumb {
  background-image: url('images/realisation-cnc.jpg');
  background-size: cover;
  background-position: center;
}
```
Changer le `1` par le numéro de l'image (1, 2, 3…)

---

## 5. Vidéo en fond (hero ou section)

Dans `index.html`, remplacer le contenu du héro par :
```html
<section id="hero">
  <video class="hero-video" autoplay muted loop playsinline>
    <source src="images/video-atelier.mp4" type="video/mp4" />
  </video>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <!-- contenu existant inchangé -->
  </div>
</section>
```
Dans `style.css` ajouter :
```css
#hero { position: relative; overflow: hidden; }
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  z-index: 0;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 1;
}
.hero-content { position: relative; z-index: 2; color: white; }
```
Format vidéo recommandé : `.mp4` compressé, moins de 10 Mo pour le web.
Outil gratuit pour compresser : handbrake.fr

---

## 6. Ajouter un produit dans la boutique

Dans `boutique.html`, copier-coller un bloc produit existant et modifier :
```html
<div class="product-card" data-cat="CATEGORIE"
     data-id="ID-UNIQUE" data-name="Nom du produit" data-price="PRIX">
  <div class="product-img product-img-STYLE">
    <span class="product-badge">Label</span>
  </div>
  <div class="product-body">
    <h2>Nom du produit</h2>
    <p>Description courte.</p>
    <ul class="product-specs">
      <li>Spec 1</li>
      <li>Spec 2</li>
    </ul>
    <div class="product-footer">
      <div class="product-price">À partir de <strong>XX €</strong></div>
      <button class="btn-primary btn-add-cart">+ Ajouter</button>
    </div>
  </div>
</div>
```
- `data-cat` : une ou plusieurs catégories parmi `cnc`, `3d`, `laser`, `cadeau` (séparées par espace)
- `data-id` : identifiant unique sans espace ni accent (ex: `mon-produit`)
- `data-price` : prix minimum en chiffre entier
- `product-img-STYLE` : ajouter le style CSS dans `boutique.css` avec la couleur ou image souhaitée

Ensuite dans `api/checkout.js`, ajouter l'entrée dans `PRICES` :
```js
'mon-produit': 'price_STRIPE_ID',
```

---

## 7. Modifier les couleurs du site

Dans `style.css`, en haut du fichier, se trouve :
```css
:root {
  --black: #0a0a0a;
  --white: #ffffff;
  --grey-100: #f5f5f5;
  --accent: #1a1a1a;
}
```
Changer ces valeurs change les couleurs de tout le site.
Exemple pour une couleur d'accent bleue : `--accent: #1a56db;`

---

## 8. Ajouter un champ dans le formulaire de devis

Dans `devis.html`, dans la section `Votre projet`, ajouter un bloc :
```html
<div class="form-group">
  <label for="mon-champ">Mon champ</label>
  <input type="text" id="mon-champ" name="mon_champ" placeholder="..." />
</div>
```
Le champ apparaît automatiquement dans l'email Formspree avec le `name` comme libellé.

---

## 9. Déployer une modification

1. Modifier le(s) fichier(s) dans le repo GitHub directement (bouton crayon) OU via Claude Code
2. Commiter sur `main`
3. Vercel redéploie automatiquement en 1–2 minutes
4. Ton site est à jour

---

## 10. Ajouter une nouvelle page

1. Créer `ma-page.html` en copiant la structure de `index.html` (nav + footer)
2. Ajouter le lien dans la nav de toutes les pages existantes :
```html
<li><a href="ma-page.html">Ma page</a></li>
```

---

## 11. Connecter un nom de domaine (frenchrevolve.fr)

Dans Vercel → ton projet → Settings → Domains → ajouter `frenchrevolve.fr`
Vercel te donne deux enregistrements DNS à configurer chez ton registrar (OVH, Gandi, etc.) :
- Un enregistrement `A` pointant vers l'IP Vercel
- Un enregistrement `CNAME` pour `www`

---

## 12. Résumé des placeholders à remplacer

| Fichier | Ce qu'il faut remplacer | Par quoi |
|---|---|---|
| `index.html` | `VOTRE_ID_FORMSPREE` | ID Formspree (contact) |
| `devis.html` | `VOTRE_ID_FORMSPREE` | ID Formspree (devis) |
| `api/checkout.js` | `price_XXXXXXXX_*` | Price IDs Stripe réels |
| `boutique.css` | couleurs `.product-img-*` | Tes vraies images produits |
| `index.html` galerie | `.gallery-thumb` | Tes photos de réalisations |
| `success.html` | URL de base | Ton vrai domaine si différent |
