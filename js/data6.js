/* Atelier — UI / UX, certifications, ArtCraft */

/* UI ou UX ? */
const UIUX=[["UX","L'expérience utilisateur","Est-ce que ça marche pour la personne ? On comprend ses besoins, on organise les contenus, on simplifie les parcours et on teste avec de vrais utilisateurs.",["Recherche et entretiens","Arborescence","Parcours utilisateur","Wireframes","Tests"]],
["UI","L'interface utilisateur","À quoi ça ressemble et comment ça réagit : couleurs, typographie, boutons, icônes, états, animations, cohérence de chaque écran.",["Grille et espacements","Composants","Couleurs et typos","États et animations","Design system"]]];

/* Le double diamant (Design Council, Royaume-Uni) : [phase, verbe, question, méthodes] */
const DIAMANT=[["Découvrir","Comprendre le problème","Qui sont les utilisateurs, que vivent-ils vraiment ?",["Entretiens utilisateurs","Observation sur le terrain","Analyse de la concurrence","Questionnaire","Audit de l'existant"]],
["Définir","Choisir le bon problème","Quel est le problème le plus important à résoudre ?",["Personas","Carte d'empathie","Parcours utilisateur","« Comment pourrions-nous… ? »","Priorisation"]],
["Développer","Imaginer des solutions","Quelles pistes possibles, et laquelle tester ?",["Brainstorming","Crazy 8 (8 idées en 8 minutes)","Tri de cartes","Arborescence","Wireframes et prototypes"]],
["Livrer","Tester et améliorer","La solution fonctionne-t-elle pour de vrai ?",["Tests utilisateurs","Maquettes finales","Design system","Passation aux développeurs","Mesure et itérations"]]];

/* Les livrables UX/UI : [nom, ce que c'est, conseil, illustration] */
const LIVRABLES=[["Persona","Un portrait d'utilisateur type, construit à partir d'entretiens réels : objectifs, frustrations, contexte d'usage.","Basez-le sur de vraies données, pas sur votre imagination : 3 personas suffisent.","persona"],
["Arborescence","Le plan du site ou de l'application : quelles pages, rangées comme quoi, à combien de clics.","Testez-la avec un tri de cartes : les utilisateurs rangent les contenus à leur façon.","tree"],
["Wireframe","Un schéma en niveaux de gris de chaque écran : où vont les contenus et les actions, sans couleur ni décor.","Restez moche exprès : on discute de l'organisation, pas du style.","wire"],
["Maquette","L'écran final, avec la vraie typo, les couleurs, les images et les textes. C'est ici que travaille l'UI.","Mobile first : dessinez le téléphone en premier, puis l'écran large.","mock"],
["Prototype","Des écrans reliés entre eux et cliquables, pour simuler l'application avant de la coder.","Un prototype sert à tester : prévoyez un scénario précis à faire réaliser.","proto"],
["Test utilisateur","On observe 5 personnes réaliser des tâches sur le prototype, sans les aider, et on note où elles bloquent.","Cinq testeurs révèlent déjà la majorité des gros problèmes.","test"],
["Design system","La bibliothèque partagée : couleurs, typos, espacements, composants et règles d'usage, entre designers et développeurs.","Commencez petit : couleurs, typos, boutons et champs de formulaire.","dsys"]];

/* Règles d'interface : [règle, explication, à faire, à éviter] */
const UIRULES=[["Une action principale par écran","Le regard doit trouver tout de suite ce qu'il faut faire. Un seul bouton plein, les autres en contour ou en lien.","Un bouton « Commander » plein, « Retour » en lien.","Trois boutons de même poids côte à côte."],
["Une grille de 8 px","Tous les espacements et tailles sont des multiples de 8 (ou de 4 pour les petits détails) : 8, 16, 24, 32, 48…","Marge de 24, écart de 16 entre les cartes.","Des valeurs au hasard : 13, 17, 22 px."],
["Des boutons qui disent ce qu'ils font","Un verbe d'action, une zone tactile d'au moins 44 px de haut, des états visibles (survol, focus, désactivé).","« Créer mon compte ».","« OK », « Valider », « Cliquez ici »."],
["Des formulaires simples","Une colonne, l'étiquette au-dessus du champ, l'erreur juste sous le champ concerné, le moins de champs possible.","« E-mail » au-dessus du champ, erreur en rouge dessous.","Le texte d'exemple (placeholder) comme seule étiquette."],
["Une typographie d'écran lisible","16 px minimum pour le texte courant, 2 ou 3 tailles en tout, interlignage de 1,4 à 1,6, 60 à 75 caractères par ligne.","Titre 32, sous-titre 20, texte 16.","Huit tailles différentes sur un écran."],
["Des couleurs qui ont un sens","Une couleur d'accent pour les actions, et des couleurs d'état constantes : vert succès, rouge erreur, orange alerte, bleu information.","Rouge réservé aux erreurs et suppressions.","Un bouton « Valider » rouge."],
["Des icônes avec un texte","Seules quelques icônes sont universelles (recherche, menu, fermer). Les autres ont besoin d'un libellé.","Icône + « Partager ».","Une barre d'icônes mystères."],
["Une réponse à chaque action","Chaque clic produit un retour visible : bouton enfoncé, chargement, message de succès ou d'erreur.","« Envoi… » puis « Message envoyé ».","Un clic qui ne change rien à l'écran."],
["Le pouce d'abord","Sur mobile, les actions importantes sont en bas de l'écran, à portée de pouce, avec des zones tactiles larges.","Barre d'onglets en bas sur une appli.","Un petit lien en haut à droite pour l'action principale."],
["La cohérence partout","Le même élément a toujours la même apparence et le même comportement, sur tous les écrans.","Un seul style de bouton principal.","Trois styles de liens différents."]];

/* Design systems publics : [nom, éditeur, url, à voir] */
const DSYS=[["Material Design 3","Google","https://m3.material.io/","Le plus complet : composants, couleurs dynamiques, mouvements."],
["Human Interface Guidelines","Apple","https://developer.apple.com/design/human-interface-guidelines","Les règles pour concevoir sur iPhone, iPad, Mac et montre."],
["Système de Design de l'État","Gouvernement français","https://www.systeme-de-design.gouv.fr/","Un design system public, en français et accessible : un modèle."],
["GOV.UK Design System","Gouvernement britannique","https://design-system.service.gov.uk/","La référence des formulaires simples et accessibles."],
["Carbon","IBM","https://carbondesignsystem.com/","Très bien documenté, idéal pour comprendre les tokens."],
["Fluent 2","Microsoft","https://fluent2.microsoft.design/","Le langage visuel de Windows et Microsoft 365."]];

/* Accessibilité : [règle, explication, comment vérifier] */
const A11Y=[["Assez de contraste","Texte courant : contraste d'au moins 4,5:1 avec le fond. Grands textes et éléments d'interface : 3:1 (WCAG, niveau AA).","Testez vos couleurs dans l'onglet Couleurs › Contraste."],
["Pas d'information par la couleur seule","Un champ en erreur n'est pas seulement rouge : il a aussi une icône et un message.","Regardez votre maquette en niveaux de gris."],
["Des textes alternatifs","Chaque image utile a un attribut alt qui dit ce qu'elle apporte. Une image décorative a un alt vide.","Lisez la page sans les images : comprend-on tout ?"],
["Tout au clavier","On doit pouvoir tout faire avec la touche Tab, Entrée et Échap, avec un focus toujours visible.","Débranchez la souris et parcourez votre site."],
["Des titres dans l'ordre","Un seul h1 par page, puis des h2, h3 sans sauter de niveau : c'est le sommaire des lecteurs d'écran.","Extension HeadingsMap ou outil WAVE."],
["Des formulaires étiquetés","Chaque champ a une étiquette liée (label for) et des erreurs explicites, pas seulement « champ invalide ».","Cliquez sur l'étiquette : le champ doit s'activer."],
["Des cibles assez grandes","Au moins 24 × 24 px (WCAG 2.2), et 44 × 44 px recommandés pour le tactile.","Essayez votre maquette au pouce, sur un vrai téléphone."],
["Des vidéos sous-titrées","Sous-titres pour les vidéos, transcription pour les podcasts, pas de lecture automatique avec le son.","Regardez la vidéo sans le son."],
["Des mouvements maîtrisés","Rien ne clignote plus de 3 fois par seconde, et les animations se calment si l'utilisateur l'a demandé (prefers-reduced-motion).","Activez « réduire les animations » dans votre système."],
["Une langue claire","Langue déclarée (lang=\"fr\"), phrases courtes, liens explicites, pas de texte important dans une image.","Lisez la page à voix haute."]];
const A11Y_TOOLS=[["WAVE","https://wave.webaim.org/","Analyse une page et signale les erreurs d'accessibilité.","EN"],["Vérificateur de contraste WebAIM","https://webaim.org/resources/contrastchecker/","Calcule le rapport de contraste de deux couleurs.","EN"],["RGAA (site officiel)","https://accessibilite.numerique.gouv.fr/","Le référentiel français, ses critères et sa méthode de test.","FR"],["Lighthouse","https://developer.chrome.com/docs/lighthouse/overview","Intégré à Chrome (F12) : audit accessibilité, performance et SEO.","EN"]];

/* UX writing : [règle, à éviter, mieux] */
const UXW=[["Un bouton dit ce qu'il fait","OK","Enregistrer le projet"],
["Parlez comme l'utilisateur","Erreur 403 : accès refusé","Vous n'avez pas accès à cette page. Demandez l'accès à votre responsable."],
["Une erreur explique comment la corriger","Saisie invalide","Le mot de passe doit contenir au moins 8 caractères."],
["L'essentiel en premier","Afin de pouvoir profiter pleinement de nos services, nous vous invitons à confirmer votre adresse.","Confirmez votre adresse e-mail pour continuer."],
["Un écran vide qui aide","Aucune donnée","Aucun projet pour l'instant. Créez votre premier projet."],
["Prévenir avant l'irréversible","Êtes-vous sûr ?","Supprimer « Affiche festival » ? Cette action est définitive."],
["Le même mot partout","Panier, sac, commande pour la même chose","Panier, sur tous les écrans"],
["Rassurer au bon moment","Paiement","Paiement sécurisé · annulation gratuite jusqu'à 48 h avant"]];

/* Certifications : [nom, organisme, domaine, type, coût, ce que c'est, pourquoi, url] */
const CDOM=[["all","Toutes"],["gra","Graphisme & logiciels"],["ux","UI / UX"],["web","Web & développement"],["a11y","Accessibilité & qualité"],["num","Compétences numériques"]];
const CERTS=[
["Adobe Certified Professional","Adobe · Certiport (Pearson VUE)","gra","Examen par logiciel","Payant","Les examens officiels d'Adobe : Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, Express, Acrobat… Deux examens complémentaires donnent une spécialité, par exemple Visual Design (Photoshop + Illustrator ou InDesign).","La certification de l'éditeur, reconnue dans le monde entier.","https://certifiedprofessional.adobe.com/"],
["Tosa Adobe","Isograd","gra","Examen en ligne, score sur 1000","Payant · souvent finançable par le CPF","Un examen d'environ une heure par logiciel (Photoshop, Illustrator, InDesign, Premiere Pro). Le score situe votre niveau. Photoshop + Illustrator ou InDesign donne la certification Graphic Design.","Très répandue en France, pratique pour prouver son niveau sur un CV.","https://www.tosa.org/"],
["Google UX Design Professional Certificate","Google · Coursera","ux","Parcours en ligne de 8 cours","Abonnement Coursera","Environ 6 mois à 10 h par semaine, en anglais : recherche utilisateur, wireframes, prototypes dans Figma, accessibilité et projets pour le portfolio.","Le certificat le plus connu pour débuter en UX.","https://www.coursera.org/professional-certificates/google-ux-design"],
["UX Certification","Nielsen Norman Group","ux","5 cours en direct + 5 examens","Très cher (plusieurs milliers de dollars)","Les cours de la référence mondiale de l'ergonomie, chacun validé par un examen. La certification n'expire pas.","Pour viser des postes UX confirmés ou en grande entreprise.","https://www.nngroup.com/ux-certification/"],
["Certifications Uxcel","Uxcel","ux","Examens en ligne chronométrés","Payant","Des examens UX/UI vérifiables, dont un examen Figma (80 questions en 80 minutes).","Figma n'a pas de certification officielle : c'est une façon de prouver sa maîtrise.","https://certified.uxcel.com/"],
["Titre professionnel Concepteur designer UI","Ministère du Travail","ux","Titre d'État, niveau 6 (bac+3)","Formation ou VAE, finançable","Conception d'interfaces et de supports de communication, design graphique, réalisation et animation de sites web.","Un diplôme reconnu par l'État pour le métier de designer UI.","https://www.francecompetences.fr/recherche/rncp/42140/"],
["freeCodeCamp","freeCodeCamp (association)","web","Projets + examens en ligne","Gratuit","Le parcours Certified Full Stack Developer, découpé en certifications intermédiaires (Responsive Web Design, JavaScript, Python…) validées par des examens.","Le meilleur rapport qualité-prix : zéro euro, des projets concrets.","https://www.freecodecamp.org/learn"],
["Titre professionnel Développeur web et web mobile","Ministère du Travail","web","Titre d'État, niveau 5 (bac+2)","Formation ou VAE, finançable","Maquetter et coder des interfaces, développer le front-end et le back-end de façon sécurisée, en tenant compte de l'accessibilité et du RGPD. Fiche RNCP37674.","Le diplôme de référence pour devenir développeur web en France.","https://www.francecompetences.fr/recherche/rncp/37674/"],
["Certification Opquast «&nbsp;Qualité web&nbsp;»","Opquast","a11y","Formation en ligne + examen","485 € HT (prix public) · CPF","Les bonnes pratiques qualité du web : accessibilité, performance, sécurité, données personnelles, écoconception. Score sur 1000, minimum 600. Un module d'essai gratuit existe.","Très appréciée des agences et des services web en France.","https://www.opquast.com/certification/"],
["IAAP CPACC et WAS","International Association of Accessibility Professionals","a11y","Examens, en anglais","Payant (plusieurs centaines de dollars)","CPACC : les fondamentaux de l'accessibilité. WAS : l'accessibilité technique du web. Les deux ensemble donnent le titre CPWA.","La référence internationale des spécialistes de l'accessibilité.","https://www.accessibilityassociation.org/"],
["Pix","Pix (service public)","num","Test adaptatif en ligne","Évaluation gratuite","16 compétences numériques en 5 domaines, dont la création de contenu : image, vidéo, mise en page, programmation.","Une base reconnue par l'État, utile sur tous les CV.","https://pix.fr/"]];
/* Parcours conseillés : [profil, étapes] */
const PARCOURS=[["Graphiste","Tosa ou Adobe Certified Professional (Photoshop + Illustrator ou InDesign)","Un portfolio sur Behance","Pix pour la base numérique"],
["Designer UI / UX","Google UX Design pour débuter","Titre Concepteur designer UI ou NN/g pour aller plus loin","Opquast en bonus"],
["Intégrateur / développeur web","freeCodeCamp, gratuit, pour pratiquer","Titre professionnel Développeur web et web mobile","Opquast et les bases de l'accessibilité"]];

/* ArtCraft : suite gratuite et open source, encore expérimentale */
const ARTCRAFT=[["PhotoCraft","Photoshop","alpha"],["VectorCraft","Illustrator","en développement"],["DesignCraft","InDesign","en développement"],["FigCraft","Figma","alpha"],["LightCraft","Lightroom","en développement"],["FilmCraft","Premiere Pro","en développement"],["EffectCraft","After Effects","en développement"],["AniCraft","animation 2D","alpha"],["PdfCraft","Acrobat","alpha"]];
const FREEALT={ps:[["PhotoCraft (ArtCraft)","alpha"],["GIMP",""],["Krita",""]],ai:[["VectorCraft (ArtCraft)","en développement"],["Inkscape",""]],id:[["DesignCraft (ArtCraft)","en développement"],["Scribus",""]],fig:[["Figma a une offre gratuite et une offre éducation",""],["FigCraft (ArtCraft)","alpha"],["Penpot",""]]};

/* nouveaux mots */
LEX.push(["Double diamant","Web & UI","Modèle de conception en 4 phases : découvrir, définir, développer, livrer. Deux fois on ouvre les pistes, deux fois on les resserre."],
["Tri de cartes","Web & UI","Exercice où des utilisateurs rangent des contenus en groupes : il aide à construire l'arborescence d'un site."],
["UX writing","Web & UI","L'écriture des textes d'interface : boutons, messages d'erreur, aides. Court, clair, utile."],["Handoff","Web & UI","La passation des maquettes aux développeurs, avec les mesures, les styles et les états de chaque composant."]);
ALT.unshift(["Toute la suite Adobe","ArtCraft","https://getartcraft.com/apps","Gratuit et open source, encore en alpha : pour s'entraîner."]);
