/* Atelier — onglet Méthode : Gestalt, UX, interfaces, formats, mise en ligne, projet, métier */
/* Gestalt : [nom, principe, en pratique, svg] */
const GESTALT=[
["Proximité","Les éléments proches sont perçus comme un groupe.","Rapprochez un titre de son texte, éloignez les blocs qui n'ont rien à voir. L'espace suffit souvent à remplacer un cadre.",'<g fill="currentColor"><circle cx="14" cy="20" r="6"/><circle cx="30" cy="20" r="6"/><circle cx="14" cy="36" r="6"/><circle cx="30" cy="36" r="6"/><circle cx="66" cy="20" r="6"/><circle cx="82" cy="20" r="6"/><circle cx="66" cy="36" r="6"/><circle cx="82" cy="36" r="6"/></g>'],
["Similarité","Les éléments qui se ressemblent (forme, couleur, taille) sont perçus comme liés.","Tous les liens de la même couleur, tous les boutons principaux du même style : l'utilisateur comprend sans lire.",'<g><circle cx="14" cy="16" r="6" fill="currentColor"/><circle cx="34" cy="16" r="6" fill="#e4002b"/><circle cx="54" cy="16" r="6" fill="currentColor"/><circle cx="74" cy="16" r="6" fill="#e4002b"/><circle cx="14" cy="40" r="6" fill="currentColor"/><circle cx="34" cy="40" r="6" fill="#e4002b"/><circle cx="54" cy="40" r="6" fill="currentColor"/><circle cx="74" cy="40" r="6" fill="#e4002b"/></g>'],
["Continuité","L'œil suit les lignes et les courbes plutôt que les changements brusques.","Alignez les éléments sur un même axe ; un carrousel coupé au bord de l'écran invite à faire défiler.",'<path d="M6 46C30 46 40 10 90 10" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="2 8" stroke-linecap="round"/>'],
["Clôture","Le cerveau complète les formes incomplètes.","Un logo peut se contenter de quelques traits : le public reconstruit la forme (et la retient mieux).",'<g fill="none" stroke="currentColor" stroke-width="6"><path d="M30 8A20 20 0 0 0 30 48"/><path d="M38 48A20 20 0 0 0 38 8" stroke-dasharray="10 9"/></g><polygon points="62,46 78,12 94,46" fill="none" stroke="currentColor" stroke-width="6" stroke-dasharray="16 10"/>'],
["Figure et fond","On distingue toujours un sujet (la figure) de ce qui l'entoure (le fond).","Assurez un contraste net entre le contenu et son fond ; l'espace négatif peut cacher une seconde image.",'<rect x="6" y="6" width="88" height="44" fill="currentColor"/><path d="M30 6c0 12 12 10 12 22S30 38 30 50h40c0-12-12-10-12-22s12-10 12-22Z" style="fill:var(--bg)"/>'],
["Région commune","Les éléments placés dans une même zone (cadre, fond coloré) sont perçus comme un groupe.","Les cartes d'interface : chaque fond regroupe une image, un titre et un bouton.",'<rect x="4" y="8" width="42" height="40" rx="8" fill="none" stroke="#e4002b" stroke-width="3"/><g fill="currentColor"><circle cx="16" cy="28" r="6"/><circle cx="34" cy="28" r="6"/><circle cx="58" cy="28" r="6"/><circle cx="76" cy="28" r="6"/><circle cx="92" cy="28" r="4"/></g>'],
["Destin commun","Les éléments qui bougent ensemble dans la même direction sont perçus comme un groupe.","Animez ensemble ce qui va ensemble : un menu qui s'ouvre d'un bloc, des cartes qui apparaissent en cascade.",'<g fill="currentColor"><circle cx="14" cy="38" r="6"/><circle cx="32" cy="38" r="6"/><circle cx="62" cy="38" r="6"/><circle cx="80" cy="38" r="6"/></g><g stroke="#e4002b" stroke-width="3" fill="none"><path d="M23 28V8M17 14l6-6 6 6"/><path d="M58 22h34M86 16l6 6-6 6"/></g>']];

/* Heuristiques de Nielsen (1994) : [nom, explication, exemple] */
const HEUR=[
["Visibilité de l'état du système","L'utilisateur doit toujours savoir ce qui se passe.","Barre de progression, message « Enregistré », bouton qui passe en « Envoi… »."],
["Correspondance avec le monde réel","Parler la langue de l'utilisateur, pas celle du développeur.","« Panier » plutôt que « Session d'achat » ; une icône de corbeille pour supprimer."],
["Contrôle et liberté","Prévoir une sortie de secours : annuler, revenir, fermer.","Bouton « Annuler », croix de fermeture visible, « Annuler l'envoi » dans une messagerie."],
["Cohérence et standards","Un même mot, une même action, un même style partout.","Le logo en haut à gauche ramène à l'accueil ; le panier en haut à droite."],
["Prévention des erreurs","Mieux vaut empêcher l'erreur que bien l'expliquer.","Désactiver « Payer » tant que le formulaire est incomplet ; demander confirmation avant de supprimer."],
["Reconnaître plutôt que se souvenir","Montrer les options plutôt que demander de s'en souvenir.","Recherches récentes, menus visibles, champs pré-remplis."],
["Flexibilité et efficacité","Des raccourcis pour les habitués, sans gêner les débutants.","Raccourcis clavier, favoris, filtres enregistrés."],
["Esthétique et design minimaliste","Chaque élément en trop fait concurrence à l'information utile.","Une page d'accueil avec un seul message principal et un seul bouton d'action fort."],
["Aider à corriger les erreurs","Un message d'erreur clair, poli, qui propose une solution.","« Ce mot de passe doit faire 8 caractères » plutôt que « Erreur 422 »."],
["Aide et documentation","Si une aide est nécessaire, elle doit être facile à trouver et concrète.","Infobulles, FAQ, exemples dans les champs (« ex. 06 12 34 56 78 »)."]];

/* Lois et effets UX : [nom, principe, en pratique] */
const LOIS=[
["Loi de Fitts","Plus une cible est grande et proche, plus on l'atteint vite.","Gros boutons d'action, zones cliquables généreuses, actions importantes à portée du pouce sur mobile."],
["Loi de Hick","Plus il y a de choix, plus on met de temps à décider.","Limitez les options d'un menu, mettez en avant un choix recommandé."],
["Loi de Jakob","Les gens passent la plupart de leur temps sur d'autres sites : ils s'attendent à ce que le vôtre marche pareil.","Respectez les conventions (menu, panier, logo cliquable) avant d'innover."],
["Loi de Miller","La mémoire de travail retient environ 7 éléments (± 2).","Découpez l'information en groupes : numéro de téléphone en paires, formulaire en étapes."],
["Effet de position sérielle","On retient mieux le premier et le dernier élément d'une liste.","Placez les liens les plus importants au début et à la fin de la navigation."],
["Effet Von Restorff","L'élément différent des autres est celui qu'on remarque et qu'on retient.","Une seule couleur vive pour le bouton principal, l'offre recommandée mise en valeur."],
["Effet Zeigarnik","On se souvient mieux d'une tâche inachevée.","Barres de progression de profil, « encore 2 étapes » : on a envie de terminer."],
["Règle pic-fin","On juge une expérience surtout sur son moment le plus intense et sur sa fin.","Soignez la confirmation de commande, le message de réussite, le dernier écran."],
["Effet esthétique-utilisabilité","Un design beau est perçu comme plus facile à utiliser.","Le soin visuel rend les utilisateurs plus indulgents, mais ne remplace pas l'ergonomie."],
["Loi de Tesler","Toute interface contient une complexité qu'on ne peut pas supprimer, seulement déplacer.","Mieux vaut que le site gère la complexité (calcul automatique) que l'utilisateur."],
["Seuil de Doherty","Au-delà d'environ 400 millisecondes, l'attente casse le rythme de l'utilisateur.","Retour visuel immédiat, animation de chargement, contenu affiché progressivement."]];

/* Interfaces : repères chiffrés : [sujet, valeur, détail] */
const UIREP=[
["Taille tactile","44 × 44 px","Minimum recommandé par Apple (48 × 48 dp chez Google Material). Les WCAG 2.2 fixent un minimum de 24 × 24 px."],
["Texte courant","16 px","En dessous, le texte devient pénible à lire sur mobile et iOS zoome dans les champs de formulaire."],
["Longueur de ligne","45 à 75 caractères","Au-delà, l'œil se perd en revenant à la ligne."],
["Grille d'espacement","8 px","Espacements multiples de 4 ou 8 : 4, 8, 16, 24, 32, 48, 64. Le rythme devient régulier."],
["Points de rupture","360 · 768 · 1024 · 1280+","Mobile, tablette, petit portable, bureau. Concevez à partir du contenu, pas d'un appareil précis."],
["Contraste du texte","4,5:1","Minimum WCAG AA pour le texte courant, 3:1 pour les gros titres et les icônes."],
["Temps d'animation","150 à 300 ms","Assez long pour être vu, assez court pour ne pas ralentir. Respectez « réduire les animations »."],
["Grille de colonnes","4 · 8 · 12","4 colonnes sur mobile, 8 sur tablette, 12 sur bureau."]];
/* États d'un composant : [état, rôle] */
const ETATS=[["Par défaut","L'aspect normal, au repos."],["Survol","Au passage de la souris : il réagit, il est cliquable."],["Focus","Sélectionné au clavier : contour bien visible, obligatoire pour l'accessibilité."],["Actif / pressé","Pendant le clic : un léger enfoncement confirme l'action."],["Désactivé","Indisponible : grisé, mais toujours lisible, avec la raison si possible."],["Chargement","L'action est en cours : spinner ou texte « Envoi… », bouton bloqué."],["Erreur","Bordure et message d'erreur près du champ, jamais la couleur seule."],["Succès","Confirmation claire : coche, message, couleur."],["Vide","Rien à afficher : expliquer pourquoi et proposer une action (empty state)."]];

/* Formats : [support, dimensions, remarque] */
const FMT_SOCIAL=[
["Instagram post carré","1080 × 1080 px","Format historique, toujours sûr."],
["Instagram post portrait","1080 × 1350 px","Ratio 4:5, prend le plus de place dans le fil."],
["Story / Reel / TikTok","1080 × 1920 px","Ratio 9:16 ; gardez le texte loin des bords haut et bas."],
["Miniature YouTube","1280 × 720 px","Ratio 16:9, lisible en tout petit."],
["Image de partage (Open Graph)","1200 × 630 px","L'aperçu d'un lien partagé (LinkedIn, Facebook, messageries)."],
["Post LinkedIn (image)","1200 × 627 px","Proche du format Open Graph."],
["Vidéo HD / Full HD","1920 × 1080 px","16:9 ; 25 images/s en Europe, 24 pour un rendu cinéma."]];
const FMT_WEB=[
["Favicon","32 × 32 px (et SVG)","Plus un apple-touch-icon de 180 × 180 px pour les écrans d'accueil iPhone."],
["Image plein écran (hero)","1920 px de large","En WebP ou AVIF, idéalement sous 300 Ko."],
["Écrans haute densité","× 2","Une image affichée à 600 px doit faire 1200 px de large pour rester nette."],
["Logo sur le web","SVG","Net à toutes les tailles, très léger, modifiable en CSS."]];
const FMT_FILES=[
["JPEG","Photos","Léger, sans transparence, perd de la qualité à chaque enregistrement."],
["PNG","Captures, transparence","Sans perte, mais lourd pour les photos."],
["WebP / AVIF","Images web modernes","Bien plus légers que JPEG et PNG, transparence possible."],
["SVG","Logos, icônes, illustrations","Vectoriel : net à toutes les tailles, modifiable en code."],
["PDF","Documents, BAT","Fige la mise en page ; en PDF/X pour l'imprimeur."],
["AI / EPS","Fichiers sources vectoriels","À livrer au client avec le logo, en plus des versions PNG et SVG."],
["PSD / TIFF","Images retouchées en haute qualité","Gardent les calques (PSD) ou la qualité maximale (TIFF) pour le print."],
["GIF / MP4","Animations","Le MP4 est bien plus léger qu'un GIF à qualité égale."]];

/* Check-list de mise en ligne : [groupe, [éléments]] */
const CHECK=[
["Contenu et référencement",["Un titre <title> unique par page (environ 60 caractères)","Une meta description par page (environ 155 caractères)","Un seul h1 par page, puis h2 et h3 dans l'ordre","Un texte alternatif (alt) sur chaque image utile","Des adresses de pages lisibles (/contact, /projets)","Un fichier sitemap.xml et un robots.txt","Des balises Open Graph avec une image de 1200 × 630 px","Un favicon et un apple-touch-icon"]],
["Responsive et performance",["Testé à 360, 768 et 1280 px de large","Images compressées en WebP ou AVIF (Squoosh)","Chargement différé des images (loading=\"lazy\")","Deux familles de polices maximum, avec font-display: swap","Score PageSpeed Insights vérifié sur mobile"]],
["Accessibilité",["Contraste d'au moins 4,5:1 pour le texte","Navigation possible au clavier, focus visible","Un label pour chaque champ de formulaire","Attribut lang=\"fr\" sur la balise html","Des liens explicites (pas de « cliquez ici »)","Aucune information donnée par la couleur seule","Vérifié avec WAVE"]],
["Obligations légales (France)",["Page de mentions légales : éditeur du site et hébergeur","Politique de confidentialité si le site collecte des données (RGPD)","Bandeau de consentement si cookies ou traceurs non essentiels","Conditions générales de vente pour un site marchand"]],
["Avant de livrer",["Tous les liens et formulaires testés","Une page 404 personnalisée","Le site est en HTTPS","HTML validé (W3C Validator)","Le projet est sauvegardé sur GitHub","Les accès et identifiants sont transmis au client"]]];

/* Projet : étapes [titre, ce qu'on fait, livrable] */
const ETAPES=[
["Le brief","Écouter le client et reformuler sa demande par écrit.","Un brief validé : objectifs, cible, contraintes, délais, budget."],
["Recherche et veille","Étudier le secteur, les concurrents, les usages : le benchmark.","Un document de recherche et de références."],
["Moodboard","Rassembler images, couleurs, typos et matières pour fixer une ambiance.","Une ou deux planches d'ambiance à valider."],
["Pistes créatives","Explorer plusieurs directions (souvent trois) avant d'en choisir une.","Des pistes présentées avec leurs intentions."],
["Présentation","Montrer en situation (mockups) et argumenter chaque choix.","Une présentation claire, du problème à la solution."],
["Allers-retours","Intégrer les retours, dans la limite prévue au devis.","Des versions numérotées (V1, V2…)."],
["Finalisation","Préparer tous les fichiers et formats, rédiger la charte si besoin.","Fichiers sources, exports, charte graphique."],
["Livraison et bilan","Livrer, facturer, demander un retour, ajouter le projet au portfolio.","Facture, étude de cas pour le portfolio."]];
const ETAPES_WEB=["Arborescence (plan du site)","Wireframes (zonings)","Maquettes mobile puis bureau","Prototype cliquable","Développement","Recette (tests et corrections)","Mise en ligne","Suivi et maintenance"];
const BRIEF=["Qui est le client, que fait-il, quelles sont ses valeurs ?","Quel problème doit-on résoudre ? Pourquoi maintenant ?","Qui est la cible ? Que sait-elle, qu'attend-elle ?","Quel est le message principal, en une phrase ?","Quel ton : sérieux, chaleureux, décalé, premium ?","Qui sont les concurrents ? Qu'est-ce qui doit nous distinguer ?","Existe-t-il une charte, un logo, des contraintes à respecter ?","Quels supports et formats sont attendus ?","Quels sont le budget et les délais ?","Comment saura-t-on que le projet est réussi ?"];

/* Métier : [titre, contenu] */
const METIER=[
["Les statuts","Un graphiste peut relever du régime des artistes-auteurs (création d'œuvres et cession de droits) ou de la micro-entreprise (prestations de service). Un développeur ou intégrateur web relève en général de la micro-entreprise. Le bon choix dépend de votre activité réelle : renseignez-vous auprès de l'Urssaf."],
["Le devis","Il précise : vos coordonnées et celles du client, la date, la description détaillée de chaque prestation, les prix hors taxes, la TVA ou la mention « TVA non applicable, article 293 B du CGI » en franchise, la durée de validité, les conditions de paiement, le nombre d'allers-retours inclus et les droits cédés."],
["Les droits d'auteur","Le créateur reste titulaire de ses droits : le client n'obtient que ce qui lui est cédé par écrit. La cession doit préciser chaque droit cédé, les supports, le territoire et la durée (article L131-3 du Code de la propriété intellectuelle). Le droit moral, comme le droit d'être cité comme auteur, ne se cède jamais."],
["Se faire payer","Un acompte (souvent 30 à 50 %) avant de commencer protège des projets abandonnés. Entre professionnels, la facture mentionne les pénalités de retard et l'indemnité forfaitaire de 40 € pour frais de recouvrement."],
["Fixer son prix","Partez de ce que vous voulez gagner, ajoutez vos charges et vos outils, et divisez par les jours réellement facturables (souvent 120 à 150 par an en indépendant) : vous obtenez votre tarif jour (TJM)."],
["Le portfolio","Mieux vaut 6 à 10 projets choisis que 30 projets moyens. Pour chacun : le contexte, le problème, votre démarche, la solution en situation (mockups) et le résultat."]];

LEX.push(
["Gestalt","Mise en page","Théorie de la perception née en Allemagne au début du XXe siècle : le cerveau regroupe ce qu'il voit selon des lois (proximité, similarité, clôture…)."],
["Affordance","Web & UI","Capacité d'un objet à suggérer son usage : un bouton qui a l'air cliquable, une poignée qui invite à tirer."],
["Heuristique","Web & UI","Règle générale pour évaluer une interface, comme les 10 heuristiques d'utilisabilité de Jakob Nielsen."],
["Loi de Fitts","Web & UI","Plus une cible est grande et proche, plus elle est rapide à atteindre."],
["Loi de Hick","Web & UI","Plus il y a de choix, plus la décision prend du temps."],
["Benchmark","Identité","Étude des concurrents et des références d'un secteur avant de créer."],
["Arborescence","Web & UI","Plan d'un site : la liste des pages et leur organisation hiérarchique."],
["Zoning","Web & UI","Croquis très simple qui répartit les grandes zones d'une page avant le wireframe."],
["Recette","Web & UI","Phase de tests d'un site ou d'une application avant la mise en ligne."],
["Empty state","Web & UI","Écran affiché quand il n'y a pas encore de contenu : il explique et propose une action."],
["Skeleton screen","Web & UI","Silhouette grise du contenu affichée pendant le chargement, plus rassurante qu'un simple spinner."],
["A/B test","Web & UI","Comparaison de deux versions d'une page auprès de deux groupes d'utilisateurs pour garder la plus efficace."],
["SEO","Web & UI","Référencement naturel : tout ce qui aide un site à bien apparaître dans les moteurs de recherche."],
["Open Graph","Web & UI","Balises qui définissent le titre, le texte et l'image affichés quand on partage un lien."],
["RGAA","Web & UI","Référentiel général d'amélioration de l'accessibilité : la norme française, fondée sur les WCAG."],
["RGPD","Web & UI","Règlement européen sur la protection des données personnelles (2018)."],
["Mentions légales","Web & UI","Page obligatoire d'un site professionnel en France : identité de l'éditeur et de l'hébergeur."],
["Cession de droits","Identité","Contrat par lequel l'auteur autorise un client à exploiter son œuvre, pour des usages, un territoire et une durée précis."],
["TJM","Identité","Taux journalier moyen : le prix d'une journée de travail d'un indépendant."],
["Case study","Identité","Étude de cas : présentation d'un projet qui raconte le contexte, la démarche et le résultat."]);
