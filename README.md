# Atelier — la boîte à outils du graphiste

Site statique (HTML, CSS, JS, sans build) + Supabase pour les comptes et les favoris.

## En ligne

GitHub Pages : https://diurndesign.github.io/atelier/ (chaque push sur `main` met le site à jour).

## Comptes : le même que les jeux de code

Atelier utilise le projet Firebase **bip-jeux**, comme tous les jeux de code : La maison de Bip (HTML),
Mission Kami (CSS), Kami et les lucioles (Flexbox), Le potager de Kami (Grid), Mission Bip et Bip Agence.
Un élève a donc un seul compte (email + mot de passe) pour les trois sites, et comme
ils sont tous sur `diurndesign.github.io`, se connecter sur l'un connecte sur les autres.

- Favoris : `eleves/{uid}/atelier/favoris` (une chaîne JSON, comme la sauvegarde des jeux)
- « Mon espace » lit aussi `eleves/{uid}/jeux/<id>` pour afficher la progression dans chaque jeu
  (`maison-bip`, `mission-kami`, `kami-lucioles`, `kami-potager`, `mission-bip`, `bip-agence`) : la liste vient de `GAMES` dans `js/data2.js`

Règle Firestore à ajouter (déjà incluse dans les règles proposées par la page admin des jeux) :

```
match /eleves/{uid}/atelier/{doc} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
  allow read: if estFormateur();
}
```

Sans compte, les favoris restent dans le navigateur et sont ajoutés au compte à la connexion.

## Fichiers

- `index.html` : structure des onglets
- `style.css` : styles
- `js/data.js` : contenus (artistes, lexique, symbolique, références, polices)
- `js/app.js` : logique (onglets, comptes, favoris, outils, images Wikimedia Commons)

Pour ajouter un artiste : une ligne dans `WEB`, `GRA`, `ART` ou `DES` de `js/data.js`.
Pour ajouter un mot : une ligne dans `LEX`.
