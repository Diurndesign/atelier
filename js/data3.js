/* Atelier — symbolique des formes, des mots et des nombres */
/* Formes : [nom, svg, sens, usages] */
const FORMES=[
["Cercle",'<circle cx="50" cy="50" r="34"/>',"Unité, infini, communauté, douceur, protection. Pas de début ni de fin : il rassemble.","Logos de réseaux, d'associations, de marques rassurantes ; badges et boutons d'action."],
["Carré",'<rect x="18" y="18" width="64" height="64"/>',"Stabilité, rigueur, ordre, honnêteté. Il est posé, solide, rationnel.","Banques, assurances, architecture, outils ; les grilles et les cadres."],
["Triangle pointe en haut",'<polygon points="50,14 86,82 14,82"/>',"Élévation, ambition, stabilité dynamique, montagne.","Croissance, sport, outdoor, ascension."],
["Triangle pointe en bas",'<polygon points="14,18 86,18 50,86"/>',"Instabilité, attention, danger. En signalisation, il impose de céder le passage.","Avertissements, signalétique ; à utiliser avec prudence."],
["Triangle pointé sur le côté",'<polygon points="22,16 84,50 22,84"/>',"Direction, mouvement, lecture : on le comprend comme « jouer » ou « suivant ».","Boutons lecture, flèches, navigation."],
["Spirale",'<path d="M50 50m0-4a4 4 0 1 1-4 4a10 10 0 0 1 10-10a16 16 0 0 1 16 16a22 22 0 0 1-22 22a28 28 0 0 1-28-28a34 34 0 0 1 34-34" fill="none" stroke-width="7"/>',"Croissance, évolution, temps, hypnose. On la retrouve dans les coquillages et les galaxies.","Bien-être, science, marques d'évolution et de développement."],
["Étoile",'<polygon points="50,12 60,40 90,40 66,58 75,88 50,70 25,88 34,58 10,40 40,40"/>',"Excellence, rêve, célébrité, guide (l'étoile du berger).","Notes et avis, récompenses, spectacle, Noël."],
["Ligne horizontale",'<rect x="10" y="44" width="80" height="12"/>',"Calme, repos, horizon, stabilité.","Mises en page apaisées, paysages, bien-être."],
["Ligne verticale",'<rect x="44" y="10" width="12" height="80"/>',"Force, élévation, dignité, croissance.","Architecture, luxe, institutions ; les formats en hauteur."],
["Diagonale",'<rect x="44" y="6" width="12" height="88" transform="rotate(35 50 50)"/>',"Mouvement, énergie, tension, vitesse.","Sport, musique, affiches militantes (constructivisme)."],
["Courbe",'<path d="M8 66C30 18 70 82 92 34" fill="none" stroke-width="12"/>',"Souplesse, nature, sensualité, accueil.","Cosmétique, alimentation, marques chaleureuses."],
["Angle aigu",'<polyline points="14,82 50,16 86,82" fill="none" stroke-width="12"/>',"Tension, agressivité, technique, précision.","Tech, sport mécanique, metal, univers tranchants."]];

/* Sémiologie : [titre, définition, exemple] */
const SEMIO=[
["Signifiant et signifié","Ferdinand de Saussure distingue la forme du signe (le mot écrit ou prononcé, le dessin) de l'idée qu'il évoque.","Le mot « arbre » et le dessin d'un arbre sont deux signifiants différents pour le même signifié."],
["Dénotation et connotation","La dénotation est le sens littéral ; la connotation, tout ce que le signe évoque en plus. Roland Barthes l'analyse dans « Rhétorique de l'image » (1964).","Une photo de tomates, de pâtes et d'un filet à provisions dénote des courses ; elle connote la fraîcheur et l'« italianité »."],
["Icône, indice, symbole","Pour Charles S. Peirce, une icône ressemble à ce qu'elle désigne, un indice en est la trace, un symbole est une convention qu'il faut apprendre.","Le pictogramme d'avion est une icône, la fumée est l'indice du feu, la colombe est le symbole de la paix."],
["Ancrage et relais","Selon Barthes, le texte peut fixer le sens d'une image (ancrage) ou faire avancer le récit avec elle (relais).","Une légende sous une photo l'ancre ; une bulle de BD est un relais."]];

/* Figures de style : [nom, principe, exemple verbal, traduction visuelle] */
const FIGURES=[
["Métaphore","On remplace une chose par une autre qui lui ressemble.","« Ce café est un réveil. »","Une tasse dessinée en forme de soleil levant."],
["Métonymie","On désigne une chose par un élément qui lui est lié.","« Boire un verre. »","Montrer une raquette pour parler d'un tournoi."],
["Hyperbole","On exagère pour frapper les esprits.","« Le gâteau le plus fondant de l'univers. »","Une part de gâteau géante qui écrase la ville."],
["Antithèse","On oppose deux idées pour les faire ressortir.","« Petit prix, grand voyage. »","Une moitié d'affiche en noir, l'autre en couleur."],
["Oxymore","On associe deux mots contradictoires.","« Une obscure clarté. »","Un soleil noir, une glace brûlante."],
["Jeu de mots","On joue sur le double sens ou la sonorité d'un mot.","« Une boulangerie qui a du pain sur la planche. »","Une image qui illustre le sens littéral d'une expression."],
["Répétition","On répète un mot ou une forme pour créer le rythme et l'insistance.","« Bouger, bouger, bouger. »","Le même pictogramme répété en motif, un seul différent."],
["Allitération","On répète un même son de consonne.","« Fraîcheur, fruits, fondant. »","Répéter une même forme graphique dans tous les éléments."],
["Personnification","On donne des traits humains à un objet ou un animal.","« Ma voiture a besoin de vacances. »","Un objet avec des yeux, une mascotte."],
["Ellipse","On supprime une partie du message : le public complète.","« Vous. Ici. Maintenant. »","Montrer l'avant, pas l'après : le spectateur imagine la suite."],
["Euphémisme","On adoucit une réalité difficile.","« Il nous a quittés. »","Une image symbolique plutôt que littérale pour un sujet grave."],
["Détournement","On reprend un code connu pour lui faire dire autre chose.","Reprendre un proverbe en changeant un mot.","Reprendre la mise en page d'une publicité célèbre pour une cause."]];

/* Univers : [univers, mots qui évoquent, typo, couleurs] */
const UNIVERS=[
["Luxe","exception, maison, savoir-faire, intemporel, signature","Didone ou serif fine, capitales espacées","Noir, blanc, or, beaucoup de vide"],
["Nature & bio","naturel, local, terroir, cueilli, simple","Humaniste, manuaire, serif douce","Verts, beiges, kraft"],
["Tech","intelligent, connecté, rapide, simple, sécurisé","Grotesque ou géométrique","Bleu, blanc, un accent vif"],
["Enfance","jouer, magique, découvrir, grandir","Arrondie, épaisse, manuscrite","Couleurs vives et franches"],
["Sport","dépasser, puissance, vitesse, ensemble","Condensée, grasse, italique","Rouge, noir, jaune fluo"],
["Artisanat","fait main, atelier, depuis…, transmettre","Mécane, script, lettrage","Kraft, crème, couleurs sourdes"],
["Santé","soin, confiance, protéger, accompagner","Humaniste très lisible","Bleus et verts doux, blanc"],
["Culture & festival","vibrer, partager, créer, ensemble","Display expressive, typo-image","Couleurs fortes et contrastées"]];

/* Nombres : [nombre, titre, sens, ailleurs, en design] */
const NOMBRES=[
["0","Le vide","Le rien, le départ, le potentiel. Le zéro comme chiffre a été pensé en Inde puis transmis à l'Europe par les savants arabes.","« Zéro défaut », « partir de zéro ».","L'espace vide d'une composition : il compte autant que les éléments."],
["1","L'unité","Le premier, l'origine, le leader, l'unique.","« Numéro 1 », « le seul et l'unique ».","Un seul message par affiche, un seul point focal."],
["2","La dualité","Le couple, l'opposition, l'équilibre des contraires (jour/nuit, yin/yang).","Le face-à-face, le duel.","Le contraste, le duo de polices, la bichromie."],
["3","L'harmonie","Le chiffre de l'équilibre et de la complétude : début, milieu, fin.","Trinité chrétienne, « jamais deux sans trois ».","Règle des tiers, groupes de trois éléments, trois niveaux de hiérarchie, triade de couleurs."],
["4","La stabilité","Le carré, les quatre saisons, les quatre éléments, les quatre points cardinaux.","En Chine, au Japon et en Corée, il se prononce presque comme le mot « mort » : certains immeubles n'ont pas de 4e étage.","Grilles à 4 colonnes ; attention aux packs de 4 pour l'Asie."],
["5","L'humain","Cinq doigts, cinq sens ; le pentagramme.","Les cinq piliers de l'islam.","La notation sur cinq étoiles."],
["6","L'équilibre naturel","L'hexagone des alvéoles d'abeille, forme la plus efficace de la nature.","L'étoile à six branches (étoile de David).","Motifs en nid d'abeille, pavages."],
["7","La perfection et la chance","Sept jours, sept couleurs de l'arc-en-ciel selon Newton, sept merveilles du monde.","Chiffre porte-bonheur en Occident.","« 7 ± 2 » : selon le psychologue George Miller (1956), on retient environ sept éléments à la fois. Limitez vos menus."],
["8","La prospérité et l'infini","Couché, il devient le symbole de l'infini (∞).","En Chine, il évoque la richesse : les JO de Pékin ont commencé le 08/08/2008 à 20 h 08.","La grille de 8 px, base de nombreux design systems."],
["9","L'accomplissement","Dernier chiffre avant la dizaine ; les neuf muses de la mythologie grecque.","Au Japon, il peut se prononcer comme « souffrance » ; en Chine, il évoque la longévité.","Les prix en 9,99 € : l'œil retient d'abord le chiffre de gauche."],
["10","La totalité","Dix doigts, base du système décimal ; la note parfaite.","Le « top 10 », les dix commandements.","Les classements et listes de dix, très partagés."],
["12","Le cycle complet","Douze mois, douze heures, douze signes du zodiaque.","Les douze travaux d'Hercule, les douze apôtres.","La grille de 12 colonnes : divisible par 2, 3, 4 et 6."],
["13","La superstition","Chiffre maudit en Occident (vendredi 13) ; la peur du 13 s'appelle la triskaïdékaphobie.","En Italie, c'est plutôt le 17 qui porte malheur ; certains hôtels n'ont pas de chambre 13.","À éviter sur un produit destiné à un public superstitieux."],
["24","Le temps","Vingt-quatre heures dans une journée.","—","24 images par seconde : la cadence classique du cinéma."],
["40","L'épreuve","Le temps de l'attente et du passage : le mot « quarantaine » vient de quarante.","Les quarante jours du déluge et du carême ; Venise imposait quarante jours d'isolement aux navires.","—"],
["1,618","Le nombre d'or","Une proportion réputée harmonieuse, présente dans certaines formes naturelles.","Utilisée en architecture et en peinture depuis la Renaissance.","Rapports de taille, grilles, échelles typographiques (rapport 1,618)."],
["60-30-10","La règle des couleurs","Trois proportions pour équilibrer une palette.","—","60 % couleur dominante, 30 % couleur d'appui, 10 % accent."],
["72 / 300","Les résolutions","Deux nombres que tout graphiste connaît.","—","72 (ou 96) ppp à l'écran, 300 dpi pour l'impression."]];
