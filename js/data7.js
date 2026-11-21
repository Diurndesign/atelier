/* Atelier — IA & droit d'auteur, impression */

/* L'IA dans le travail : [étape, ce que l'IA fait bien, ce qui reste à vous] */
const IA_USES=[["Chercher des idées","Lister des pistes, des mots-clés, des angles, des références à creuser.","Choisir la bonne idée : c'est le cœur du métier."],
["Moodboard","Produire vite des ambiances pour discuter avec le client.","Ne jamais livrer un moodboard IA comme création finale."],
["Retouche","Remplissage génératif, extension d'image, détourage, suppression d'objets.","Vérifier les détails : mains, textes, reflets, logos inventés."],
["Déclinaisons","Adapter un visuel à plusieurs formats, proposer des variantes.","Garder la cohérence de la charte."],
["Textes de maquette","Écrire des textes réalistes à la place du faux texte, des titres, des alt d'images.","Relire et faire valider : l'IA invente des faits."],
["Code","Expliquer une erreur, proposer du HTML/CSS/JS, documenter.","Comprendre chaque ligne avant de la mettre en ligne."]];
const IA_NOT=["Le concept et la direction artistique : l'IA propose, vous décidez.","La cohérence d'une identité sur la durée.","La vérité : une IA peut affirmer des choses fausses avec assurance.","La responsabilité : c'est vous qui signez et livrez."];

/* Outils : [nom, éditeur, usage, droits d'utilisation, url] */
const IA_TOOLS=[["Adobe Firefly","Adobe","Image, remplissage génératif dans Photoshop, effets de texte.","Conçu pour l'usage commercial : entraîné sur Adobe Stock et des contenus libres. Garantie juridique réservée aux contrats entreprise.","https://firefly.adobe.com/"],
["Midjourney","Midjourney","Images très esthétiques, ambiances, concepts.","Usage commercial avec un abonnement payant ; l'essai gratuit est non commercial. Entreprise de plus de 1 M$ de chiffre d'affaires : formule Pro ou Mega.","https://www.midjourney.com/"],
["Ideogram","Ideogram","Images avec du texte lisible : affiches, titres, mises en situation.","Vérifiez les conditions de votre formule.","https://ideogram.ai/"],
["Recraft","Recraft","Illustrations et icônes vectorielles, styles cohérents.","Vérifiez les conditions de votre formule.","https://www.recraft.ai/"],
["Canva IA","Canva","Visuels rapides, redimensionnement, suppression d'arrière-plan.","Vérifiez les conditions de votre formule.","https://www.canva.com/"],
["Figma IA","Figma","Maquettes, renommage des calques, prototypes, textes d'interface.","Selon votre offre Figma.","https://www.figma.com/"],
["Claude","Anthropic","Idées, textes, brief, code, analyse de documents.","Ne collez pas de données confidentielles de vos clients sans leur accord.","https://claude.ai/"],
["ChatGPT et Gemini","OpenAI · Google","Assistants polyvalents : texte, image, code.","Même prudence avec les données des clients.","https://chatgpt.com/"]];

/* Anatomie d'un prompt image : [élément, question, exemple] */
const PROMPT_IMG=[["Sujet","Qu'est-ce qu'on voit ?","une cycliste traversant un pont"],["Contexte","Où, quand, quelle action ?","à l'aube, ville portuaire, brume légère"],["Style","Quel rendu ?","photographie argentique, grain visible"],["Cadrage","Comment c'est composé ?","plan large, sujet au tiers gauche, beaucoup d'espace en haut pour le titre"],["Lumière et couleurs","Quelle ambiance ?","lumière rasante dorée, palette bleu et orange"],["Format","Quel ratio ?","vertical 2:3 (affiche)"],["À éviter","Qu'est-ce qu'on ne veut pas ?","pas de texte, pas de logo"]];
const PROMPT_TXT=["Rôle : « Tu es directeur artistique dans une agence… »","Contexte : le client, la cible, le ton, les contraintes.","Tâche : ce que vous attendez, précisément.","Format : liste, tableau, 3 propositions, 50 mots maximum…","Exemples : montrez ce que vous aimez (et ce que vous n'aimez pas).","Itérez : « plus court », « plus sobre », « garde la 2 et développe-la »."];
const PROMPT_RULES=["Pas de nom d'artiste vivant, de marque ou de personne réelle : décrivez le style avec vos mots (« aplats francs, contour épais, couleurs primaires »).","Une idée par prompt : mieux vaut 5 essais simples qu'un prompt fourre-tout.","Notez vos prompts : ils font partie de votre méthode et prouvent votre apport créatif."];

/* Livrer avec l'IA : [règle, explication] */
const IA_LIVRER=[["Prévenez le client","Dites ce qui a été fait avec l'IA. Beaucoup de clients l'exigent désormais dans leurs contrats."],
["Vérifiez les conditions de l'outil","Certaines formules gratuites interdisent l'usage commercial. Gardez une capture des conditions au moment du projet."],
["Pas de logo 100 % IA","Un contenu entièrement généré par une IA ne peut, en principe, pas être protégé par le droit d'auteur : votre client ne pourrait pas défendre son logo. Dessinez-le vous-même."],
["Retravaillez vraiment","Plus vos choix créatifs sont nombreux et visibles (composition, retouche, typographie, mise en page), plus l'œuvre finale est la vôtre."],
["Signalez les images réalistes","Depuis le 2 août 2026, le règlement européen sur l'IA (AI Act) impose de signaler les images, vidéos ou sons générés par IA qui pourraient passer pour réels (hypertrucages)."],
["Protégez les données","Ne mettez pas de documents confidentiels, de photos de personnes ou de données clients dans un outil public sans accord."],
["Gardez des traces","Prompts, versions, fichiers sources : en cas de litige, ils montrent votre travail."]];

/* Droit d'auteur : [titre, texte] */
const DROIT=[["Automatique","En France, une création est protégée dès qu'elle existe, si elle est originale (elle porte l'empreinte de la personnalité de son auteur). Pas besoin de dépôt : gardez seulement des preuves datées (fichiers, e-mails, enveloppe Soleau)."],
["70 ans","Les droits durent toute la vie de l'auteur, puis 70 ans après sa mort. Ensuite, l'œuvre entre dans le domaine public : on peut l'utiliser librement, en respectant le nom de l'auteur."],
["Droits moraux","Le droit au nom, au respect de l'œuvre, de divulgation… Ils sont perpétuels et ne se vendent pas : un client ne peut pas vous les acheter."],
["Droits patrimoniaux","Reproduire et diffuser l'œuvre. Eux se cèdent, et doivent se payer : c'est la cession de droits."],
["La cession par écrit","Une cession doit être écrite et préciser chaque droit cédé, le domaine (supports), le lieu, la durée. Une cession floue ou « de tous les droits pour toujours » est fragile. Indiquez-la sur le devis."],
["Payer une création ≠ l'acheter","Sans cession écrite, le client paie le travail mais n'obtient pas automatiquement le droit d'utiliser le logo partout et pour toujours."],
["S'inspirer, pas copier","Les idées et les styles sont libres ; la forme précise d'une œuvre ne l'est pas. Reprendre une composition, un personnage ou une illustration reconnaissable est de la contrefaçon."],
["Et l'IA ?","La règle reste la même : pas de protection sans choix créatifs humains. Le Parlement européen a affirmé en mars 2026 qu'un contenu entièrement généré par l'IA ne devrait pas être protégé, et un tribunal allemand a refusé la même année la protection à des logos créés par IA à partir de simples prompts."]];

/* Licences : [type, ce qu'on peut faire, piège] */
const LIC_FONTS=[["Google Fonts (licence SIL OFL)","Usage libre, y compris commercial : print, web, logo, application.","Ne revendez pas la police elle-même."],
["« Free for personal use »","Uniquement pour un usage personnel, non commercial.","Pour un client, il faut acheter la licence commerciale."],
["Licence desktop","Installer la police sur un ordinateur pour créer des fichiers (print, images).","Ne couvre pas toujours le web, les applis ou les e-books."],
["Licence web","Intégrer la police dans un site avec @font-face.","Souvent limitée en nombre de visites par mois."],
["Adobe Fonts","Utilisable tant que l'abonnement Creative Cloud est actif, y compris pour des projets clients.","Le client ne peut pas installer la police sans son propre abonnement."],
["Police dans un logo","Vectorisez le texte du logo : le fichier livré ne contient plus la police.","Vérifiez que la licence autorise l'usage dans un logo."]];
const LIC_CC=[["CC0","Aucune condition : domaine public volontaire.","#0a6b2f"],["CC BY","Libre, même commercial, en citant l'auteur.","#1f3fd1"],["CC BY-SA","Comme BY, et vos modifications doivent garder la même licence.","#1f3fd1"],["CC BY-NC","Pas d'usage commercial : à éviter pour un client.","#e4002b"],["CC BY-ND","Pas de modification : pas de recadrage, de retouche ou de montage.","#e4002b"]];
const LIC_IMG=[["Banques gratuites","Unsplash, Pexels… : usage commercial possible selon leur licence, mais pas de garantie juridique et pas de droit à l'image des personnes vérifié.","Pour une campagne, préférez une banque payante."],
["Banques payantes","Adobe Stock, Shutterstock… : licence standard pour la plupart des usages ; licence étendue pour les gros tirages et les produits à vendre (t-shirts, mugs).","Achetez la licence au nom du client ou indiquez-la sur le devis."],
["Droit à l'image","Une personne reconnaissable doit avoir donné son autorisation écrite pour un usage commercial.","Vaut aussi pour une photo prise dans la rue."],
["Marques et logos","On ne peut pas utiliser la marque ou le logo d'un autre pour vendre son produit, ni l'imiter.","Vérifiez qu'un nom de marque est libre sur data.inpi.fr."],
["« Libre de droits »","Veut dire qu'on paie une fois pour plusieurs usages, pas que c'est gratuit ni sans conditions.","Lisez toujours la licence."]];

/* ---------- impression ---------- */
const PR_FILE=[["Fond perdu","3 mm de plus sur chaque côté : les images et aplats qui touchent le bord doivent déborder.","Sinon : un filet blanc au massicot."],
["Zone de sécurité","Gardez textes et logos à au moins 3 à 5 mm du bord de coupe.","Sinon : un texte coupé."],
["300 dpi","Les images doivent faire 300 ppp à la taille réelle d'impression (150 à 200 suffisent pour une grande affiche vue de loin).","Sinon : une image floue ou pixellisée."],
["CMJN et profil","Convertissez en CMJN avec le profil demandé par l'imprimeur (souvent PSO Coated v3 ou Coated FOGRA39 pour le papier couché).","Sinon : des couleurs ternes ou décalées."],
["Le noir","Textes en noir 100 % (C0 M0 J0 N100). Grands aplats en noir enrichi, par exemple C40 M30 J30 N100.","Sinon : un noir grisâtre, ou un texte flou s'il est en 4 couleurs."],
["Encrage total","La somme C+M+J+N ne doit pas dépasser environ 300 % (moins sur papier non couché).","Sinon : l'encre ne sèche pas, les pages collent."],
["Polices","Incorporées dans le PDF ou vectorisées.","Sinon : une police remplacée par une autre."],
["PDF/X","Exportez en PDF/X-1a ou PDF/X-4, avec traits de coupe et fond perdu.","Le format standard de l'imprimerie."]];
const PAPIERS=[[80,"Papier de photocopie, courrier"],[115,"Flyer économique, pages de magazine"],[135,"Flyer, dépliant, affiche intérieure"],[170,"Affiche, flyer épais, couverture souple"],[250,"Carte postale, couverture de brochure"],[350,"Carte de visite, carton d'invitation"]];
const PAPIER_TYPES=[["Couché brillant","Couleurs éclatantes, photos nettes, reflets.","Flyers, catalogues, photos."],["Couché satiné / demi-mat","Le compromis : couleurs vives, peu de reflets, lisible.","Brochures, magazines, le choix le plus courant."],["Couché mat","Élégant, sans reflet, couleurs plus douces.","Rapports, papeterie haut de gamme."],["Offset (non couché)","Le papier qui absorbe l'encre : on peut écrire dessus, couleurs moins vives.","Papier à en-tête, livres, carnets."],["Recyclé","Aspect plus naturel, parfois légèrement gris ou moucheté.","Communication éco-responsable."],["Papiers de création","Textures, couleurs teintées dans la masse, vergé, kraft.","Identités soignées, faire-part, cartes de visite."]];
/* Finitions : [nom, à quoi ça sert, illustration] */
const FINITIONS=[["Pelliculage","Un film mat, brillant ou « soft touch » (toucher velours) qui protège et donne un rendu haut de gamme.","pellic"],
["Vernis sélectif","Un vernis brillant, parfois en relief, seulement sur certaines zones : logo, titre, motif.","vernis"],
["Dorure à chaud","Une feuille métallique (or, argent, cuivre, couleurs) pressée à chaud sur une partie du visuel.","dorure"],
["Gaufrage","Un relief en bosse (embossage) ou en creux (débossage) obtenu en pressant le papier.","gaufr"],
["Découpe à la forme","Une découpe sur mesure : forme spéciale, fenêtre, coins arrondis.","decoupe"],
["Rainage et pliage","Le rainage marque le pli pour éviter que le papier épais ne casse.","pli"]];
const PLIS=[["Pli simple","1 pli, 4 pages","simple"],["Pli roulé","2 plis, 6 volets qui s'emboîtent","roule"],["Pli accordéon","2 plis en zigzag, 6 volets","accord"],["Pli fenêtre","2 volets qui se referment au centre","fenetre"]];
const RELIURES=[["Piqûre à cheval","Agrafes dans le pli. Pour les magazines et brochures fines (nombre de pages multiple de 4)."],["Dos carré collé","Couverture collée sur un dos plat. Pour les livres et catalogues épais."],["Spirale ou Wire-O","Le document s'ouvre à plat. Pour les carnets, calendriers, documents de travail."],["Cousu","Cahiers cousus : solide et durable, pour les beaux livres."]];
const BAT=["Orthographe, chiffres, dates, numéros de téléphone, adresses web.","Couleurs : comparez avec une épreuve couleur, pas avec votre écran.","Coupes : rien d'important dans la zone de sécurité, le fond perdu est présent.","Pagination, ordre des pages, plis dans le bon sens.","Images en haute définition, aucune image manquante.","QR codes et liens testés.","Logos et mentions légales à jour."];
const OFFSET=[["Numérique","Petites quantités (jusqu'à quelques centaines d'exemplaires), délais courts, chaque exemplaire peut être différent (personnalisation).","Prix par exemplaire assez stable."],["Offset","Grandes quantités, qualité et couleurs très régulières, encres Pantone et papiers spéciaux possibles.","Coût de départ élevé (plaques), mais prix par exemplaire très bas sur de gros tirages."]];
const DEVIS_PRINT=`Bonjour,

Pourriez-vous me faire un devis pour :

- Produit : (flyer, affiche, brochure…)
- Quantité : (ex. 500 / 1 000 / 2 000)
- Format fini : (ex. A5, 148 × 210 mm) — format ouvert si plié :
- Nombre de pages : (pour une brochure, multiple de 4)
- Impression : quadri recto / quadri recto-verso / Pantone
- Papier : (ex. couché satiné 135 g, couverture 300 g)
- Finitions : (pelliculage mat, vernis sélectif, dorure…)
- Façonnage : (pli roulé, piqûre à cheval, coins arrondis…)
- Fichiers : PDF/X fournis avec fond perdu 3 mm, BAT souhaité
- Livraison : (adresse) — date souhaitée :

Merci d'avance,`;
