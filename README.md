# Atelier — la boîte à outils du graphiste

Site statique (HTML, CSS, JS, sans build) + Supabase pour les comptes et les favoris.

## Mettre en ligne (Vercel, 1 minute)

Dans ce dossier :

```
npx vercel --prod
```

Réponds aux questions : nouveau projet, nom `atelier` (ou autre), aucun framework, pas de build.
Vercel donne l'adresse du site, par exemple `https://atelier-xxx.vercel.app`.

## Régler Supabase (projet « atelier », déjà créé)

Dans le tableau de bord Supabase, projet **atelier** :

1. **Authentication → URL Configuration**
   - Site URL : l'adresse Vercel du site
   - Redirect URLs : ajouter la même adresse
   Sans ce réglage, le lien de l'email de confirmation renvoie vers `localhost`.
2. **Authentication → Sign In / Providers → Email**
   - Pour une classe qui s'inscrit en même temps, désactiver « Confirm email »,
     ou configurer un SMTP (Brevo, Resend…) : le service d'email intégré de Supabase
     n'envoie que très peu d'emails par heure.

La base contient une seule table, `favorites`, protégée par RLS :
chaque utilisateur ne lit et n'écrit que ses propres favoris.

## Fichiers

- `index.html` : structure des onglets
- `style.css` : styles
- `js/data.js` : contenus (artistes, lexique, symbolique, références, polices)
- `js/app.js` : logique (onglets, comptes, favoris, outils, images Wikimedia Commons)

Pour ajouter un artiste : une ligne dans `WEB`, `GRA`, `ART` ou `DES` de `js/data.js`.
Pour ajouter un mot : une ligne dans `LEX`.
