export interface SeedQuestion {
  countryCode: string;
  licenseCode: string | null;
  courseId: string | null;
  question: string;
  options: string;
  correctIndex: number;
  explanation: string;
  difficulty: string;
  category: string;
  theme: string | null;
  tags: string | null;
  reference: string | null;
  hasImage: boolean;
}

// Helper
const O = (arr: string[]) => JSON.stringify(arr);
const T = (arr: string[]) => JSON.stringify(arr);

export const seedQuestions: SeedQuestion[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 1. SIGNALISATION — 80 questions
  // ═══════════════════════════════════════════════════════════════════

  // --- Danger signs (20) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Que signifie un panneau triangulaire rouge bordé de blanc avec un symbole de virage?",
    options: O(["Un virage dangereux à gauche", "Un virage dangereux à droite", "Une intersection dangereuse", "Un changement de direction obligatoire"]),
    correctIndex: 0,
    explanation: "Le panneau triangulaire rouge bordé de blanc est un panneau de danger. Il annonce un virage dangereux dont la direction est indiquée par le symbole. Le conducteur doit adapter sa vitesse et sa trajectoire en conséquence (Article R411-3 du Code de la route).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "virage", "panneau triangulaire"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un symbole de descente raide indique:",
    options: O(["Une descente avec une forte pente", "Une montée avec une forte pente", "Un ralentisseur", "Une zone de travaux"]),
    correctIndex: 0,
    explanation: "Le panneau de danger avec le symbole de descente raide signale une pente descendante importante. Le pourcentage indiqué correspond à la pente moyenne. Le conducteur doit réduire sa vitesse et utiliser le frein moteur (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "descente", "pente"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À quelle distance approximative un panneau de danger est-il implanté en agglomération?",
    options: O(["Environ 50 mètres", "Environ 200 mètres", "Environ 500 mètres", "À l'endroit même du danger"]),
    correctIndex: 0,
    explanation: "En agglomération, les panneaux de danger sont implantés à environ 50 mètres du danger signalé. Hors agglomération, la distance est d'environ 200 mètres, et sur autoroute jusqu'à 500 mètres (Instruction interministérielle sur la signalisation routière).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "implantation", "distance"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un symbole de chaussée glissante vous informe que:",
    options: O(["La route peut être glissante par temps de pluie ou de verglas", "La route est toujours glissante", "Il est interdit de rouler", "La vitesse est limitée à 30 km/h"]),
    correctIndex: 0,
    explanation: "Le panneau de chaussée glissante avertit que la route peut devenir dangereuse en raison de conditions météorologiques. Le conducteur doit adapter sa vitesse et augmenter les distances de sécurité (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "glissance", "météo"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Que signifie un panneau triangulaire rouge avec le symbole d'enfants?",
    options: O(["Une zone fréquentée par des enfants", "Une école à proximité", "Un parc de jeux", "Un arrêt de bus scolaire"]),
    correctIndex: 0,
    explanation: "Le panneau d'avertissement avec le symbole d'enfants signale un endroit fréquemment emprunté par des enfants. Le conducteur doit redoubler de vigilance et adapter sa vitesse. Souvent accompagné d'une limitation à 30 km/h (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "enfants", "prudence"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire avec un symbole de passage à niveau sans barrière indique:",
    options: O(["Un passage à niveau non gardé", "Un passage à niveau gardé", "Un pont ferroviaire", "Une gare à proximité"]),
    correctIndex: 0,
    explanation: "Le panneau triangulaire rouge avec le symbole de passage à niveau signale un croisement avec des voies ferrées. Sans barrières, le passage est non gardé : le conducteur doit s'assurer qu'aucun train n'approche avant de s'engager (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "passage à niveau", "train"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec le symbole d'un embâcle de pierres indique:",
    options: O(["Un risque de chute de pierres", "Une zone pavée", "Un chantier de construction", "Des travaux de maçonnerie"]),
    correctIndex: 0,
    explanation: "Le panneau d'embâcle de pierres signale une zone où des pierres ou rochers peuvent chuter sur la chaussée, fréquent en zone montagneuse. Le conducteur doit rouler prudemment et ne pas s'arrêter dans cette zone (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "pierres", "montagne"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Que signifie un panneau triangulaire rouge avec le symbole d'un pont étroit?",
    options: O(["La largeur du pont est réduite", "Le pont est interdit aux véhicules lourds", "Le pont est en travaux", "Un péage est à payer"]),
    correctIndex: 0,
    explanation: "Le panneau de pont étroit signale que la largeur de la chaussée est réduite. Le conducteur doit vérifier que son véhicule peut traverser en sécurité. La priorité peut être réglée par un signal spécifique (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "pont étroit", "largeur"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un symbole de tronçon à virages successifs indique:",
    options: O(["Une succession de virages dangereux", "Un seul virage serré", "Un rond-point", "Un croisement"]),
    correctIndex: 0,
    explanation: "Le panneau de virages successifs avertit d'une série de virages rapprochés. Le conducteur doit réduire sa vitesse avant le premier virage et maintenir une allure modérée car la visibilité peut être réduite (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "virages successifs", "prudence"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge barré d'une croix rouge (croix de Saint-André) signifie:",
    options: O(["La fin d'un danger signalé par un panneau précédent", "Un danger permanent", "Un passage à niveau", "Une zone de détresse"]),
    correctIndex: 0,
    explanation: "Le panneau triangulaire barré d'une croix rouge est un panneau de fin de prescription. Il indique la fin du danger signalé précédemment. Le conducteur peut reprendre une allure normale (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "fin de prescription", "croix"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire avec le symbole de cycliste indique:",
    options: O(["Un lieu fréquenté par des cyclistes", "Une piste cyclable obligatoire", "Une interdiction aux cyclistes", "Un stationnement pour vélos"]),
    correctIndex: 0,
    explanation: "Le panneau d'avertissement avec un cycliste signale un endroit où des cyclistes sont susceptibles de traverser. Le conducteur doit redoubler de vigilance et respecter une distance latérale minimale d'un mètre en agglomération (Article R411-3 et R414-4).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "cycliste", "attention"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec le symbole d'animaux sauvages vous avertit de:",
    options: O(["Un risque de présence d'animaux sur la chaussée", "D'une réserve naturelle", "D'un parc animalier", "D'une interdiction de chasser"]),
    correctIndex: 0,
    explanation: "Le panneau d'animaux sauvages signale une zone où des animaux peuvent traverser la route, surtout à l'aube et au crépuscule. Le conducteur doit adapter sa vitesse et être prêt à freiner (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "animaux", "traversée"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire avec le symbole de vent latéral signifie:",
    options: O(["Des rafales de vent pouvant déporter le véhicule", "Une zone de tornade", "La présence d'un ventilateur", "L'obligation d'ouvrir les fenêtres"]),
    correctIndex: 0,
    explanation: "Le panneau de vent latéral signale des rafales pouvant déstabiliser le véhicule, particulièrement les véhicules hauts. Le conducteur doit réduire sa vitesse et bien tenir le volant (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "vent", "météo"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec le symbole de deux voitures se croisant indique:",
    options: O(["Un risque de congestion ou un rétrécissement", "Une zone de rencontre", "Un parking disponible", "Un sens interdit"]),
    correctIndex: 0,
    explanation: "Le panneau avec deux véhicules se croisant signale une zone de circulation difficile due à un rétrécissement, des travaux ou une forte affluence. Le conducteur doit faire preuve de prudence et de courtoisie (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "congestion", "circulation"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec le symbole de neige ou verglas signifie:",
    options: O(["Un risque de chute de neige ou de formation de verglas", "La route est fermée à cause de la neige", "Un équipement de neige est obligatoire", "Les pneus hiver sont obligatoires"]),
    correctIndex: 0,
    explanation: "Le panneau de neige ou verglas signale des conditions hivernales dangereuses. Le conducteur doit réduire sa vitesse, augmenter les distances de sécurité et s'équiper si nécessaire. Les équipements spéciaux peuvent être obligatoires selon un arrêté préfectoral (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "neige", "verglas", "hiver"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Que signifie un panneau triangulaire avec un symbole de rabattement de circulation?",
    options: O(["Une réduction du nombre de voies de circulation", "Un changement obligatoire de direction", "Une zone pédestre", "Un arrêt obligatoire"]),
    correctIndex: 0,
    explanation: "Le panneau de rabattement signale une réduction du nombre de voies. Les conducteurs doivent se rabattre à temps sur la voie ouverte, en utilisant le clignotant et en facilitant l'insertion des autres véhicules (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "rabattement", "voie"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec le symbole d'un tunnel indique:",
    options: O(["L'entrée d'un tunnel", "La sortie d'un tunnel", "Un passage souterrain interdit", "Une galerie marchande"]),
    correctIndex: 0,
    explanation: "Le panneau de tunnel signale l'entrée imminente d'un tunnel. Le conducteur doit allumer ses feux, retirer ses lunettes de soleil et adapter sa vitesse. Dans le tunnel, il est interdit de s'arrêter, de faire demi-tour et de reculer (Article R411-3 et R412-2).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "tunnel", "feux obligatoires"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un panneau complémentaire indiquant une distance annonce:",
    options: O(["Que le danger se trouve à la distance indiquée", "Que la vitesse est limitée à cette distance", "Qu'il y a un péage à cette distance", "Qu'une zone de repos est à cette distance"]),
    correctIndex: 0,
    explanation: "Le panneau complémentaire sous un panneau de danger et indiquant une distance informe le conducteur de la distance à laquelle le danger se trouve. Cette information permet d'adapter sa vitesse et d'anticiper la manœuvre nécessaire (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "distance", "panneau complémentaire"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un symbole de danger aérien signifie:",
    options: O(["Un risque de survol bas d'aéronefs", "Un aéroport à proximité", "Une zone interdite aux avions", "Un passage à niveau aérien"]),
    correctIndex: 0,
    explanation: "Le panneau de danger aérien signale une zone sous une trajectoire d'approche ou de décollage d'aéronefs. Le bruit peut surprendre le conducteur. Ce panneau invite à la prudence sans imposer de règle de circulation spécifique (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "aérien", "avion", "aérodrome"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau triangulaire rouge avec un symbole en forme de queue de poisson indique:",
    options: O(["Un rétrécissement progressif de la chaussée", "Un passage pour poissons", "Un virage en forme de S", "Une zone de baignade"]),
    correctIndex: 0,
    explanation: "Le panneau de rétrécissement en forme de queue de poisson signale que la chaussée se rétrécit progressivement. Le conducteur doit mettre le clignotant, vérifier ses rétroviseurs et s'insérer en alternance avec les véhicules de la voie qui disparaît (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de danger",
    tags: T(["danger", "rétrécissement", "voies"]), reference: "R411-3", hasImage: false
  },

  // --- Interdiction signs (20) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond avec une barre rouge diagonale signifie:",
    options: O(["Une interdiction", "Une obligation", "Une recommandation", "Une information"]),
    correctIndex: 0,
    explanation: "Les panneaux circulaires avec fond blanc, bord rouge et barre diagonale rouge sont des panneaux d'interdiction. La barre diagonale rouge est toujours inclinée de haut en bas et de gauche à droite (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "panneau rond", "barre rouge"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond rouge avec une barre blanche horizontale signifie:",
    options: O(["L'interdiction de circuler dans les deux sens", "Un sens unique", "Une obligation de s'arrêter", "Une zone de 30 km/h"]),
    correctIndex: 0,
    explanation: "Le panneau rond rouge avec barre blanche horizontale interdit à tout véhicule de pénétrer dans la voie. Le non-respect est sanctionné par une amende forfaitaire (Article R411-3 et R412-32).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "circulation", "sens interdit"]), reference: "R412-32", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond avec le symbole d'un véhicule et la mention « 3,5t » signifie:",
    options: O(["L'interdiction pour les véhicules de plus de 3,5 tonnes", "La limitation de vitesse à 3,5 km/h", "Une obligation de pesée", "Un péage de 3,5 euros"]),
    correctIndex: 0,
    explanation: "Le panneau avec la mention « 3,5t » interdit le passage aux véhicules dont le PTAC dépasse 3,5 tonnes. Les véhicules de tourisme ordinaires ne sont généralement pas concernés (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "poids lourds", "3,5t"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond rouge avec un trait rouge circulaire et une barre blanche diagonale interdit:",
    options: O(["Tous les véhicules à moteur", "Les vélos uniquement", "Les piétons", "Les camions"]),
    correctIndex: 0,
    explanation: "Ce panneau interdit la circulation pour tous les véhicules à moteur. Les piétons, cyclistes et véhicules non motorisés peuvent continuer à circuler (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "véhicules", "circulation interdite"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction de dépasser (deux véhicules, l'un rouge, avec barre rouge diagonale) s'applique:",
    options: O(["Aux véhicules à moteur dépassant d'autres véhicules à moteur", "Aux cyclistes uniquement", "Aux piétons", "Aux animaux de trait"]),
    correctIndex: 0,
    explanation: "Le panneau d'interdiction de dépasser s'applique aux véhicules à moteur dépassant d'autres véhicules à moteur. Il n'interdit pas le dépassement de cyclistes, de piétons ou de véhicules à l'arrêt (Article R414-4).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "dépassement", "dangereux"]), reference: "R414-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une barre rouge diagonale barrant un symbole signifie:",
    options: O(["La fin d'une obligation précédente", "Une nouvelle obligation", "Une information touristique", "Une zone de repos"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une barre rouge diagonale est un panneau de fin d'obligation. Il indique la fin d'une prescription signalée par un panneau rond bleu, et le conducteur retrouve sa liberté de manœuvre (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "fin d'obligation", "panneau bleu"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction de tourner à gauche (flèche gauche barrée) signifie:",
    options: O(["Il est interdit de tourner à gauche à cette intersection", "Il est obligatoire de tourner à gauche", "Un rond-point à gauche", "Un dépassement interdit"]),
    correctIndex: 0,
    explanation: "Le panneau avec la barre rouge diagonale et une flèche à gauche interdit le virage à gauche. Le non-respect est sanctionné par une amende de 4ème classe et un retrait d'un point (Article R412-7).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "virage gauche", "intersection"]), reference: "R412-7", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond avec une interdiction de klaxon signifie:",
    options: O(["L'utilisation de l'avertisseur sonore est interdite", "La radio doit être coupée", "Les fenêtres doivent être fermées", "Le moteur doit être coupé"]),
    correctIndex: 0,
    explanation: "Ce panneau interdit l'utilisation de l'avertisseur sonore, sauf en cas de danger immédiat. Il est implanté près des hôpitaux, écoles et zones résidentielles (Article R416-4).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "klaxon", "bruit"]), reference: "R416-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction avec un symbole de bicyclette barré signifie:",
    options: O(["Les cyclistes ne sont pas autorisés à circuler", "Les cyclistes doivent rouler sur le trottoir", "Les vélos doivent être rangés", "Une piste cyclable est à proximité"]),
    correctIndex: 0,
    explanation: "Le panneau avec un vélo barré d'une barre rouge interdit la circulation des cycles sur cette voie. Les cyclistes doivent emprunter un autre itinéraire, souvent une piste cyclable (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "cycliste", "vélo"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le panneau « STOP » (octogonal rouge avec l'inscription STOP) signifie:",
    options: O(["L'obligation absolue de s'arrêter", "Un ralentissement à 30 km/h", "Une interdiction de stationner", "Une zone de danger"]),
    correctIndex: 0,
    explanation: "Le panneau STOP impose l'arrêt absolu avant la ligne d'arrêt. Le conducteur doit marquer un temps d'arrêt suffisant pour vérifier que la voie est libre. Le non-respect est puni d'une amende et d'un retrait de 3 points (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["STOP", "arrêt obligatoire", "octogonal"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec un « P » barré signifie:",
    options: O(["Le stationnement est interdit, l'arrêt reste autorisé", "L'arrêt et le stationnement sont interdits", "Le stationnement est payant", "Le stationnement est limité à 2 heures"]),
    correctIndex: 0,
    explanation: "Le panneau avec un « P » barré d'une barre rouge signifie que le stationnement est interdit. L'arrêt reste autorisé s'il est bref et que le conducteur reste à proximité immédiate du véhicule (Article R417-1).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "stationnement", "arrêt autorisé"]), reference: "R417-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec deux barres rouges en croix signifie:",
    options: O(["L'arrêt et le stationnement sont interdits", "Un passage piéton", "Une zone de 20 km/h", "Un hôpital"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une croix rouge est le panneau d'interdiction d'arrêt et de stationnement. L'arrêt même bref est interdit. Il est utilisé près des passages à niveau, virages, ponts étroits, tunnels (Article R417-2).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "arrêt", "stationnement", "croix rouge"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction de demi-tour signifie:",
    options: O(["Il est interdit de faire demi-tour à cet endroit", "Il est obligatoire de faire demi-tour", "Un parking en demi-cercle", "Un sens giratoire"]),
    correctIndex: 0,
    explanation: "Le panneau avec une flèche en U barrée interdit de faire demi-tour, pour des raisons de sécurité : visibilité insuffisante, trafic dense ou configuration dangereuse de la route (Article R412-7).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "demi-tour", "manœuvre"]), reference: "R412-7", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond rouge avec une vitesse barrée signifie:",
    options: O(["La fin d'une limitation de vitesse", "Une nouvelle limitation de vitesse", "Un radar automatique", "Une zone dangereuse"]),
    correctIndex: 0,
    explanation: "Le panneau rond à bord rouge avec un chiffre barré d'une barre noire signifie la fin d'une limitation de vitesse. Le conducteur retrouve la vitesse par défaut applicable sur ce type de route (Article R413-5).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "fin de limitation", "vitesse"]), reference: "R413-5", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction avec la mention « 7,5t » interdit le passage aux véhicules de PTAC supérieur à:",
    options: O(["7,5 tonnes", "3,5 tonnes", "10 tonnes", "5 tonnes"]),
    correctIndex: 0,
    explanation: "Le panneau avec « 7,5t » interdit les véhicules de PTAC supérieur à 7,5 tonnes. Les véhicules de tourisme (PTAC inférieur à 3,5 tonnes) ne sont pas concernés (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "poids lourds", "PTAC", "7,5t"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond avec un piéton barré signifie:",
    options: O(["La circulation des piétons est interdite sur cette voie", "Les piétons doivent courir", "Les piétons ont la priorité", "Une zone de rencontre"]),
    correctIndex: 0,
    explanation: "Le panneau avec un piéton barré interdit la circulation des piétons. Il est utilisé sur les voies rapides, autoroutes et tunnels où la présence de piétons serait dangereuse (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "piétons", "circulation"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau d'interdiction d'accès aux véhicules transportant des marchandises dangereuses signifie:",
    options: O(["Les véhicules TMD ne peuvent pas circuler", "Tous les camions sont interdits", "Le transport de passagers est interdit", "Les réservoirs d'eau sont interdits"]),
    correctIndex: 0,
    explanation: "Ce panneau interdit le passage aux véhicules transportant des marchandises dangereuses (TMD), identifiés par des panneaux orange rectangulaires. Il protège les zones sensibles (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "marchandises dangereuses", "TMD"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré avec un rond rouge barré sur fond blanc signifie:",
    options: O(["Une fin d'interdiction ou de prescription", "Une nouvelle interdiction", "Une obligation", "Un danger"]),
    correctIndex: 0,
    explanation: "Un panneau carré à fond blanc contenant un cercle barré signifie la fin d'une interdiction. Le conducteur retrouve la liberté de manœuvre ou la vitesse par défaut de la route (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'interdiction",
    tags: T(["interdiction", "fin de prescription", "carré blanc"]), reference: "R411-3", hasImage: false
  },

  // --- Obligation signs (15) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré bleu avec un cercle impose:",
    options: O(["Une obligation de comportement ou de direction", "Une interdiction", "Un avertissement de danger", "Une information touristique"]),
    correctIndex: 0,
    explanation: "Les panneaux carrés bleus avec un cercle blanc et un symbole noir sont des panneaux d'obligation. Ils imposent un comportement spécifique : obligation de tourner, de suivre une direction, etc. (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "panneau bleu", "carré"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une flèche blanche dirigée vers le haut impose:",
    options: O(["L'obligation d'aller tout droit", "Un sens unique", "Une priorité", "Un dépassement autorisé"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une flèche vers le haut impose au conducteur de continuer tout droit. Il ne doit ni tourner à gauche, ni tourner à droite (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "tout droit", "flèche"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec le symbole d'un vélo impose:",
    options: O(["L'obligation d'utiliser la piste cyclable", "Une interdiction pour les vélos", "Un avertissement pour les cyclistes", "Un parking pour vélos"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec un vélo impose l'utilisation de la piste cyclable. Un panneau carré bleu avec un vélo indique une piste cyclable recommandée (Article R110-2).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "piste cyclable", "vélo"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec le symbole de neige impose:",
    options: O(["L'obligation d'équiper son véhicule de pneus neige ou de chaînes", "L'interdiction de rouler en hiver", "Un avertissement de verglas", "La fermeture de la route"]),
    correctIndex: 0,
    explanation: "Ce panneau impose l'utilisation d'équipements spéciaux : pneus neige, pneus à crampons ou chaînes. Un panneau complémentaire précise l'équipement requis (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "neige", "chaînes", "pneus hiver"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré bleu avec le symbole d'une piste cyclable indique:",
    options: O(["Une piste cyclable réservée aux cycles", "Une obligation de rouler à vélo", "Une interdiction de circuler", "Une zone de stationnement pour vélos"]),
    correctIndex: 0,
    explanation: "Le panneau carré bleu avec un vélo indique une piste ou bande cyclable réservée exclusivement aux cycles. Les automobilistes ne doivent ni circuler ni stationner dessus (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "piste cyclable", "aménagement"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une flèche courbée vers la droite impose:",
    options: O(["L'obligation de tourner à droite", "Un virage dangereux à droite", "Une recommandation de tourner", "Un dépassement à droite"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une flèche courbée vers la droite impose au conducteur de tourner à droite. Ce n'est pas une simple recommandation mais une obligation (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "tourner droite", "flèche"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu imposant le sens de circulation (flèche) dans une rue signifie:",
    options: O(["Que la rue est à sens unique dans la direction indiquée", "Que le dépassement est interdit", "Que la vitesse est limitée", "Que le stationnement est interdit"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une flèche signale une rue à sens unique. Circuler en sens inverse constitue une infraction grave, sanctionnée par une amende et un retrait de points (Article R412-32).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "sens unique", "circulation"]), reference: "R412-32", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une flèche blanche tournée vers la gauche impose:",
    options: O(["L'obligation de tourner à gauche", "Une recommandation de tourner à gauche", "Un danger à gauche", "Une interdiction de tourner à gauche"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une flèche courbée vers la gauche impose au conducteur de tourner à gauche. Il ne peut pas aller tout droit ni tourner à droite (Article R411-3).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "tourner gauche", "flèche"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau bleu rectangulaire avec un symbole est-il un panneau d'obligation?",
    options: O(["Non, c'est un panneau d'information", "Oui, toujours", "Oui, uniquement la nuit", "Oui, pour les piétons uniquement"]),
    correctIndex: 0,
    explanation: "Les panneaux rectangulaires bleus sont des panneaux d'indication ou de repérage. Les obligations se présentent exclusivement sous forme de panneaux ronds bleus (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "information", "rectangulaire bleu"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu imposant l'allumage des feux existe-t-il en France?",
    options: O(["Oui, dans les tunnels et certaines zones", "Non, l'allumage des feux est toujours libre", "Oui, uniquement la nuit", "Non, seuls les feux de détresse sont obligatoires"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec le symbole de phare impose l'allumage des feux de croisement, jour comme nuit. Ce panneau est obligatoire dans les tunnels (Article R412-2).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "feux", "tunnel", "jour"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le panneau d'obligation de tourner avec un complémentaire « sauf riverains » signifie:",
    options: O(["Seuls les riverains peuvent aller tout droit", "Tous les véhicules doivent tourner", "Seuls les poids lourds tournent", "Les vélos sont exemptés"]),
    correctIndex: 0,
    explanation: "La mention « sauf riverains » signifie que l'obligation de tourner ne s'applique pas aux habitants de la zone qui doivent pouvoir accéder à leur domicile (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "riverains", "exception"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec deux flèches noires divergentes signifie:",
    options: O(["L'obligation de contourner un obstacle par la gauche ou la droite", "Un danger de déviation", "Une interdiction de tourner", "Une zone de travaux"]),
    correctIndex: 0,
    explanation: "Les deux flèches divergentes imposent au conducteur de contourner un obstacle par la gauche ou la droite, au choix. Ce panneau est utilisé en cas de travaux ou d'obstacle (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "contournement", "flèches divergentes"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré bleu avec une flèche blanche sur fond de route indique:",
    options: O(["Une direction obligatoire à suivre", "Un dépassement obligatoire", "Une zone de travaux", "Un sens interdit"]),
    correctIndex: 0,
    explanation: "Ce panneau d'indication de direction obligatoire indique au conducteur qu'il doit suivre la direction indiquée, souvent dans des carrefours complexes (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "direction", "carrefour"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les panneaux d'obligation concernent-ils les piétons?",
    options: O(["Oui, certains panneaux s'appliquent aussi aux piétons", "Non, ils ne concernent que les véhicules", "Uniquement dans les zones piétonnes", "Uniquement la nuit"]),
    correctIndex: 0,
    explanation: "Certains panneaux d'obligation s'appliquent aux piétons, comme l'obligation d'emprunter un cheminement piétonnier spécifique. Le piéton doit respecter la signalisation qui le concerne (Article R411-3).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "piétons", "signalisation"]), reference: "R411-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une flèche descendant signifie:",
    options: O(["L'obligation de suivre cette direction spécifique", "Une pente dangereuse", "Un ralentisseur", "Un tunnel"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une flèche pointant vers le bas impose au conducteur de suivre cette direction. Il est utilisé dans les carrefours dénivelés ou les échangeurs (Article R411-3).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux d'obligation",
    tags: T(["obligation", "direction", "flèche bas"]), reference: "R411-3", hasImage: false
  },

  // --- Priority signs (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré avec un losange jaune indique:",
    options: O(["Une route prioritaire", "Une zone de 30 km/h", "Un panneau de danger", "Un passage piéton"]),
    correctIndex: 0,
    explanation: "Le panneau carré jaune avec un losange signale une route prioritaire. Le conducteur bénéficie de la priorité aux intersections, sauf signalisation contraire (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "route prioritaire", "losange"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le panneau cédez-le-passage (triangle rouge inversé bordé de blanc) impose:",
    options: O(["De céder le passage aux véhicules sur la route prioritaire", "De s'arrêter obligatoirement", "De ralentir à 30 km/h", "De faire demi-tour"]),
    correctIndex: 0,
    explanation: "Le cédez-le-passage impose de céder le passage aux véhicules sur la route prioritaire. L'arrêt n'est pas obligatoire si la voie est libre, mais en cas de doute, il est préférable de s'arrêter (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "cédez-le-passage", "triangle"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau carré bleu avec un losange barré signifie:",
    options: O(["La fin d'une route prioritaire", "Le début d'une route prioritaire", "Un danger", "Une interdiction"]),
    correctIndex: 0,
    explanation: "Le panneau carré barré signale la fin de la route prioritaire. À partir de ce panneau, le conducteur perd la priorité et doit céder le passage aux autres véhicules (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "fin de route prioritaire", "losange barré"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau de priorité ponctuelle (carré avec triangle jaune) signifie:",
    options: O(["Vous avez la priorité à cette intersection", "Vous devez céder le passage", "Un virage prioritaire", "Une zone dangereuse"]),
    correctIndex: 0,
    explanation: "Le panneau carré bleu avec un triangle jaune est un panneau de priorité ponctuelle qui s'applique uniquement à l'intersection immédiate, pas aux suivantes (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "priorité ponctuelle", "intersection"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une intersection avec un panneau « STOP », le conducteur doit:",
    options: O(["S'arrêter obligatoirement avant la ligne d'arrêt", "Ralentir sans s'arrêter si la voie est libre", "Accélérer pour traverser rapidement", "Klaxonner pour prévenir"]),
    correctIndex: 0,
    explanation: "Le panneau STOP impose un arrêt complet. Les roues doivent cesser de tourner. Le conducteur vérifie ensuite que la voie est libre avant de s'engager (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "STOP", "arrêt obligatoire"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau de priorité aux véhicules venant d'en face (flèches tête-bêche) indique:",
    options: O(["Que les véhicules venant d'enface ont la priorité", "Que vous avez la priorité", "Un sens interdit", "Un danger"]),
    correctIndex: 0,
    explanation: "Ce panneau indique que les véhicules en sens inverse ont la priorité, généralement dans les zones de rétrécissement ou passages étroits (Article R415-1).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "sens inverse", "rétrécissement"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le panneau carré bleu avec des flèches circulaires indique:",
    options: O(["Un carrefour à sens giratoire", "Un parking circulaire", "Un rond-point sans priorité", "Une zone de détresse"]),
    correctIndex: 0,
    explanation: "Ce panneau signale un carrefour à sens giratoire. Les véhicules dans l'anneau sont prioritaires sur ceux qui s'insèrent (Article R415-1 et R412-15).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "giratoire", "rond-point"]), reference: "R412-15", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En l'absence de tout panneau de priorité, quelle règle s'applique?",
    options: O(["La priorité à droite", "La priorité au véhicule le plus gros", "La priorité au véhicule le plus rapide", "La priorité à celui qui klaxonne"]),
    correctIndex: 0,
    explanation: "Sans signalisation, la priorité à droite s'applique. Le conducteur venant de la droite est prioritaire (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "droite", "règle générale"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un cédez-le-passage avec un complémentaire « tous les sens » signifie:",
    options: O(["Vous devez céder le passage aux véhicules de toutes les directions", "Vous avez la priorité dans tous les sens", "Un parking dans tous les sens", "Un giratoire"]),
    correctIndex: 0,
    explanation: "Ce panneau signifie céder le passage à tous les véhicules venant de toutes les directions à l'intersection. Le conducteur doit être particulièrement vigilant (Article R415-1).",
    difficulty: "hard", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "tous les sens", "cédez-le-passage"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau prioritaire avec rappel indique que:",
    options: O(["La route reste prioritaire jusqu'au panneau de fin", "La priorité est temporaire", "La priorité va changer bientôt", "Un danger est imminent"]),
    correctIndex: 0,
    explanation: "Le rappel du panneau de route prioritaire confirme que la priorité se maintient. Elle ne prend fin qu'au panneau de fin de route prioritaire (Article R415-1).",
    difficulty: "medium", category: "Signalisation", theme: "Panneaux de priorité",
    tags: T(["priorité", "rappel", "route prioritaire"]), reference: "R415-1", hasImage: false
  },

  // --- Traffic lights (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu orange fixe signifie:",
    options: O(["L'arrêt immédiat si cela peut se faire en sécurité", "Accélérer pour passer avant le rouge", "Ralentir modérément", "Le feu va passer au vert"]),
    correctIndex: 0,
    explanation: "Le feu orange fixe annonce le feu rouge. Le conducteur doit s'arrêter, sauf s'il est trop proche et qu'un freinage brusque serait dangereux (Article R412-30).",
    difficulty: "easy", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "orange", "arrêt"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu rouge fixe impose:",
    options: O(["L'arrêt obligatoire avant la ligne d'arrêt", "Le ralentissement sans arrêt", "Le demi-tour obligatoire", "Le passage avec prudence"]),
    correctIndex: 0,
    explanation: "Le feu rouge impose l'arrêt obligatoire avant la ligne. Le franchissement est une infraction grave punie d'une amende de 4ème classe, d'un retrait de 4 points et éventuellement d'une suspension de permis (Article R412-30).",
    difficulty: "easy", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "rouge", "arrêt obligatoire"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu vert signifie:",
    options: O(["Le passage est autorisé", "Le passage est interdit", "L'arrêt est obligatoire", "Le dépassement est autorisé"]),
    correctIndex: 0,
    explanation: "Le feu vert autorise le passage mais ne dispense pas de prudence. Le conducteur doit céder le passage aux véhicules non dégagés et aux piétons (Article R412-30).",
    difficulty: "easy", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "vert", "passage autorisé"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu orange clignotant signifie:",
    options: O(["Le conducteur peut passer avec prudence", "L'arrêt est obligatoire", "Un danger imminent", "La fermeture de la route"]),
    correctIndex: 0,
    explanation: "Le feu orange clignotant autorise le passage avec prudence. Le conducteur doit adapter sa vitesse et céder le passage aux autres usagers (Article R412-30).",
    difficulty: "easy", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "orange clignotant", "prudence"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu rouge clignotant signifie:",
    options: O(["L'arrêt obligatoire avant le feu", "Le passage avec prudence", "Un accident à proximité", "Le feu est en panne"]),
    correctIndex: 0,
    explanation: "Le feu rouge clignotant impose l'arrêt obligatoire, comme un panneau STOP. Il est utilisé en cas de panne ou hors des heures de pointe (Article R412-30).",
    difficulty: "easy", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "rouge clignotant", "arrêt"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une flèche verte sur un feu tricolore signifie:",
    options: O(["Le passage est autorisé uniquement dans la direction indiquée", "Toutes les directions sont autorisées", "Un sens interdit", "Un danger dans cette direction"]),
    correctIndex: 0,
    explanation: "La flèche verte autorise le passage uniquement dans la direction indiquée. Le conducteur ne peut pas tourner dans une autre direction (Article R412-30).",
    difficulty: "medium", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "flèche verte", "direction"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu clignotant orange à un passage piéton signifie pour les véhicules:",
    options: O(["Ils peuvent passer mais doivent céder le passage aux piétons", "Les piétons sont interdits", "L'arrêt est obligatoire", "Le passage piéton est supprimé"]),
    correctIndex: 0,
    explanation: "Quand le feu piéton clignote ou est éteint, les véhicules peuvent passer mais doivent céder le passage aux piétons encore sur le passage (Article R412-30).",
    difficulty: "medium", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "piéton", "clignotant"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu vert pour les cyclistes (avec symbole vélo) signifie:",
    options: O(["Les cyclistes peuvent passer, les autres doivent rester à l'arrêt", "Tous les véhicules peuvent passer", "Les cyclistes doivent s'arrêter", "Une piste cyclable est ouverte"]),
    correctIndex: 0,
    explanation: "Un feu dédié aux cyclistes autorise uniquement les cyclistes à passer. Les automobilistes doivent attendre leur propre feu vert (Article R412-30).",
    difficulty: "medium", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "cycliste", "feu vélo"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu tricolore en panne (éteint) est assimilé à:",
    options: O(["Un cédez-le-passage ou STOP selon la signalisation", "Un feu vert", "Une zone interdite", "Un panneau de danger"]),
    correctIndex: 0,
    explanation: "En cas de panne totale, le conducteur applique les règles de priorité classiques. Si un STOP ou cédez-le-passage est présent, il le respecte. Sinon, la priorité à droite s'applique (Article R412-30 et R415-1).",
    difficulty: "hard", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "panne", "priorité", "cédez-le-passage"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un feu de régulation de vitesse (radar) sert à:",
    options: O(["Réguler le flux de circulation", "Mesurer la vitesse pour verbaliser", "Compter les véhicules", "Indiquer l'heure"]),
    correctIndex: 0,
    explanation: "Certains feux sont équipés de radars de régulation. Le feu passe au vert plus rapidement si le conducteur approche à une vitesse appropriée (Article R412-30).",
    difficulty: "hard", category: "Signalisation", theme: "Feux tricolores",
    tags: T(["feu", "radar", "régulation", "vitesse"]), reference: "R412-30", hasImage: false
  },

  // --- Road markings (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une ligne blanche continue signifie:",
    options: O(["Qu'il est interdit de franchir ou de chevaucher la ligne", "Que le franchissement est autorisé", "Un marquage temporaire", "Une zone de stationnement"]),
    correctIndex: 0,
    explanation: "Une ligne blanche continue longitudinale interdit de la franchir ou de la chevaucher. Le non-respect est passible d'une amende et d'un retrait de points (Article R412-19).",
    difficulty: "easy", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "ligne blanche continue", "interdiction"]), reference: "R412-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une ligne blanche discontinue permet:",
    options: O(["Le franchissement pour dépasser ou changer de voie", "L'interdiction de franchir", "Le stationnement sur la ligne", "Le demi-tour obligatoire"]),
    correctIndex: 0,
    explanation: "Une ligne discontinue autorise le franchissement pour dépasser ou changer de voie, si la manœuvre est effectuée en toute sécurité. Si elle est continue du côté opposé, le dépassement est interdit (Article R412-19).",
    difficulty: "easy", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "ligne discontinue", "franchissement autorisé"]), reference: "R412-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Deux lignes blanches continues parallèles délimitent:",
    options: O(["Une voie réservée (bus, taxi, etc.)", "Un stationnement", "Un passage piéton", "Un giratoire"]),
    correctIndex: 0,
    explanation: "Deux lignes continues parallèles délimitent une voie réservée. Seuls les véhicules autorisés peuvent y circuler (Article R110-2 et R412-7).",
    difficulty: "medium", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "voie réservée", "lignes continues parallèles"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une ligne transversale continue (ligne d'arrêt) signifie:",
    options: O(["L'obligation de s'arrêter avant cette ligne", "Une limitation de vitesse", "Un stationnement autorisé", "Un passage pour piétons"]),
    correctIndex: 0,
    explanation: "La ligne d'arrêt indique où immobiliser le véhicule à l'approche d'un feu rouge, d'un STOP ou d'un cédez-le-passage. Le véhicule ne doit pas la dépasser lors de l'arrêt (Article R412-19).",
    difficulty: "easy", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "ligne d'arrêt", "feu rouge"]), reference: "R412-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Au passage piéton (passage zébré), le conducteur doit:",
    options: O(["Céder le passage aux piétons engagés ou manifestant l'intention de traverser", "Accélérer pour passer avant les piétons", "Klaxonner pour prévenir", "S'arrêter uniquement si un feu rouge l'y oblige"]),
    correctIndex: 0,
    explanation: "Le conducteur doit céder le passage aux piétons engagés ou manifestant l'intention de traverser. Le non-respect est puni d'une amende et d'un retrait de 6 points (Article R412-22).",
    difficulty: "easy", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "passage piéton", "cédez-le-passage"]), reference: "R412-22", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une ligne jaune discontinue en bordure de chaussée signifie:",
    options: O(["L'interdiction de s'arrêter ou stationner du côté de la ligne", "Un stationnement autorisé", "Une limitation de vitesse", "Un dépassement autorisé"]),
    correctIndex: 0,
    explanation: "La ligne jaune discontinue en bordure interdit l'arrêt et le stationnement du côté où elle est tracée (Article R417-1).",
    difficulty: "medium", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "ligne jaune", "stationnement interdit"]), reference: "R417-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un zebrage (bandes diagonales blanches) signifie:",
    options: O(["Une zone de stationnement interdit", "Un passage piéton", "Une voie de bus", "Un ralentisseur"]),
    correctIndex: 0,
    explanation: "Le zebrage délimite une zone où le stationnement et l'arrêt sont interdits, souvent à proximité des intersections, passages à niveau ou virages (Article R417-2).",
    difficulty: "medium", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "zebrage", "arrêt interdit"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une ligne continue à gauche et discontinue à droite signifie que:",
    options: O(["Le dépassement est autorisé pour les véhicules de la voie de droite", "Le dépassement est interdit dans les deux sens", "Le dépassement est autorisé dans les deux sens", "Le stationnement est autorisé à gauche"]),
    correctIndex: 0,
    explanation: "Une ligne mixte autorise le franchissement uniquement du côté de la ligne discontinue. Si elle est continue de votre côté, le dépassement est interdit (Article R412-19).",
    difficulty: "medium", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "ligne mixte", "dépassement"]), reference: "R412-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Des chevrons sur la chaussée indiquent:",
    options: O(["Une voie d'accélération ou de décélération", "Un danger imminent", "Un stationnement payant", "Un passage pour bus"]),
    correctIndex: 0,
    explanation: "Les chevrons délimitent une zone spécifique, souvent une voie d'accélération ou de décélération. Ils séparent la voie principale de la voie d'insertion (Article R412-19).",
    difficulty: "hard", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "chevrons", "accélération"]), reference: "R412-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La mention « STOP » peinte sur la chaussée est:",
    options: O(["Un rappel du panneau STOP implanté à cet endroit", "Une information touristique", "Un nom de rue", "Une indication de vitesse"]),
    correctIndex: 0,
    explanation: "L'inscription « STOP » peinte renforce le panneau STOP. Elle rappelle l'obligation de marquer un arrêt effectif. Le conducteur doit immobiliser son véhicule (Article R415-1).",
    difficulty: "easy", category: "Signalisation", theme: "Marquage au sol",
    tags: T(["marquage", "STOP", "arrêt obligatoire"]), reference: "R415-1", hasImage: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. PRIORITÉS — 40 questions
  // ═══════════════════════════════════════════════════════════════════

  // --- Priorité à droite (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une intersection sans signalisation, qui est prioritaire?",
    options: O(["Le véhicule venant de la droite", "Le véhicule le plus rapide", "Le véhicule le plus gros", "Le véhicule qui klaxonne"]),
    correctIndex: 0,
    explanation: "En l'absence de signalisation, la priorité à droite s'applique. Le conducteur doit toujours céder le passage au véhicule arrivant par sa droite. Cette règle fondamentale du Code de la route s'applique dans toutes les intersections non régulées (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "intersection"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La priorité à droite ne s'applique pas quand:",
    options: O(["Un panneau indique que vous êtes sur une route prioritaire", "Il fait nuit", "Vous roulez plus vite", "Votre véhicule est plus gros"]),
    correctIndex: 0,
    explanation: "La priorité à droite ne s'applique pas si un panneau de route prioritaire (losange jaune sur fond carré) indique que vous êtes sur une route prioritaire. Le conducteur prioritaire ne doit pas abuser de sa priorité (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "route prioritaire"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une rue avec un panneau « cédez-le-passage » à droite, le conducteur doit:",
    options: O(["Céder le passage au véhicule venant de la droite", "Passer en priorité car il est sur la route principale", "Accélérer pour passer en premier", "S'arrêter systématiquement"]),
    correctIndex: 0,
    explanation: "Même avec un panneau cédez-le-passage, la règle de la priorité à droite s'applique si le véhicule arrive d'une rue non signalisée. Le cédez-le-passage impose de ralentir et de céder le passage aux véhicules sur la route prioritaire (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "cédez-le-passage"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur circulant sur une route prioritaire (panneau losange) arrive à une intersection avec un véhicule venant de droite. Qui est prioritaire?",
    options: O(["Le conducteur sur la route prioritaire", "Le conducteur venant de la droite", "Le premier arrivé", "Le conducteur le plus rapide"]),
    correctIndex: 0,
    explanation: "Le panneau de route prioritaire (losange jaune) confère la priorité au conducteur circulant sur cette route, même si un autre véhicule arrive par la droite. La priorité à droite est remplacée par la priorité de la route signalée (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "route prioritaire", "losange"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une zone de rencontre, la priorité est-elle à droite?",
    options: O(["Non, les piétons sont prioritaires sur les véhicules", "Oui, la priorité à droite s'applique", "Non, les véhicules sont prioritaires", "Non, il n'y a pas de règle de priorité"]),
    correctIndex: 0,
    explanation: "Dans une zone de rencontre (signalée par un panneau carré bleu avec une maison et un piéton), les piétons ont la priorité sur les véhicules. La vitesse est limitée à 20 km/h et les véhicules ne peuvent pas dépasser les piétons (Article R110-2).",
    difficulty: "hard", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "zone de rencontre", "piétons"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur entre dans une intersection en même temps qu'un véhicule venant de droite, sans signalisation. Il doit:",
    options: O(["Céder le passage au véhicule venant de droite", "Passer en premier car il est arrivé en même temps", "Accélérer", "Klaxonner"]),
    correctIndex: 0,
    explanation: "Même si les deux véhicules arrivent en même temps, la priorité à droite s'applique. Le conducteur doit céder le passage au véhicule arrivant par sa droite, sans exception en l'absence de signalisation (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "simultanéité"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La priorité à droite s'applique-t-elle dans un parking?",
    options: O(["Oui, sauf signalisation contraire", "Non, jamais", "Non, le premier arrivé est prioritaire", "Oui, uniquement en souterrain"]),
    correctIndex: 0,
    explanation: "Dans un parking, la priorité à droite s'applique en l'absence de signalisation contraire. Cependant, les parkings privés sont soumis à un régime juridique spécifique. La signalisation interne (sens unique, STOP) prévaut (Article R415-1).",
    difficulty: "hard", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "parking"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur sort d'un parking privé sur la voie publique. À-t-il la priorité?",
    options: O(["Non, il doit céder le passage à tous les usagers de la voie publique", "Oui, il est sur une route prioritaire", "Oui, s'il utilise son clignotant", "Non, sauf s'il y a un STOP"]),
    correctIndex: 0,
    explanation: "Un conducteur sortant d'un terrain privé (parking, cour, propriété) n'a jamais la priorité. Il doit s'assurer que la voie est libre et céder le passage à tous les véhicules circulant sur la voie publique (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "parking", "terrain privé"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur tourne à droite et coupe la voie d'un véhicule venant de droite. Qui est prioritaire?",
    options: O(["Le véhicule venant de droite a la priorité", "Le véhicule qui tourne a la priorité", "Le premier dans l'intersection", "Celui qui roule le plus vite"]),
    correctIndex: 0,
    explanation: "Même lors d'un virage à droite, le conducteur doit céder le passage aux véhicules venant de droite s'il n'y a pas de signalisation. Il ne doit pas couper la trajectoire des autres véhicules (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "virage"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau de route prioritaire se termine (carré barré). Quelle règle s'applique ensuite?",
    options: O(["La priorité à droite s'applique aux intersections suivantes", "La route reste prioritaire", "Aucune règle ne s'applique", "Le feu est prioritaire"]),
    correctIndex: 0,
    explanation: "Après un panneau de fin de route prioritaire (carré barré d'une barre diagonale noire), le conducteur perd la priorité. La règle de la priorité à droite s'applique aux intersections suivantes, sauf signalisation contraire (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Priorité à droite",
    tags: T(["priorité", "droite", "fin de route prioritaire"]), reference: "R415-1", hasImage: false
  },

  // --- Ronds-points (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À l'approche d'un rond-point, le conducteur doit:",
    options: O(["Céder le passage aux véhicules circulant dans le giratoire", "S'insérer en priorité", "Accélérer pour entrer rapidement", "Utiliser le clignotant gauche uniquement pour sortir"]),
    correctIndex: 0,
    explanation: "Dans un giratoire, les véhicules circulant dans l'anneau sont prioritaires. Le conducteur doit ralentir, vérifier ses rétroviseurs et mettre son clignotant gauche pour s'insérer quand c'est possible (Article R412-15).",
    difficulty: "easy", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "insertion"]), reference: "R412-15", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Quel clignotant doit-on utiliser pour sortir d'un rond-point?",
    options: O(["Le clignotant droit avant de sortir", "Le clignotant gauche", "Aucun clignotant", "Les feux de détresse"]),
    correctIndex: 0,
    explanation: "Le conducteur doit mettre le clignotant droit avant de quitter le giratoire, après avoir dépassé la sortie précédant la sienne. Cela signale son intention de sortir aux autres usagers (Article R412-10).",
    difficulty: "easy", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "clignotant", "sortie"]), reference: "R412-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans un giratoire, un véhicule est à l'arrêt dans l'anneau. Le conducteur doit:",
    options: O(["Contourner le véhicule en restant prudent", "Klaxonner pour le faire avancer", "S'arrêter derrière lui", "Le dépasser par la gauche"]),
    correctIndex: 0,
    explanation: "Un véhicule à l'arrêt dans un giratoire doit être contourné avec prudence. Le conducteur doit ralentir et, si nécessaire, utiliser l'extérieur de l'anneau pour le contourner en toute sécurité (Article R412-15).",
    difficulty: "medium", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "obstacle"]), reference: "R412-15", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule d'urgence avec gyrophare entre dans un giratoire. Le conducteur dans le giratoire doit:",
    options: O(["Laisser passer le véhicule d'urgence", "Maintenir sa priorité car il est dans le giratoire", "Accélérer pour quitter le giratoire", "Klaxonner pour avertir le véhicule d'urgence"]),
    correctIndex: 0,
    explanation: "Même dans un giratoire, un véhicule d'urgence avec gyrophare allumé et sirène en fonctionnement a la priorité. Le conducteur doit dégager le passage en se déportant sur la droite (Article R415-1 et R313-3).",
    difficulty: "medium", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "véhicule d'urgence"]), reference: "R313-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un giratoire ancien (sans panneau de sens giratoire) peut-il fonctionner en priorité à droite?",
    options: O(["Oui, certains giratoires anciens fonctionnement avec la priorité à droite", "Non, tous les giratoires fonctionnent avec la priorité dans l'anneau", "Oui, uniquement la nuit", "Non, jamais"]),
    correctIndex: 0,
    explanation: "Certains anciens giratoires en France fonctionnent encore avec la priorité à droite. Un panneau spécifique « cédez-le-passage » dans le giratoire signale cette particularité. Le conducteur doit toujours vérifier la signalisation (Article R415-1).",
    difficulty: "hard", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "priorité à droite", "ancien"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À l'entrée d'un giratoire, le conducteur doit se placer sur:",
    options: O(["La voie de droite pour s'insérer", "La voie de gauche pour aller plus vite", "Le milieu de la chaussée", "L'accotement"]),
    correctIndex: 0,
    explanation: "À l'entrée d'un giratoire, le conducteur doit se placer sur la voie de droite pour s'insérer dans l'anneau. Il peut utiliser la voie de gauche uniquement si la voie de droite est saturée, mais doit revenir à droite dès que possible (Article R412-15).",
    difficulty: "easy", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "voie", "insertion"]), reference: "R412-15", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un piéton traverse à l'entrée d'un giratoire. Le conducteur doit:",
    options: O(["Céder le passage au piéton", "Passer car il est dans le giratoire", "Klaxonner", "Accélérer"]),
    correctIndex: 0,
    explanation: "Les piétons ont la priorité aux passages piétons, y compris à l'entrée et à la sortie des giratoires. Le conducteur doit ralentir et céder le passage au piéton engagé ou manifestant l'intention de traverser (Article R412-22).",
    difficulty: "medium", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "piéton"]), reference: "R412-22", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Peut-on s'arrêter dans un giratoire?",
    options: O(["Non, il est interdit de s'arrêter dans un giratoire", "Oui, en cas d'urgence seulement", "Oui, pour consulter un GPS", "Oui, si le giratoire est grand"]),
    correctIndex: 0,
    explanation: "Il est interdit de s'arrêter dans un giratoire, sauf nécessité absolue (panne, accident). L'arrêt ou le stationnement dans un giratoire est sanctionné car il entrave la circulation et présente un danger pour les autres usagers (Article R417-2).",
    difficulty: "easy", category: "Priorités", theme: "Ronds-points",
    tags: T(["priorité", "giratoire", "arrêt interdit"]), reference: "R417-2", hasImage: false
  },

  // --- Véhicules prioritaires (5) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule d'intervention d'urgence avec gyrophare allumé:",
    options: O(["A la priorité de passage et les autres conducteurs doivent le laisser passer", "Doit respecter les règles de priorité", "Peut rouler à n'importe quelle vitesse", "Doit éteindre son gyrophare en agglomération"]),
    correctIndex: 0,
    explanation: "Les véhicules d'intervention d'urgence (police, pompiers, SAMU, ambulance) avec gyrophare allumé et sirène en fonctionnement ont la priorité de passage. Les autres conducteurs doivent dégager le passage en se déportant sur la droite (Article R313-3).",
    difficulty: "easy", category: "Priorités", theme: "Véhicules prioritaires",
    tags: T(["priorité", "urgence", "gyrophare", "sirène"]), reference: "R313-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Quels véhicules bénéficient d'une priorité de passage avec gyrophares bleus?",
    options: O(["Police, gendarmerie, pompiers, SAMU", "Taxi, bus, ambulances privées", "Livraison urgente", "Camions de déménagement"]),
    correctIndex: 0,
    explanation: "Les gyrophares bleus sont réservés aux véhicules de police, de gendarmerie, de pompiers et du SAMU. Seuls ces véhicules bénéficient d'une priorité de passage lorsqu'ils utilisent leurs gyrophares et sirènes (Article R313-3).",
    difficulty: "easy", category: "Priorités", theme: "Véhicules prioritaires",
    tags: T(["priorité", "gyrophare bleu", "urgence"]), reference: "R313-3", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule d'intervention d'urgence approche par l'arrière. Le conducteur doit:",
    options: O(["Se déporter sur la droite et ralentir si nécessaire", "Accélérer pour dégager la voie", "Freiner brusquement", "Continuer sa route normalement"]),
    correctIndex: 0,
    explanation: "Le conducteur doit se déporter sur la droite en ralentissant progressivement pour laisser passer le véhicule d'urgence. Il ne doit ni accélérer, ni freiner brusquement, ni changer brusquement de direction (Article R414-4 et R313-3).",
    difficulty: "medium", category: "Priorités", theme: "Véhicules prioritaires",
    tags: T(["priorité", "urgence", "dégagement"]), reference: "R414-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule d'urgence est à l'arrêt sur la route avec son gyrophare allumé. Le conducteur doit:",
    options: O(["Ralentir et, si possible, changer de voie", "Passer à vitesse normale", "Klaxonner pour prévenir", "Accélérer pour ne pas gêner"]),
    correctIndex: 0,
    explanation: "Lorsqu'un véhicule d'intervention d'urgence est à l'arrêt avec gyrophare allumé, le conducteur doit ralentir et, si possible, changer de voie pour laisser un couloir de secours. Le non-respect est passible d'une amende (Article R412-15 et R414-4).",
    difficulty: "medium", category: "Priorités", theme: "Véhicules prioritaires",
    tags: T(["priorité", "urgence", "couloir de secours"]), reference: "R414-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un gyrophare orange clignotant sur un véhicule de dépannage signifie:",
    options: O(["Que le véhicule effectue une opération dangereuse et demande la prudence", "Que le véhicule a la priorité absolue", "Qu'il transport des matières dangereuses", "Que le véhicule est en infraction"]),
    correctIndex: 0,
    explanation: "Le gyrophare orange signale un véhicule effectuant une opération de dépannage, de travaux ou de transport exceptionnel. Ce véhicule n'a pas la priorité de passage mais demande la prudence des autres conducteurs (Article R313-3).",
    difficulty: "hard", category: "Priorités", theme: "Véhicules prioritaires",
    tags: T(["priorité", "gyrophare orange", "dépannage"]), reference: "R313-3", hasImage: false
  },

  // --- Piétons (7) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À un passage piéton, un piéton s'engage:",
    options: O(["Le conducteur doit céder le passage", "Le conducteur peut klaxonner pour faire reculer le piéton", "Le piéton doit attendre que les véhicules passent", "Le piéton n'a aucune priorité"]),
    correctIndex: 0,
    explanation: "Le conducteur doit céder le passage aux piétons engagés sur le passage piéton ou manifestant clairement l'intention de traverser. Le non-respect est puni d'un retrait de 6 points sur le permis (Article R412-22).",
    difficulty: "easy", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "passage piéton"]), reference: "R412-22", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un piéton traverse hors des passages piétons. Le conducteur doit:",
    options: O(["Adapter sa vitesse et ne pas le mettre en danger", "Passer normalement car le piéton est en tort", "Klaxonner pour le faire reculer", "Accélérer pour le dépasser rapidement"]),
    correctIndex: 0,
    explanation: "Même si le piéton traverse hors des passages prévus, le conducteur ne doit pas le mettre en danger. Il doit adapter sa vitesse et s'arrêter si nécessaire. Tout conducteur doit toujours se montrer prudent envers les piétons (Article R412-22 et R110-2).",
    difficulty: "medium", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "traversée"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur tourne à droite et un piéton traverse la rue perpendiculaire sur un passage piéton. Qui est prioritaire?",
    options: O(["Le piéton est prioritaire", "Le conducteur qui tourne est prioritaire", "Le premier arrivé", "Celui qui roule le plus vite"]),
    correctIndex: 0,
    explanation: "Le piéton traversant sur un passage piéton est toujours prioritaire, même si le conducteur tourne. Le conducteur doit s'assurer que le passage piéton est dégagé avant d'entamer son virage (Article R412-22).",
    difficulty: "easy", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "virage", "droite"]), reference: "R412-22", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À un passage piéton avec feux, le feu vert pour les piétons s'allume. Le conducteur doit:",
    options: O(["S'arrêter et laisser passer les piétons", "Passer si aucune voiture n'arrive", "Accélérer pour passer avant les piétons", "Klaxonner pour prévenir les piétons"]),
    correctIndex: 0,
    explanation: "Quand le feu piéton est vert, les piétons sont protégés. Le conducteur doit obligatoirement s'arrêter, même s'il n'y a pas encore de piéton visible. Le feu rouge pour véhicules interdit le franchissement (Article R412-30).",
    difficulty: "easy", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "feu", "passage piéton"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un malvoyant avec une canne blanche traverse la rue. Le conducteur doit:",
    options: O(["Céder le passage immédiatement et redoubler de vigilance", "Attendre que le malvoyant s'arrête", "Klaxonner pour le guider", "Passer en roulant lentement"]),
    correctIndex: 0,
    explanation: "Les personnes à mobilité réduite, notamment les malvoyants avec une canne blanche ou un chien guide, nécessitent une attention particulière. Le conducteur doit s'arrêter et les laisser traverser en toute sécurité (Article R412-22 et R110-2).",
    difficulty: "medium", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "malvoyant", "canne blanche"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur double un véhicule arrêté à un passage piéton. Un piéton se trouve entre les deux véhicules. Le conducteur doit:",
    options: O(["S'arrêter et ne pas dépasser tant que le piéton n'a pas traversé", "Dépasser lentement", "Klaxonner pour prévenir le piéton", "Passer en accélérant"]),
    correctIndex: 0,
    explanation: "Il est interdit de doubler un véhicule qui s'arrête devant un passage piéton. Le piéton caché par le véhicule arrêté pourrait surgir à tout moment. Le conducteur doit s'arrêter et attendre que le piéton ait complètement traversé (Article R414-4).",
    difficulty: "hard", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "piéton", "dépassement interdit"]), reference: "R414-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une zone de rencontre, la vitesse maximale est de:",
    options: O(["20 km/h", "30 km/h", "50 km/h", "10 km/h"]),
    correctIndex: 0,
    explanation: "Dans une zone de rencontre, la vitesse est limitée à 20 km/h. Les piétons ont la priorité sur les véhicules et peuvent utiliser toute la largeur de la chaussée. Les véhicules ne doivent pas mettre en danger les piétons (Article R110-2).",
    difficulty: "easy", category: "Priorités", theme: "Piétons",
    tags: T(["priorité", "zone de rencontre", "20 km/h", "piétons"]), reference: "R110-2", hasImage: false
  },

  // --- Intersections (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une intersection avec un cédez-le-passage:",
    options: O(["Le conducteur doit ralentir et céder le passage aux véhicules sur la route prioritaire", "Le conducteur peut passer sans ralentir si la voie est libre", "Le conducteur doit s'arrêter systématiquement", "Le conducteur doit klaxonner avant de s'engager"]),
    correctIndex: 0,
    explanation: "Le cédez-le-passage impose de ralentir et de céder le passage. L'arrêt n'est pas obligatoire si la voie est libre. En cas de doute sur la possibilité de s'engager, il est préférable de s'arrêter (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "cédez-le-passage", "intersection"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À une intersection avec feux tricolores, qui est prioritaire?",
    options: O(["Les véhicules circulant au feu vert", "Les véhicules venant de droite", "Les véhicules sur la route principale", "Les véhicules les plus rapides"]),
    correctIndex: 0,
    explanation: "Les feux tricolores règlent la priorité à l'intersection. Les véhicules circulant au feu vert sont prioritaires. Le feu rouge impose l'arrêt. En cas de panne des feux, les règles classiques de priorité s'appliquent (Article R412-30).",
    difficulty: "easy", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "feu", "intersection"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur souhaite tourner à gauche dans une intersection sans signalisation. Il doit:",
    options: O(["Céder le passage aux véhicules venant en face et de droite", "Passer en priorité car il a mis son clignotant", "Accélérer pour tourner rapidement", "Attendre que tous les véhicules soient passés"]),
    correctIndex: 0,
    explanation: "Pour tourner à gauche, le conducteur doit céder le passage aux véhicules venant en face et à ceux arrivant par sa droite (priorité à droite). Il doit attendre que la voie soit libre dans les deux directions avant de s'engager (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "virage gauche", "intersection"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur est engagé dans une intersection quand le feu passe au rouge. Il doit:",
    options: O(["Terminer sa traversée et dégager l'intersection", "S'arrêter immédiatement dans l'intersection", "Reculer", "Accélérer pour sortir rapidement"]),
    correctIndex: 0,
    explanation: "Un conducteur engagé dans une intersection quand le feu passe au rouge doit terminer sa traversée pour dégager l'intersection. Il ne doit ni s'arrêter au milieu, ni reculer. Les véhicules au feu vert doivent patienter (Article R412-30).",
    difficulty: "medium", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "feu rouge", "engagement", "intersection"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une intersection en « X » sans signalisation implique:",
    options: O(["La priorité à droite pour tous les conducteurs", "La priorité à gauche", "Le premier arrivé est prioritaire", "Aucune règle de priorité"]),
    correctIndex: 0,
    explanation: "Dans une intersection en croix sans signalisation, la règle de la priorité à droite s'applique systématiquement. Chaque conducteur doit céder le passage au véhicule arrivant par sa droite (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "droite", "intersection en croix"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule de bus avec un panneau « cédez-le-passage » s'engage devant vous. Vous devez:",
    options: O(["Laisser le bus s'insérer car il a la priorité signalée par le panneau", "Passer en priorité car vous êtes sur la route principale", "Accélérer pour ne pas le laisser passer", "Klaxonner"]),
    correctIndex: 0,
    explanation: "Certains bus sont équipés d'un panneau lumineux « cédez-le-passage » qui leur confère la priorité pour se rabattre dans la circulation. Les conducteurs doivent les laisser s'insérer (Article R415-1).",
    difficulty: "hard", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "bus", "insertion"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un carrefour à sens giratoire sans panneau de giratoire est une:",
    options: O(["Intersection classique avec priorité à droite", "Route prioritaire", "Zone de rencontre", "Zone à 30 km/h"]),
    correctIndex: 0,
    explanation: "Sans le panneau de giratoire (carré bleu avec flèches circulaires), un carrefour aménagé en rond-point fonctionne avec la règle de la priorité à droite. Le conducteur doit vérifier la signalisation pour connaître les règles applicables (Article R415-1).",
    difficulty: "hard", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "giratoire", "absence de signalisation"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À une intersection avec un STOP, le conducteur doit s'arrêter:",
    options: O(["Avant la ligne d'arrêt ou à hauteur du panneau STOP", "Après la ligne d'arrêt", "N'importe où dans l'intersection", "Au milieu de la chaussée"]),
    correctIndex: 0,
    explanation: "Le STOP impose l'arrêt avant la ligne d'arrêt. Si la ligne est absente, l'arrêt se fait à hauteur du panneau. Les roues doivent cesser de tourner. Le conducteur vérifie ensuite la visibilité avant de s'engager (Article R415-1).",
    difficulty: "easy", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "STOP", "ligne d'arrêt"]), reference: "R415-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur traverse une intersection et bloque la circulation perpendiculaire. Il commet:",
    options: O(["Une infraction car il ne doit pas s'engager si l'intersection n'est pas dégagée", "Aucune infraction car il avait le feu vert", "Une simple erreur sans conséquence", "Une infraction uniquement si un accident se produit"]),
    correctIndex: 0,
    explanation: "Un conducteur ne doit s'engager dans une intersection que s'il peut la traverser sans la bloquer. S'engager alors que la sortie est obstruée est une infraction (obstruction de chaussée). Il doit attendre que la sortie soit dégagée (Article R412-30).",
    difficulty: "medium", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "intersection", "blocage", "engagement"]), reference: "R412-30", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule tourne à gauche devant vous dans une intersection sans signalisation. Vous devez:",
    options: O(["Laisser le véhicule tourner et ne pas entraver sa manœuvre", "Passer en priorité car vous venez de droite", "Accélérer pour le dépasser", "Klaxonner"]),
    correctIndex: 0,
    explanation: "Le conducteur qui tourne à gauche doit céder le passage aux véhicules venant en face. De son côté, le conducteur venant en face ne doit pas entraver la manœuvre de virage. La courtoisie et la prudence doivent primer (Article R415-1).",
    difficulty: "medium", category: "Priorités", theme: "Intersections",
    tags: T(["priorité", "virage gauche", "courtoisie"]), reference: "R415-1", hasImage: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. VITESSE — 40 questions
  // ═══════════════════════════════════════════════════════════════════

  // --- Speed limits city/rural/highway (15) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale en agglomération est de:",
    options: O(["50 km/h", "30 km/h", "60 km/h", "80 km/h"]),
    correctIndex: 0,
    explanation: "La vitesse maximale autorisée en agglomération est de 50 km/h, sauf signalisation contraire (zone à 30 km/h, zone de rencontre). Le début de l'agglomération est signalé par un panneau rectangulaire blanc avec le nom de la commune et un bord rouge (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "agglomération", "50 km/h"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale sur route à deux chaussées séparées par un terre-plein central est de:",
    options: O(["110 km/h", "130 km/h", "90 km/h", "80 km/h"]),
    correctIndex: 0,
    explanation: "Sur les routes à deux chaussées séparées par un terre-plein central non urbanisées, la vitesse maximale est de 110 km/h. Par temps de pluie ou pour les jeunes conducteurs, elle est réduite à 100 km/h (Article R413-2).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "110 km/h", "route à deux chaussées"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale sur autoroute est de:",
    options: O(["130 km/h", "110 km/h", "150 km/h", "90 km/h"]),
    correctIndex: 0,
    explanation: "La vitesse maximale sur autoroute pour les véhicules de tourisme est de 130 km/h. Par temps de pluie ou de précipitations, elle est réduite à 110 km/h. Pour les jeunes conducteurs (permis probatoire), la limite est de 110 km/h par tous les temps (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "autoroute", "130 km/h"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale hors agglomération sur une route à double sens sans séparateur est de:",
    options: O(["80 km/h", "90 km/h", "70 km/h", "100 km/h"]),
    correctIndex: 0,
    explanation: "Depuis juillet 2018, la vitesse maximale sur routes à double sens sans séparateur central est de 80 km/h hors agglomération. Des départements peuvent repasser à 90 km/h par délibération. Le conducteur doit toujours vérifier la signalisation locale (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "80 km/h", "route double sens"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Pour un jeune conducteur en permis probatoire, la vitesse maximale sur autoroute est de:",
    options: O(["110 km/h", "130 km/h", "90 km/h", "80 km/h"]),
    correctIndex: 0,
    explanation: "Les jeunes conducteurs titulaires d'un permis probatoire (3 ans ou 2 ans selon la formation) sont soumis à une limitation de vitesse de 110 km/h sur autoroute et routes à deux chaussées séparées, et de 80 km/h sur les autres routes (Article R413-2).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "permis probatoire", "110 km/h"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Dans une zone à 30 km/h, la vitesse maximale est de:",
    options: O(["30 km/h", "20 km/h", "50 km/h", "40 km/h"]),
    correctIndex: 0,
    explanation: "Dans une zone à 30 km/h (signalée par un panneau rond avec la mention « 30 » sur fond blanc), la vitesse est limitée à 30 km/h pour tous les véhicules. Cette zone s'applique sur toutes les voies jusqu'au panneau de fin de zone (Article R413-2 et R110-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "zone 30", "30 km/h"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale pour un cyclomoteur (50 cm³) est de:",
    options: O(["45 km/h", "50 km/h", "40 km/h", "60 km/h"]),
    correctIndex: 0,
    explanation: "La vitesse maximale pour les cyclomoteurs est de 45 km/h. Ces véhicules sont interdits sur autoroute et sur les voies dont la vitesse minimale est supérieure à 45 km/h. Ils doivent circuler sur la droite de la chaussée (Article R311-1).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "cyclomoteur", "45 km/h"]), reference: "R311-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse minimale sur la voie de gauche d'une autoroute est de:",
    options: O(["80 km/h", "60 km/h", "90 km/h", "100 km/h"]),
    correctIndex: 0,
    explanation: "La vitesse minimale sur les voies de gauche de l'autoroute est de 80 km/h. Les véhicules ne pouvant pas maintenir cette vitesse doivent circuler sur la voie de droite. Les véhicules lents ont l'obligation de se déporter sur la droite (Article R413-19).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "autoroute", "vitesse minimale", "80 km/h"]), reference: "R413-19", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond rouge avec la mention « 70 » impose:",
    options: O(["Une limitation de vitesse à 70 km/h", "Une vitesse minimale de 70 km/h", "Une zone de danger", "Un péage de 70 euros"]),
    correctIndex: 0,
    explanation: "Le panneau rond rouge avec un chiffre impose une limitation de vitesse maximale que le conducteur ne doit en aucun cas dépasser. Le non-respect est sanctionné par une amende dont le montant dépend du dépassement (Article R413-2 et R413-5).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "limitation", "panneau rouge"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de dépassement de la vitesse maximale autorisée de moins de 20 km/h, le conducteur s'expose à:",
    options: O(["Une amende forfaitaire et un retrait d'un point sur le permis", "Une amende forfaitaire uniquement", "Un retrait de 3 points", "La suspension immédiate du permis"]),
    correctIndex: 0,
    explanation: "Un dépassement de moins de 20 km/h au-dessus de la limite autorisée est sanctionné par une amende forfaitaire et un retrait d'un point sur le permis. Le montant de l'amende augmente avec le dépassement (Article R413-2 et Annexe IV du Code de la route).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "excès", "sanction", "points"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse est-elle limitée même en l'absence de panneau de limitation?",
    options: O(["Oui, des vitesses par défaut s'appliquent selon le type de route", "Non, sans panneau il n'y a pas de limite", "Oui, uniquement en agglomération", "Non, sauf en cas de pluie"]),
    correctIndex: 0,
    explanation: "En l'absence de panneau de limitation, des vitesses par défaut s'appliquent : 50 km/h en agglomération, 80 km/h hors agglomération sur route à double sens, 110 km/h sur route à chaussées séparées, 130 km/h sur autoroute (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "par défaut", "limitation"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale en zone urbaine densément peuplée peut être réduite à:",
    options: O(["30 km/h par décision municipale", "20 km/h par décision municipale", "40 km/h par décision municipale", "10 km/h par décision municipale"]),
    correctIndex: 0,
    explanation: "Les maires peuvent décider de réduire la vitesse à 30 km/h sur l'ensemble ou une partie de leur commune. Certaines villes comme Paris ont généralisé la limite à 30 km/h sur l'ensemble de leur territoire (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "30 km/h", "municipalité"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un dépassement de plus de 50 km/h au-dessus de la vitesse maximale autorisée entraîne:",
    options: O(["Une suspension du permis de conduire et une comparution devant le tribunal", "Un simple avertissement", "Une amende forfaitaire", "Un stage de sensibilisation"]),
    correctIndex: 0,
    explanation: "Un dépassement de plus de 50 km/h constitue un délit. Le conducteur s'expose à une suspension de permis, une amende importante et éventuellement une peine d'emprisonnement. Le juge peut ordonner la confiscation du véhicule (Article R413-2 et L224-1).",
    difficulty: "hard", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "excès", "délit", "suspension"]), reference: "L224-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La vitesse maximale pour les véhicules de moins de 3,5 tonnes avec remorque en agglomération est de:",
    options: O(["50 km/h", "80 km/h", "90 km/h", "30 km/h"]),
    correctIndex: 0,
    explanation: "Les véhicules de moins de 3,5 tonnes avec remorque sont soumis aux mêmes limitations de vitesse que les véhicules seuls en agglomération : 50 km/h. Hors agglomération et sur autoroute, les limitations sont différentes (Article R413-2).",
    difficulty: "medium", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "remorque", "3,5t"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le panneau de début d'agglomération (rectangle blanc avec nom de commune) signifie que:",
    options: O(["La vitesse est limitée à 50 km/h sauf indication contraire", "La vitesse est limitée à 30 km/h", "Le stationnement est interdit", "Les vélos sont interdits"]),
    correctIndex: 0,
    explanation: "Le panneau d'entrée d'agglomération signale le début de la zone urbanisée et l'abaissement de la vitesse à 50 km/h. La vitesse peut être réduite à 30 km/h par une signalisation complémentaire. Le panneau de sortie d'agglomération signale la fin de cette zone (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Limites de vitesse",
    tags: T(["vitesse", "agglomération", "entrée"]), reference: "R413-2", hasImage: false
  },

  // --- Rain/weather speed (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de pluie sur autoroute, la vitesse maximale est de:",
    options: O(["110 km/h", "130 km/h", "90 km/h", "80 km/h"]),
    correctIndex: 0,
    explanation: "Par temps de pluie ou autres précipitations, la vitesse maximale sur autoroute est abaissée de 130 à 110 km/h pour les véhicules de tourisme. Le conducteur doit adapter sa vitesse aux conditions de la route et à la visibilité (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "pluie", "autoroute", "110 km/h"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de pluie sur une route à deux chaussées séparées, la vitesse maximale est de:",
    options: O(["100 km/h", "110 km/h", "90 km/h", "80 km/h"]),
    correctIndex: 0,
    explanation: "Par temps de pluie, la vitesse sur route à deux chaussées séparées par un terre-plein central est réduite de 110 à 100 km/h. Le conducteur doit également augmenter ses distances de sécurité et adapter sa conduite (Article R413-2).",
    difficulty: "medium", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "pluie", "route séparée", "100 km/h"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de brouillard dense (visibilité inférieure à 50 mètres), la vitesse maximale est de:",
    options: O(["50 km/h sur toutes les routes", "80 km/h", "30 km/h", "La vitesse n'est pas limitée"]),
    correctIndex: 0,
    explanation: "En cas de visibilité inférieure à 50 mètres, la vitesse maximale est de 50 km/h sur toutes les routes, y compris les autoroutes. Les feux de brouillard avant et arrière doivent être allumés. La distance de sécurité doit être réduite (Article R413-2 et R414-2).",
    difficulty: "medium", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "brouillard", "50 m", "50 km/h"]), reference: "R414-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de neige, le conducteur doit:",
    options: O(["Adapter sa vitesse et utiliser l'équipement approprié si requis", "Rouler à la vitesse normale", "Accélérer pour ne pas s'enliser", "Suivre les traces des autres véhicules"]),
    correctIndex: 0,
    explanation: "Par temps de neige, le conducteur doit réduire sa vitesse, augmenter les distances de sécurité et utiliser les équipements requis (pneus neige, chaînes) le cas échéant. La signalisation locale peut imposer des équipements spéciaux (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "neige", "équipement"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de pluie, la distance d'arrêt d'un véhicule:",
    options: O(["Augmente considérablement", "Diminue", "Reste identique", "Dépend uniquement de la vitesse"]),
    correctIndex: 0,
    explanation: "Par temps de pluie, la distance d'arrêt augmente significativement car la distance de freinage est multipliée par deux sur chaussée mouillée. Le conducteur doit augmenter ses distances de sécurité et réduire sa vitesse (Article R413-2).",
    difficulty: "easy", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "pluie", "distance d'arrêt"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de pluie, les feux que le conducteur doit allumer sont:",
    options: O(["Les feux de croisement", "Les feux de route", "Les feux de brouillard avant", "Les feux de détresse"]),
    correctIndex: 0,
    explanation: "Par temps de pluie et de précipitations, les feux de croisement (codes) doivent être allumés en permanence. Les feux de brouillard ne sont obligatoires qu'en cas de brouillard ou de forte neige. Les feux de détresse sont allumés en cas d'arrêt d'urgence (Article R412-2).",
    difficulty: "medium", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "pluie", "feux", "croisement"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'aquaplanage (hydroplanage) se produit quand:",
    options: O(["Le véhicule perd l'adhérence en roulant sur une couche d'eau", "Le moteur est noyé", "Les freins sont mouillés", "Les essuie-glaces sont en panne"]),
    correctIndex: 0,
    explanation: "L'aquaplanage se produit quand les pneus ne peuvent plus évacuer l'eau sur la chaussée et perdent le contact avec le sol. Le conducteur perd le contrôle de la direction. Pour l'éviter, il doit réduire sa vitesse et vérifier l'état de ses pneus (Article R413-2).",
    difficulty: "hard", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "aquaplanage", "adhérence", "eau"]), reference: "R413-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de pluie, le jeune conducteur en permis probatoire sur route à double sens roule au maximum à:",
    options: O(["80 km/h", "90 km/h", "70 km/h", "60 km/h"]),
    correctIndex: 0,
    explanation: "Le jeune conducteur en permis probatoire est limité à 80 km/h sur route à double sens, même par temps de pluie. La limite par temps normal est déjà de 80 km/h pour les routes à double sens sans séparateur (Article R413-2).",
    difficulty: "medium", category: "Vitesse", theme: "Vitesse par temps de pluie",
    tags: T(["vitesse", "pluie", "permis probatoire", "80 km/h"]), reference: "R413-2", hasImage: false
  },

  // --- Following distance (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La distance de sécurité minimale correspond à:",
    options: O(["2 secondes de temps de réaction au minimum", "1 seconde", "3 mètres", "La longueur du véhicule"]),
    correctIndex: 0,
    explanation: "La distance de sécurité minimale correspond à environ 2 secondes de temps de parcours. Cette distance permet au conducteur de réagir et de freiner en cas d'arrêt brusque du véhicule qui le précède. Elle doit être doublée par temps de pluie (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "distance", "2 secondes", "sécurité"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À 90 km/h, la distance de sécurité minimale est d'environ:",
    options: O(["50 mètres", "25 mètres", "90 mètres", "36 mètres"]),
    correctIndex: 0,
    explanation: "À 90 km/h, un véhicule parcourt environ 25 mètres par seconde. La distance de sécurité de 2 secondes correspond à environ 50 mètres. On retient la formule : le chiffre des dizaines de la vitesse multiplié par 6 donne la distance approximative en mètres (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "distance", "90 km/h", "50 mètres"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À 130 km/h sur autoroute, la distance de sécurité recommandée est d'environ:",
    options: O(["73 mètres", "50 mètres", "130 mètres", "100 mètres"]),
    correctIndex: 0,
    explanation: "À 130 km/h, un véhicule parcourt environ 36 mètres par seconde. La distance de sécurité de 2 secondes correspond à environ 73 mètres. Par temps de pluie, cette distance doit être doublée à environ 146 mètres (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "distance", "130 km/h", "73 mètres"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de file de véhicules sur autoroute, la distance entre véhicules doit être au minimum de:",
    options: O(["73 mètres (2 secondes à 130 km/h)", "50 mètres", "30 mètres", "100 mètres"]),
    correctIndex: 0,
    explanation: "Sur autoroute, la distance minimale entre deux véhicules est de 73 mètres environ (2 secondes à 130 km/h). En cas de pluie, elle doit être doublée. Des repères au sol (chevrons, traits) peuvent aider à évaluer cette distance (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "autoroute", "file", "distance"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Par temps de pluie, la distance de sécurité doit être:",
    options: O(["Doublée par rapport au temps sec", "Triplée", "Réduite de moitié", "Identique"]),
    correctIndex: 0,
    explanation: "Par temps de pluie ou sur chaussée mouillée, la distance de sécurité doit être doublée. Les distances de freinage sont multipliées par deux. Le conducteur doit laisser un intervalle de 4 secondes minimum avec le véhicule qui le précède (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "distance", "pluie", "doublée"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un camion vous précède de près. Que devez-vous faire?",
    options: O(["Augmenter la distance de sécurité derrière lui pour voir plus loin", "Rapprocher-vous pour le doubler", "Freinez pour lui indiquer de reculer", "Accélérez pour vous écarter"]),
    correctIndex: 0,
    explanation: "Lorsqu'un camion vous suit de trop près, vous devez augmenter la distance avec le véhicule qui vous précède pour avoir plus de marge de freinage. Évitez les manœuvres brusques qui pourraient surprendre le camion (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "camion", "distance", "sécurité"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le temps de réaction moyen d'un conducteur est d'environ:",
    options: O(["1 seconde", "2 secondes", "0,5 seconde", "3 secondes"]),
    correctIndex: 0,
    explanation: "Le temps de réaction moyen d'un conducteur attentif est d'environ 1 seconde. Ce temps peut augmenter en cas de fatigue, d'alcool, de drogue ou d'utilisation du téléphone. À 90 km/h, le véhicule parcourt 25 mètres pendant cette seconde (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "temps de réaction", "1 seconde"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La distance totale d'arrêt comprend:",
    options: O(["La distance parcourue pendant le temps de réaction plus la distance de freinage", "La distance de freinage uniquement", "La distance de sécurité uniquement", "La distance parcourue en 1 seconde"]),
    correctIndex: 0,
    explanation: "La distance d'arrêt total = distance parcourue pendant le temps de réaction + distance de freinage. À 50 km/h, elle est d'environ 25 mètres (14m de réaction + 11m de freinage) sur sol sec, et environ 37 mètres sur sol mouillé (Article R412-12).",
    difficulty: "hard", category: "Vitesse", theme: "Distance de sécurité",
    tags: T(["vitesse", "distance d'arrêt", "réaction", "freinage"]), reference: "R412-12", hasImage: false
  },

  // --- Stopping distance (9) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La distance de freinage augmente avec:",
    options: O(["La vitesse du véhicule", "La puissance du moteur", "Le poids du conducteur", "La couleur du véhicule"]),
    correctIndex: 0,
    explanation: "La distance de freinage augmente proportionnellement au carré de la vitesse. Si la vitesse double, la distance de freinage est multipliée par quatre. C'est pourquoi un léger dépassement de vitesse augmente considérablement la distance d'arrêt (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "freinage", "distance", "proportionnelle"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À 50 km/h sur sol sec, la distance d'arrêt est approximativement de:",
    options: O(["25 mètres", "15 mètres", "50 mètres", "10 mètres"]),
    correctIndex: 0,
    explanation: "À 50 km/h sur sol sec, la distance d'arrêt est d'environ 25 mètres. Le temps de réaction (1 seconde) fait parcourir 14 mètres et la distance de freinage est d'environ 11 mètres. Cette distance est un minimum absolu (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "50 km/h", "arrêt", "25 mètres"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À 100 km/h sur sol sec, la distance d'arrêt est approximativement de:",
    options: O(["55 mètres", "100 mètres", "30 mètres", "80 mètres"]),
    correctIndex: 0,
    explanation: "À 100 km/h sur sol sec, la distance d'arrêt est d'environ 55 mètres. La distance de réaction est de 28 mètres (1 seconde à 100 km/h) et la distance de freinage est d'environ 27 mètres. Sur sol mouillé, la distance d'arrêt dépasse 80 mètres (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "100 km/h", "arrêt", "55 mètres"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Quels facteurs augmentent la distance de freinage?",
    options: O(["La pluie, la fatigue, l'état des pneus et des freins", "La musique forte dans l'habitacle", "La couleur du véhicule", "Le type de carburant"]),
    correctIndex: 0,
    explanation: "La distance de freinage augmente avec la pluie, la fatigue, l'alcool, l'état des pneus (usure, sous-gonflage), l'état des freins, le chargement du véhicule et la pente de la route. Le conducteur doit anticiper ces facteurs (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "freinage", "facteurs", "adhérence"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'ABS (Antiblockiersystem) permet de:",
    options: O(["Éviter le blocage des roues lors du freinage et garder le contrôle directionnel", "Réduire la distance de freinage", "Accélérer le freinage", "Éviter l'aquaplanage"]),
    correctIndex: 0,
    explanation: "L'ABS empêche le blocage des roues lors d'un freinage d'urgence, permettant au conducteur de garder le contrôle de la direction. Il ne réduit pas nécessairement la distance de freinage mais permet d'éviter un dérapage. Le conducteur doit appuyer fermement et continuellement sur la pédale (Article R314-1).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "ABS", "freinage", "blocage"]), reference: "R314-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Sur une route en pente descendante, la distance de freinage est:",
    options: O(["Augmentée par rapport à une route plane", "Diminuée", "Identique", "Nulle"]),
    correctIndex: 0,
    explanation: "En descente, la gravité contribue à accélérer le véhicule, ce qui augmente la distance de freinage. Le conducteur doit réduire sa vitesse et utiliser le frein moteur en rétrogradant pour limiter l'usure des freins et maintenir le contrôle (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "descente", "frein moteur", "pente"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le frein moteur est plus efficace quand:",
    options: O(["Le véhicule est engagé dans un rapport inférieur (rétrogradage)", "Le véhicule roule au point mort", "Le moteur est éteint", "Les freins sont neufs"]),
    correctIndex: 0,
    explanation: "Le frein moteur est obtenu en relâchant la pédale d'accélérateur avec le véhicule engagé. Il est plus efficace dans un rapport inférieur (rétrogradage). En descente, le conducteur doit utiliser le frein moteur pour éviter la surchauffe des freins (Article R412-12).",
    difficulty: "medium", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "frein moteur", "rétrogradage"]), reference: "R412-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Des pneus usés augmentent la distance de freinage car:",
    options: O(["Ils évacuent moins bien l'eau et ont moins d'adhérence", "Ils sont plus légers", "Ils sont plus larges", "Ils sont plus rigides"]),
    correctIndex: 0,
    explanation: "Des pneus usés (profondeur de sculpture inférieure à 1,6 mm) perdent leur capacité à évacuer l'eau et offrent moins d'adhérence, augmentant la distance de freinage. Rouler avec des pneus usés est une infraction passible d'une amende (Article R314-1).",
    difficulty: "hard", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "pneus", "usure", "adhérence"]), reference: "R314-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule chargé:",
    options: O(["A une distance de freinage plus longue", "A une distance de freinage plus courte", "Freine mieux grâce à son poids", "N'est pas affecté"]),
    correctIndex: 0,
    explanation: "Un véhicule chargé a une distance de freinage plus longue en raison de son poids accru. L'inertie est plus grande et les freins doivent absorber plus d'énergie. Le conducteur doit adapter sa vitesse et ses distances de sécurité en conséquence (Article R412-12).",
    difficulty: "easy", category: "Vitesse", theme: "Distance de freinage",
    tags: T(["vitesse", "chargement", "freinage", "inertie"]), reference: "R412-12", hasImage: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. STATIONNEMENT — 30 questions
  // ═══════════════════════════════════════════════════════════════════

  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement est interdit à moins de 5 mètres d'un passage à niveau car:",
    options: O(["Il gênerait la visibilité et le passage des trains", "Il n'y a pas assez de place", "Le train pourrait le heurter", "Le courant électrique est dangereux"]),
    correctIndex: 0,
    explanation: "Le stationnement est interdit à moins de 5 mètres d'un passage à niveau pour ne pas gêner la visibilité des usagers de la route et des trains. Cette distance garantit un dégagement suffisant en cas d'urgence (Article R417-6).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "passage à niveau", "5 mètres"]), reference: "R417-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec un « P » barré d'une barre rouge signifie:",
    options: O(["Le stationnement est interdit, l'arrêt reste possible", "L'arrêt et le stationnement sont interdits", "Le stationnement est payant", "Le stationnement est limité en durée"]),
    correctIndex: 0,
    explanation: "Le panneau avec un « P » barré interdit le stationnement. L'arrêt reste autorisé s'il est bref et que le conducteur reste au volant ou à proximité immédiate. L'arrêt ne doit pas gêner la circulation (Article R417-1).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "P barré", "arrêt autorisé"]), reference: "R417-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement en double file est:",
    options: O(["Interdit en agglomération comme hors agglomération", "Autorisé en agglomération pendant moins de 2 minutes", "Autorisé uniquement la nuit", "Autorisé pour les livraisons"]),
    correctIndex: 0,
    explanation: "Le stationnement en double file est interdit car il gêne la circulation et le passage des véhicules d'urgence. Seul l'arrêt momentané (conducteur au volant) est toléré, mais jamais le stationnement. L'infraction est passible d'une amende et d'une mise en fourrière (Article R417-1).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "double file", "interdit"]), reference: "R417-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement en épis (perpendiculaire au trottoir) est obligatoire quand le panneau le précise. Sinon:",
    options: O(["Le conducteur doit se garer dans le sens de la circulation", "Le conducteur peut se garer dans n'importe quel sens", "Le stationnement en biais est obligatoire", "Le stationnement est interdit"]),
    correctIndex: 0,
    explanation: "En l'absence de signalisation spécifique, le stationnement se fait dans le sens de la circulation, les roues à moins de 50 cm du trottoir. Le stationnement à contre-sens est une infraction, même en stationnement (Article R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "sens", "épis"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La distance minimale entre deux véhicules stationnés est de:",
    options: O(["Il n'y a pas de distance minimale obligatoire", "2 mètres", "50 centimètres", "1 mètre"]),
    correctIndex: 0,
    explanation: "Il n'existe pas de distance minimale obligatoire entre deux véhicules stationnés, mais le stationnement ne doit pas gêner la sortie des autres véhicules. Le bon sens dicte de laisser un espace suffisant pour les manœuvres de sortie (Article R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "distance", "entre véhicules"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau de stationnement unilatéral avec une flèche indique que le stationnement est autorisé:",
    options: O(["D'un seul côté de la rue", "Des deux côtés de la rue", "Nulle part", "Sur le trottoir uniquement"]),
    correctIndex: 0,
    explanation: "Le panneau de stationnement unilatéral avec une flèche noire sur fond blanc indique que le stationnement est autorisé uniquement du côté de la rue où le panneau est implanté, dans la direction de la flèche (Article R417-4).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "unilatéral", "flèche"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement est interdit sur les trottoirs car:",
    options: O(["Il gêne les piétons et peut les forcer à descendre sur la chaussée", "Le trottoir est trop fragile", "Le véhicule pourrait glisser", "C'est autorisé pour les motos uniquement"]),
    correctIndex: 0,
    explanation: "Le stationnement sur les trottoirs est interdit car il gêne la circulation des piétons, des poussettes et des fauteuils roulants. Les véhicules à deux roues peuvent stationner sur le trottoir si un panneau le permet, sans gêner les piétons (Article R417-4 et R110-2).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "trottoir", "piétons"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement payant est signalé par:",
    options: O(["Un panneau rond bleu avec « P » et un disque de stationnement", "Un panneau « interdit de stationner »", "Un panneau rouge", "Un panneau de zone 30"]),
    correctIndex: 0,
    explanation: "Le stationnement payant est signalé par un panneau avec un « P » accompagné d'un panneau complémentaire indiquant les horaires et les modalités. Le conducteur doit afficher un ticket ou un disque de stationnement sur son tableau de bord (Article R417-10).",
    difficulty: "easy", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "payant", "disque"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement est interdit devant une entrée de garage si le panneau l'indique. La distance minimale est de:",
    options: O(["Il n'y a pas de distance fixe, mais le stationnement ne doit pas gêner l'accès", "1 mètre", "5 mètres", "3 mètres"]),
    correctIndex: 0,
    explanation: "Le stationnement ne doit pas gêner l'accès aux propriétés. Un panneau spécifique ou un marquage au sol peut interdire le stationnement devant un accès. En l'absence de signalisation, le stationnement est interdit s'il gêne l'accès (Article R417-1 et R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "garage", "accès"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement alterné (semi-mensuel) signifie que:",
    options: O(["Le côté de stationnement change selon les semaines (1-15 ou 16-31)", "Le stationnement alterne entre jour et nuit", "Le stationnement est alterné chaque jour", "Un côté est payant et l'autre gratuit"]),
    correctIndex: 0,
    explanation: "Le stationnement alterné (ou semi-mensuel) impose au conducteur de stationner d'un côté ou de l'autre de la rue selon la période du mois. Les dates sont indiquées sur un panneau complémentaire (1-15 ou 16-fin du mois) (Article R417-10).",
    difficulty: "medium", category: "Stationnement", theme: "Règles de stationnement",
    tags: T(["stationnement", "alterné", "semi-mensuel"]), reference: "R417-10", hasImage: false
  },
  // --- No-stopping zones (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un panneau rond bleu avec une croix rouge (deux barres rouges) signifie:",
    options: O(["L'arrêt et le stationnement sont interdits", "Un passage piéton", "Une limitation de vitesse à 20 km/h", "Un hôpital"]),
    correctIndex: 0,
    explanation: "Le panneau rond bleu avec une croix rouge interdit l'arrêt et le stationnement, même bref. Il est implanté là où tout arrêt serait dangereux ou gênant : virages, ponts étroits, tunnels, passages à niveau (Article R417-2).",
    difficulty: "easy", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "arrêt interdit", "croix rouge"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'arrêt est interdit à moins de 3 mètres d'un feu tricolore car:",
    options: O(["Il gênerait la visibilité des autres conducteurs", "Le feu pourrait chauffer le véhicule", "Le radar ne fonctionnerait plus", "Le feu serait masqué"]),
    correctIndex: 0,
    explanation: "L'arrêt et le stationnement sont interdits à moins de 3 mètres d'un feu tricolore pour ne pas gêner la visibilité du feu par les autres conducteurs et ne pas masquer le signal (Article R417-6).",
    difficulty: "easy", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "feu tricolore", "3 mètres"]), reference: "R417-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'arrêt et le stationnement sont interdits sur les bandes d'arrêt d'urgence (BAU) car:",
    options: O(["La bande d'arrêt d'urgence est réservée aux situations d'urgence", "Le stationnement y est autorisé pendant moins de 5 minutes", "Les camions y sont prioritaires", "La bande est trop étroite"]),
    correctIndex: 0,
    explanation: "La bande d'arrêt d'urgence est exclusivement réservée aux véhicules en situation de détresse (panne, accident). S'y arrêter ou s'y stationner sans nécessité est une infraction sévèrement sanctionnée (Article R417-2).",
    difficulty: "easy", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "BAU", "autoroute", "urgence"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'arrêt est interdit à moins de 5 mètres d'une intersection car:",
    options: O(["Il gênerait la visibilité et la circulation dans le carrefour", "Il n'y a pas assez de place pour tourner", "Le feu serait masqué", "Les piétons ne pourraient plus traverser"]),
    correctIndex: 0,
    explanation: "L'arrêt et le stationnement à moins de 5 mètres d'une intersection sont interdits car ils gênent la visibilité des autres conducteurs et entravent les manœuvres de virage. Cette règle s'applique à toutes les intersections (Article R417-6).",
    difficulty: "medium", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "intersection", "5 mètres", "visibilité"]), reference: "R417-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement est interdit sur un pont étroit car:",
    options: O(["Il réduit la largeur de la chaussée et gêne la circulation", "Le pont ne peut pas supporter le poids", "Le pont est en travaux", "Le stationnement est toujours interdit sur les ponts"]),
    correctIndex: 0,
    explanation: "Sur un pont étroit, le stationnement réduit la largeur disponible pour la circulation et peut empêcher le croisement des véhicules. Le stationnement et l'arrêt sont interdits pour garantir la fluidité et la sécurité du trafic (Article R417-2).",
    difficulty: "medium", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "pont étroit", "circulation"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un zebrage (bandes diagonales blanches) sur la chaussée signifie:",
    options: O(["Une zone de stationnement et d'arrêt interdits", "Un passage piéton", "Une voie de bus", "Un ralentisseur"]),
    correctIndex: 0,
    explanation: "Le zebrage délimite une zone où le stationnement et l'arrêt sont interdits. Il est utilisé à proximité des intersections, passages à niveau, virages ou feux. Les véhicules ne doivent en aucun cas s'y arrêter ni s'y stationner (Article R417-2).",
    difficulty: "medium", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "zebrage", "arrêt interdit"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'arrêt sur un passage piéton est:",
    options: O(["Toujours interdit", "Autorisé pendant moins de 2 minutes", "Autorisé si le conducteur reste au volant", "Autorisé la nuit"]),
    correctIndex: 0,
    explanation: "L'arrêt et le stationnement sur un passage piéton sont toujours interdits, quelle que soit la circonstance. Même un arrêt bref gêne les piétons et réduit leur visibilité pour les autres véhicules (Article R417-2).",
    difficulty: "easy", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "passage piéton", "toujours interdit"]), reference: "R417-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'arrêt en tunnel est interdit car:",
    options: O(["Il entrave la circulation et présente un risque important", "La ventilation ne suffit pas", "Le tunnel est trop sombre", "Les feux ne sont pas assez visibles"]),
    correctIndex: 0,
    explanation: "L'arrêt en tunnel est strictement interdit sauf en cas de nécessité absolue (panne, accident). Un véhicule à l'arrêt dans un tunnel constitue un obstacle dangereux et peut provoquer un accident en chaîne (Article R417-2).",
    difficulty: "easy", category: "Stationnement", theme: "Zones d'arrêt interdit",
    tags: T(["stationnement", "tunnel", "arrêt interdit"]), reference: "R417-2", hasImage: false
  },
  // --- Disabled parking (4) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une place de stationnement réservée aux personnes handicapées est signalée par:",
    options: O(["Un panneau carré bleu avec le sigle du fauteuil roulant et un « P »", "Un panneau rouge avec un « H »", "Un marquage jaune sur la chaussée", "Un panneau « STOP »"]),
    correctIndex: 0,
    explanation: "Les places de stationnement pour personnes handicapées sont signalées par un panneau carré bleu avec le pictogramme du fauteuil roulant et la lettre « P ». Le marquage au sol peut également indiquer cette réservation (Article R110-2 et R417-10).",
    difficulty: "easy", category: "Stationnement", theme: "Stationnement handicap",
    tags: T(["stationnement", "handicap", "fauteuil", "réservé"]), reference: "R110-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Se garer sur une place réservée aux handicapés sans la carte GIG-GIC est:",
    options: O(["Une infraction au Code de la route", "Autorisé si la place est vide", "Autorisé pendant 30 minutes", "Autorisé la nuit"]),
    correctIndex: 0,
    explanation: "Se garer sur une place réservée aux personnes handicapées sans être titulaire de la carte de stationnement pour personnes handicapées (GIG-GIC) est une infraction passible d'une amende. Le stationnement est réservé exclusivement aux titulaires de cette carte (Article R417-10).",
    difficulty: "easy", category: "Stationnement", theme: "Stationnement handicap",
    tags: T(["stationnement", "handicap", "GIG-GIC", "infraction"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La carte GIG-GIC (carte européenne de stationnement) permet:",
    options: O(["De stationner sur les places réservées aux handicapés dans toute l'Europe", "De circuler dans les voies de bus", "De stationner gratuitement partout", "De bénéficier de la priorité"]),
    correctIndex: 0,
    explanation: "La carte GIG-GIC permet à son titulaire de stationner sur les places réservées aux personnes handicapées, en France et dans les autres pays européens. Elle doit être affichée sur le tableau de bord du véhicule (Article R417-10).",
    difficulty: "medium", category: "Stationnement", theme: "Stationnement handicap",
    tags: T(["stationnement", "handicap", "GIG-GIC", "europe"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les dimensions d'une place de stationnement pour personnes handicapées sont plus grandes car:",
    options: O(["Elles doivent permettre le déploiement d'une rampe d'accès ou d'un élévateur", "Les véhicules handicapés sont plus grands", "La réglementation impose une taille minimale", "Les places ordinaires sont trop petites"]),
    correctIndex: 0,
    explanation: "Les places réservées aux personnes handicapées sont plus larges pour permettre le déploiement d'une rampe d'accès latérale ou d'un élévateur depuis le véhicule. Elles doivent aussi permettre l'ouverture complète des portières (Article R417-10).",
    difficulty: "medium", category: "Stationnement", theme: "Stationnement handicap",
    tags: T(["stationnement", "handicap", "dimensions", "accessibilité"]), reference: "R417-10", hasImage: false
  },
  // --- Hill parking (4) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En stationnement en montée, le conducteur doit braquer les roues:",
    options: O(["Vers le trottoir (vers la droite)", "Vers le milieu de la chaussée", "Vers le bas de la pente", "Les roues ne doivent pas être braquées"]),
    correctIndex: 0,
    explanation: "En stationnement en montée, les roues avant doivent être braquées vers le trottoir (vers la droite en France). Si le véhicule se met à rouler, il viendra buter contre le trottoir. Le frein à main doit être serré (Article R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Stationnement en pente",
    tags: T(["stationnement", "montée", "roues", "trottoir"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En stationnement en descente, le conducteur doit braquer les roues:",
    options: O(["Vers le trottoir (vers la droite)", "Vers le milieu de la chaussée", "Vers le haut de la pente", "Les roues ne doivent pas être braquées"]),
    correctIndex: 0,
    explanation: "En stationnement en descente, les roues avant doivent également être braquées vers le trottoir (vers la droite). En cas de mise en mouvement involontaire, le véhicule sera arrêté par le trottoir. Le frein à main doit toujours être serré (Article R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Stationnement en pente",
    tags: T(["stationnement", "descente", "roues", "trottoir"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de stationnement en pente, quel équipement est obligatoire pour les poids lourds?",
    options: O(["Des cales sous les roues", "Un frein supplémentaire", "Un extincteur", "Des chaînes"]),
    correctIndex: 0,
    explanation: "Les véhicules lourds doivent utiliser des cales sous les roues pour les immobiliser en pente, en complément du frein à main et éventuellement de l'engagement d'un rapport. Cette mesure est obligatoire pour les véhicules de plus de 3,5 tonnes (Article R417-4).",
    difficulty: "hard", category: "Stationnement", theme: "Stationnement en pente",
    tags: T(["stationnement", "pente", "cales", "poids lourds"]), reference: "R417-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En stationnement en pente, il est recommandé de:",
    options: O(["Engager une vitesse (1ère en montée, marche arrière en descente)", "Mettre le point mort", "Couper le moteur sans engager de vitesse", "Accélérer brièvement avant de s'arrêter"]),
    correctIndex: 0,
    explanation: "En plus du frein à main et du braquage des roues, il est recommandé d'engager une vitesse (1ère en montée, marche arrière en descente) pour utiliser le frein moteur en complément. Ces précautions limitent le risque de mise en mouvement du véhicule (Article R417-4).",
    difficulty: "medium", category: "Stationnement", theme: "Stationnement en pente",
    tags: T(["stationnement", "pente", "vitesse engagée", "frein moteur"]), reference: "R417-4", hasImage: false
  },
  // --- Urban specifics (4) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement peut être réglementé par des horaires spécifiques affichés sur un panneau complémentaire. Hors de ces horaires:",
    options: O(["Le stationnement est libre ou suit d'autres règles", "Le stationnement est interdit", "Le stationnement est toujours payant", "Le stationnement est réservé aux riverains"]),
    correctIndex: 0,
    explanation: "Les panneaux de stationnement avec horaires (par exemple : stationnement payant du lundi au samedi de 9h à 19h) indiquent que la réglementation ne s'applique que pendant ces horaires. Hors horaires, le stationnement redevient libre, sauf signalisation contraire (Article R417-10).",
    difficulty: "medium", category: "Stationnement", theme: "Spécificités urbaines",
    tags: T(["stationnement", "horaires", "urbain", "payant"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le stationnement résidentiel (stationnement réservé aux riverains) est signalé par:",
    options: O(["Un panneau avec un « R » et les heures d'applicabilité", "Un panneau « interdit de stationner »", "Un panneau de zone 30", "Un panneau « sens interdit »"]),
    correctIndex: 0,
    explanation: "Le stationnement résidentiel est signalé par un panneau « R » (résidentiel) ou « stationnement réservé aux résidents » avec les horaires d'applicabilité. Seuls les résidents munis d'une autorisation peuvent s'y garer (Article R417-10).",
    difficulty: "medium", category: "Stationnement", theme: "Spécificités urbaines",
    tags: T(["stationnement", "résidentiel", "rivain", "R"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En zone de stationnement payant, le disque de stationnement est obligatoire quand:",
    options: O(["Le panneau l'indique et le stationnement est limité en durée", "Le stationnement est toujours payant", "Le disque est obligatoire partout", "Uniquement les jours fériés"]),
    correctIndex: 0,
    explanation: "Le disque de stationnement est obligatoire dans les zones où la durée de stationnement est limitée (signalée par un panneau avec un « P » et une horloge). Le conducteur doit l'afficher sur le tableau de bord avec l'heure d'arrivée réglée (Article R417-10).",
    difficulty: "easy", category: "Stationnement", theme: "Spécificités urbaines",
    tags: T(["stationnement", "disque", "durée limitée", "horloge"]), reference: "R417-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un véhicule en stationnement gênant peut être:",
    options: O(["Mis en fourrière par les forces de l'ordre", "Remorqué par le propriétaire", "Laissez en place", "Déplacé par un passant"]),
    correctIndex: 0,
    explanation: "Un véhicule en stationnement gênant (gênant la circulation, l'accès à un garage, ou sur un emplacement réservé) peut être mis en fourrière sur décision des forces de l'ordre. Le propriétaire devra payer les frais de fourrière et une amende (Article R417-11).",
    difficulty: "easy", category: "Stationnement", theme: "Spécificités urbaines",
    tags: T(["stationnement", "gênant", "fourrière", "amende"]), reference: "R417-11", hasImage: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. CONDUITE ET SÉCURITÉ — 50 questions
  // ═══════════════════════════════════════════════════════════════════

  // --- Seatbelts (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le port de la ceinture est obligatoire:",
    options: O(["Pour tous les occupants du véhicule, à l'avant comme à l'arrière", "Uniquement pour le conducteur et le passager avant", "Uniquement sur autoroute", "Uniquement en agglomération"]),
    correctIndex: 0,
    explanation: "Le port de la ceinture de sécurité est obligatoire pour tous les occupants du véhicule, à l'avant comme à l'arrière, y compris dans les zones urbaines. Le non-port de la ceinture est passible d'une amende et d'un retrait de points (Article R412-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "obligatoire", "passagers"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un enfant de moins de 10 ans doit être installé:",
    options: O(["Sur un siège adapté à sa morphologie, sauf exceptions", "À l'avant sans siège", "Sur les genoux d'un adulte", "Debout à l'arrière"]),
    correctIndex: 0,
    explanation: "Les enfants de moins de 10 ans doivent être transportés dans un dispositif de retenue homologué adapté à leur poids et leur taille. Les exceptions sont limitées : taxi, transport en commun avec ceintures insuffisantes (Article R412-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "enfant", "siège", "moins de 10 ans"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le port de la ceinture réduit le risque de mortalité en cas d'accident de:",
    options: O(["Environ 45 % pour les occupants avant et 60 % pour les occupants arrière", "10 %", "90 %", "5 %"]),
    correctIndex: 0,
    explanation: "Le port de la ceinture de sécurité réduit significativement le risque de mortalité : d'environ 45 % pour les occupants à l'avant et jusqu'à 60 % pour les occupants à l'arrière. La ceinture empêche l'éjection du véhicule et réduit les traumatismes (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "mortalité", "réduction", "statistiques"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une femme enceinte peut-elle porter la ceinture de sécurité?",
    options: O(["Oui, en positionnant la sangle abdominale sous le ventre", "Non, la ceinture est interdite pendant la grossesse", "Oui, uniquement au premier trimestre", "Non, les airbags suffisent"]),
    correctIndex: 0,
    explanation: "La ceinture de sécurité est obligatoire pendant la grossesse. La sangle abdominale doit être positionnée sous le ventre et non sur celui-ci pour éviter toute pression sur le fœtus. La sangle thoracique passe entre les seins (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "grossesse", "positionnement"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le non-port de la ceinture de sécurité est sanctionné par:",
    options: O(["Une amende forfaitaire et un retrait de 3 points", "Un simple avertissement", "Une amende sans retrait de points", "La suspension du permis"]),
    correctIndex: 0,
    explanation: "Le non-port de la ceinture de sécurité est passible d'une amende forfaitaire et d'un retrait de 3 points sur le permis de conduire. Cette sanction s'applique à chaque occupant du véhicule en infraction, et le conducteur est responsable des passagers mineurs (Article R412-1 et Annexe IV).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "sanction", "3 points", "amende"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le rétroviseur central ne dispense pas du rétroviseur gauche car:",
    options: O(["Le rétroviseur gauche couvre l'angle mort gauche", "Le rétroviseur central suffit", "Le rétroviseur gauche est obligatoire uniquement la nuit", "Les deux rétroviseurs couvrent les mêmes zones"]),
    correctIndex: 0,
    explanation: "Le rétroviseur intérieur et les rétroviseurs extérieurs couvrent des zones différentes. Chaque rétroviseur extérieur est nécessaire pour éliminer l'angle mort correspondant. Le conducteur doit les régler avant le départ et les vérifier régulièrement (Article R314-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "rétroviseur", "angle mort", "sécurité"]), reference: "R314-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un passager arrière ne porte pas sa ceinture. Le conducteur est-il responsable?",
    options: O(["Oui, le conducteur est responsable de ses passagers", "Non, seul le passager est responsable", "Oui, uniquement si le passager est mineur", "Non, c'est le choix du passager"]),
    correctIndex: 0,
    explanation: "Le conducteur est pénalement responsable du non-port de la ceinture par ses passagers mineurs. Pour les passagers majeurs, chaque passeur est individuellement responsable, mais le conducteur doit s'assurer que tous portent la ceinture (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "passager", "responsabilité", "conducteur"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un airbag sans ceinture de sécurité est:",
    options: O(["Dangereux car le corps peut être projeté vers l'airbag en déploiement", "Plus efficace qu'une ceinture seule", "Suffisant pour la protection", "Inutile"]),
    correctIndex: 0,
    explanation: "L'airbag est conçu pour compléter la ceinture de sécurité, pas pour la remplacer. Sans ceinture, l'occupant peut être violemment projeté contre l'airbag en cours de déploiement, causant des blessures graves. Ceinture et airbag fonctionnent ensemble (Article R314-1).",
    difficulty: "hard", category: "Conduite et sécurité", theme: "Ceinture de sécurité",
    tags: T(["ceinture", "airbag", "dangereux", "complémentaire"]), reference: "R314-1", hasImage: false
  },

  // --- Alcohol (10) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le taux d'alcoolémie maximum autorisé est de:",
    options: O(["0,5 g/l de sang (0,25 mg/l d'air expiré) en circulation normale", "0,8 g/l de sang", "1,0 g/l de sang", "0,2 g/l de sang"]),
    correctIndex: 0,
    explanation: "Le taux maximum d'alcoolémie autorisé en France pour les conducteurs ordinaires est de 0,5 g/l de sang (soit 0,25 mg/l d'air expiré). Pour les jeunes conducteurs en permis probatoire, le taux est de 0,2 g/l, soit le taux zéro en pratique (Article R235-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "taux", "0,5 g/l", "sang"]), reference: "R235-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Pour un jeune conducteur en permis probatoire, le taux d'alcoolémie maximum autorisé est de:",
    options: O(["0,2 g/l de sang, soit pratiquement zéro", "0,5 g/l de sang", "0,8 g/l de sang", "1,0 g/l de sang"]),
    correctIndex: 0,
    explanation: "Les conducteurs en permis probatoire sont soumis au taux zéro (0,2 g/l de sang, soit 0,10 mg/l d'air expiré). Toute consommation d'alcool, même minime, peut entraîner un dépassement du seuil légal et de lourdes sanctions (Article R235-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "permis probatoire", "taux zéro", "0,2 g/l"]), reference: "R235-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Conduire avec un taux d'alcoolémie supérieur à 0,8 g/l constitue:",
    options: O(["Un délit puni d'une peine d'emprisonnement et d'une suspension de permis", "Une simple contravention", "Un avertissement sans sanction", "Une faute sans conséquence"]),
    correctIndex: 0,
    explanation: "Un taux d'alcoolémie supérieur à 0,8 g/l constitue un délit. Le conducteur s'expose à une peine d'emprisonnement, une amende, un retrait de 6 points et la suspension ou l'annulation du permis de conduire (Article L234-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "délit", "0,8 g/l", "emprisonnement"]), reference: "L234-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'alcoolémie est-elle mesurée en g/l de sang ou en mg/l d'air expiré?",
    options: O(["Les deux méthodes sont utilisées (sang ou air expiré) et sont équivalentes", "Uniquement en g/l de sang", "Uniquement en mg/l d'air expiré", "En degrés d'alcool"]),
    correctIndex: 0,
    explanation: "L'alcoolémie peut être mesurée par analyse de sang (en g/l) ou par éthylomètre (en mg/l d'air expiré). L'équivalence est : 0,5 g/l de sang = 0,25 mg/l d'air expiré. Le conducteur peut refuser le contrôle sanguin mais pas l'éthylotest (Article R234-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "éthylomètre", "sang", "air expiré"]), reference: "R234-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur peut-il refuser un contrôle d'alcoolémie par éthylotest?",
    options: O(["Non, le refus est puni des mêmes peines que la conduite en état d'ivresse", "Oui, il a le droit de refuser", "Oui, une fois par an", "Non, sauf en cas d'accident"]),
    correctIndex: 0,
    explanation: "Le refus de se soumettre à un contrôle d'alcoolémie est un délit puni des mêmes peines que la conduite avec un taux d'alcoolémie supérieur au seuil légal : retrait de 6 points, amende et suspension de permis (Article L234-4).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "refus", "contrôle", "délit"]), reference: "L234-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'alcool augmente le temps de réaction car:",
    options: O(["Il ralentit les fonctions cérébrales et altère le jugement", "Il fatigue le conducteur", "Il augmente la vitesse", "Il améliore la vigilance"]),
    correctIndex: 0,
    explanation: "L'alcool ralentit les fonctions cérébrales, altère le jugement, diminue la perception visuelle et augmente le temps de réaction. Même un taux inférieur au seuil légal peut affecter la conduite. L'alcool est impliqué dans près d'un tiers des accidents mortels (Article R235-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "temps de réaction", "cerveau", "jugement"]), reference: "R235-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le délai d'élimination de l'alcool par l'organisme est d'environ:",
    options: O(["1 heure par verre consommé", "30 minutes par verre", "5 heures par verre", "L'alcool s'élimine instantanément"]),
    correctIndex: 0,
    explanation: "L'organisme élimine en moyenne 0,1 à 0,15 g/l d'alcool par heure, soit environ l'équivalent d'un verre standard. Ce délai varie selon le poids, le sexe, l'état de santé et la prise alimentaire. Il n'y a pas de moyen d'accélérer l'élimination (Article R235-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "élimination", "temps", "verre"]), reference: "R235-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le café, l'eau froide ou une douche froide accélèrent-ils l'élimination de l'alcool?",
    options: O(["Non, ces méthodes ne font que masquer l'ivresse sans réduire l'alcoolémie", "Oui, le café est efficace", "Oui, la douche froide élimine l'alcool", "Oui, l'eau froide dilue l'alcool"]),
    correctIndex: 0,
    explanation: "Aucune méthode ne permet d'accélérer l'élimination de l'alcool par l'organisme. Le café, les douches froides ou la prise d'eau ne font que masquer temporairement les effets de l'ivresse sans réduire le taux d'alcoolémie (Article R235-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "café", "élimination", "mythe"]), reference: "R235-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un éthylotest anti-démarrage (EAD) peut être imposé par le juge:",
    options: O(["Oui, pour les conducteurs ayant commis une infraction alcoolémie", "Non, c'est toujours volontaire", "Oui, pour tous les conducteurs", "Non, ce dispositif n'existe pas"]),
    correctIndex: 0,
    explanation: "Le juge peut imposer l'installation d'un éthylotest anti-démarrage (EAD) comme mesure alternative à la suspension du permis. Le véhicule ne démarre que si le conducteur souffle dans le dispositif et que le résultat est inférieur au seuil légal (Article L234-12).",
    difficulty: "hard", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "EAD", "éthylotest", "anti-démarrage"]), reference: "L234-12", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La combinaison alcool et médicaments peut:",
    options: O(["Augmenter dangereusement les effets des deux substances", "Réduire les effets de l'alcool", "N'avoir aucun effet", "Améliorer la vigilance"]),
    correctIndex: 0,
    explanation: "La combinaison de l'alcool avec certains médicaments (antidépresseurs, somnifères, anxiolytiques) peut multiplier leurs effets sédatifs et altérer gravement la capacité de conduite. Le pictogramme « attention, danger » sur les boîtes de médicaments alerte de ce risque (Article R235-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Alcool",
    tags: T(["alcool", "médicaments", "combinaison", "danger"]), reference: "R235-1", hasImage: false
  },

  // --- Phone (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'utilisation du téléphone portable en conduisant:",
    options: O(["Est interdite si le conducteur tient le téléphone en main", "Est autorisée avec un kit mains libres", "Est totalement interdite", "Est autorisée en ville"]),
    correctIndex: 0,
    explanation: "L'utilisation d'un téléphone tenu en main pendant la conduite est strictement interdite. Le conducteur peut utiliser un kit mains libre ou un système intégré au véhicule, mais cela reste déconseillé car l'attention est détournée de la route (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "mains libres", "interdit", "détention"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'utilisation du téléphone portable, même avec un kit mains libres, est déconseillée car:",
    options: O(["Le cerveau ne peut pas traiter simultanément la conversation et la conduite", "Le kit mains libres est fragile", "La conversation n'est pas audible", "Le téléphone chauffe"]),
    correctIndex: 0,
    explanation: "Même avec un kit mains libres, la conversation téléphonique mobilise une partie importante des ressources cognitives du conducteur. Le temps de réaction augmente, la perception des dangers diminue et le risque d'accident est multiplié par quatre (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "mains libres", "attention", "cognitif"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Envoyer un SMS ou consulter ses réseaux sociaux en conduisant est:",
    options: O(["Strictement interdit et passible d'une amende et d'un retrait de points", "Autorisé aux feux rouges", "Autorisé en ville", "Autorisé sur autoroute"]),
    correctIndex: 0,
    explanation: "Toute utilisation du téléphone portable en main (appel, SMS, réseaux sociaux, GPS) est interdite pendant la conduite. Le conducteur doit s'arrêter en sécurité pour utiliser son téléphone. L'infraction est punie d'une amende et d'un retrait de 2 points (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "SMS", "réseaux sociaux", "interdit"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le retrait de points pour utilisation du téléphone en main est de:",
    options: O(["2 points sur le permis de conduire", "1 point", "3 points", "4 points"]),
    correctIndex: 0,
    explanation: "L'utilisation d'un téléphone tenu en main pendant la conduite est sanctionnée par un retrait de 2 points sur le permis de conduire et une amende forfaitaire. En cas de récidive, les sanctions peuvent être plus sévères (Article R412-6 et Annexe IV).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "points", "2 points", "retrait"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "À un feu rouge, le conducteur peut-il utiliser son téléphone en main?",
    options: O(["Non, le feu rouge n'est pas un arrêt stationnaire autorisé", "Oui, si le moteur est coupé", "Oui, si le véhicule est à l'arrêt", "Oui, pendant moins de 30 secondes"]),
    correctIndex: 0,
    explanation: "L'utilisation du téléphone en main est interdite dès que le véhicule est en circulation, y compris à un feu rouge ou dans un embouteillage. L'arrêt à un feu rouge est un arrêt momentané lié à la circulation et non un stationnement (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "feu rouge", "circulation", "interdit"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le téléphone portable peut être utilisé en conduisant si le véhicule est équipé d'un:",
    options: O(["Système Bluetooth intégré (kit mains libre), sans manipulation manuelle", "Porte-gobelet téléphone", "Chargeur sans fil", "GPS externe"]),
    correctIndex: 0,
    explanation: "Le téléphone peut être utilisé via un système Bluetooth intégré au véhicule (autoradio, système de navigation). Le conducteur ne doit pas manipuler le téléphone en main pour décrocher, composer ou écrire. L'utilisation doit être vocale uniquement (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "Bluetooth", "intégré", "vocal"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La distraction au volant (téléphone, maquillage, alimentation) est responsable de:",
    options: O(["Environ 10 % des accidents mortels", "Moins de 1 % des accidents", "Plus de 50 % des accidents", "Aucun accident"]),
    correctIndex: 0,
    explanation: "La distraction au volant est un facteur majeur d'accidents, responsable d'environ 10 % des accidents mortels. Le téléphone portable, mais aussi le maquillage, l'alimentation ou les réglages du GPS sont des sources de distraction dangereuses (Sécurité Routière).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "distraction", "accidents", "mortalité"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Porter des écouteurs casqués en conduisant est-il autorisé?",
    options: O(["Non, il est interdit de porter un casque ou des écouteurs couvrant les deux oreilles", "Oui, si le volume est bas", "Oui, en ville uniquement", "Oui, sur autoroute uniquement"]),
    correctIndex: 0,
    explanation: "Il est interdit de porter un casque audio ou des écouteurs couvrant les deux oreilles pendant la conduite. Le conducteur doit pouvoir entendre les sons de la circulation (sirènes, klaxons). Un écouteur unique peut être toléré (Article R412-6).",
    difficulty: "hard", category: "Conduite et sécurité", theme: "Téléphone portable",
    tags: T(["téléphone", "écouteurs", "casque", "audition"]), reference: "R412-6", hasImage: false
  },

  // --- Night driving (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "De nuit, les feux de croisement doivent être allumés:",
    options: O(["En permanence, en agglomération comme hors agglomération", "Uniquement hors agglomération", "Uniquement sur autoroute", "Uniquement s'il pleut"]),
    correctIndex: 0,
    explanation: "De nuit, les feux de croisement (codes) doivent être allumés en permanence, que ce soit en agglomération ou hors agglomération. Depuis 2018, le port des feux de jour est obligatoire pour les véhicules neufs. La nuit, les feux de croisement sont le minimum légal (Article R412-2).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "croisement", "obligatoire"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les feux de route (pleins phares) doivent être éteints en cas de croisement avec un autre véhicule car:",
    options: O(["Ils éblouissent le conducteur venant en face", "Ils consomment trop d'énergie", "Ils chauffent trop", "Ils sont inutiles"]),
    correctIndex: 0,
    explanation: "Les feux de route doivent être éteints et remplacés par les feux de croisement lors du croisement d'un véhicule ou du dépassement d'un véhicule à l'arrêt. Les feux de route éblouissent les autres conducteurs et réduisent leur visibilité (Article R412-2).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "route", "éblouissement"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La visibilité des feux de croisement est d'environ:",
    options: O(["30 mètres", "100 mètres", "200 mètres", "500 mètres"]),
    correctIndex: 0,
    explanation: "Les feux de croisement éclairent la route sur environ 30 mètres devant le véhicule. À cette distance, un conducteur roulant à 90 km/h parcourt environ 25 mètres par seconde, ne lui laissant que peu de temps pour réagir (Article R412-2).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "croisement", "30 mètres", "visibilité"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La visibilité des feux de route est d'environ:",
    options: O(["100 mètres", "30 mètres", "200 mètres", "500 mètres"]),
    correctIndex: 0,
    explanation: "Les feux de route éclairent la route sur environ 100 mètres, offrant une meilleure visibilité que les feux de croisement. Ils doivent être utilisés hors agglomération quand aucun véhicule n'est en face et que la route est bien visible (Article R412-2).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "route", "100 mètres", "visibilité"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Quand doit-on utiliser les feux de brouillard arrière?",
    options: O(["En cas de brouillard ou de forte pluie réduisant la visibilité", "La nuit en permanence", "En ville", "Sur autoroute uniquement"]),
    correctIndex: 0,
    explanation: "Les feux de brouillard arrière sont obligatoires en cas de brouillard, neige forte ou pluie réduisant la visibilité à moins de 50 mètres. En dehors de ces conditions, leur utilisation est interdite car ils éblouissent les conducteurs qui suivent (Article R412-2).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "brouillard", "visibilité"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "De nuit, la fatigue se fait ressentir plus vite car:",
    options: O(["L'obscurité favorise l'endormissement et réduit la vigilance", "La route est plus dangereuse", "Les véhicules roulent plus vite", "La température est plus basse"]),
    correctIndex: 0,
    explanation: "De nuit, l'obscurité réduit la stimulation visuelle, favorise l'endormissement et diminue la perception des risques. Le risque d'accident mortel est trois fois plus élevé de nuit. Le conducteur doit faire des pauses régulières (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "fatigue", "vigilance", "endormissement"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les feux de détresse (warnings) sont utilisés pour:",
    options: O(["Signaler un arrêt d'urgence ou un danger pour les autres conducteurs", "Merci aux autres conducteurs", "Indiquer un virage", "Signaler un dépassement"]),
    correctIndex: 0,
    explanation: "Les feux de détresse sont utilisés pour signaler un arrêt d'urgence (panne, accident) ou un danger exceptionnel. Ils peuvent aussi être utilisés pour signaler un ralentissement brutal sur autoroute. Leur utilisation abusive est interdite (Article R412-2).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "feux", "détresse", "urgence"]), reference: "R412-2", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un conducteur ébloui par les feux d'un véhicule en face doit:",
    options: O(["Ralentir et regarder vers le bord droit de la chaussée", "Accélérer pour passer rapidement", "Allumer ses feux de route en retour", "Fermer les yeux"]),
    correctIndex: 0,
    explanation: "En cas d'éblouissement, le conducteur doit ralentir, éviter de regarder les feux et fixer son regard sur le bord droit de la chaussée. Il ne doit ni accélérer, ni allumer ses feux de route en représailles (Article R412-2).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Conduite de nuit",
    tags: T(["nuit", "éblouissement", "réflexe", "ralentir"]), reference: "R412-2", hasImage: false
  },

  // --- Fatigue (5) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les signes de fatigue en conduite comprennent:",
    options: O(["Bâillements, paupières lourdes, difficulté à se concentrer", "Augmentation de la vitesse", "Envie d'écouter de la musique", "Sensation de faim"]),
    correctIndex: 0,
    explanation: "Les signes de fatigue incluent les bâillements, les yeux qui piquent, les paupières lourdes, les difficultés de concentration, les hésitations et les changements de vitesse involontaires. Ces signes doivent alerter le conducteur de la nécessité de faire une pause (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Fatigue",
    tags: T(["fatigue", "bâillements", "signes", "concentration"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Une pause toutes les 2 heures de conduite est recommandée car:",
    options: O(["La vigilance diminue après environ 2 heures de conduite continue", "Le réservoir se vide", "Le moteur chauffe", "Les pneus s'usent"]),
    correctIndex: 0,
    explanation: "La vigilance diminue naturellement après environ 2 heures de conduite continue. Une pause de 15 minutes minimum permet de récupérer. Il est recommandé de ne pas dépasser 2 heures de route continue sans s'arrêter (Sécurité Routière).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Fatigue",
    tags: T(["fatigue", "pause", "2 heures", "vigilance"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "La fatigue est responsable d'environ:",
    options: O(["20 % des accidents mortels sur autoroute", "5 % des accidents", "50 % des accidents", "1 % des accidents"]),
    correctIndex: 0,
    explanation: "La fatigue est impliquée dans environ 20 % des accidents mortels sur autoroute. Le risque est maximal entre 2h et 6h du matin et entre 14h et 16h. Les longs trajets et les horaires de nuit augmentent ce risque (Sécurité Routière).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Fatigue",
    tags: T(["fatigue", "accidents", "mortalité", "autoroute"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Pour combattre la fatigue, le conducteur doit:",
    options: O(["Faire une pause, boire un café et marcher", "Augmenter le volume de la radio", "Ouvrir la fenêtre et accélérer", "Boire une boisson énergisante"]),
    correctIndex: 0,
    explanation: "La seule méthode efficace contre la fatigue est l'arrêt et le repos. Une pause de 15 à 20 minutes, éventuellement suivie d'un café (qui agit après 20 minutes), et une courte marche permettent de récupérer. Les « astuces » comme ouvrir la fenêtre ne sont que temporaires (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Fatigue",
    tags: T(["fatigue", "pause", "café", "repos"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le micro-sommeil en conduite dure généralement quelques secondes et peut être fatal car:",
    options: O(["Le véhicule continue de rouler sans contrôle pendant cette période", "Le conducteur se réveille immédiatement", "Le véhicule s'arrête automatiquement", "Le GPS avertit le conducteur"]),
    correctIndex: 0,
    explanation: "Le micro-sommeil dure de quelques secondes à une minute. Pendant cette période, le conducteur ne contrôle plus son véhicule qui peut parcourir plusieurs dizaines de mètres. Sur autoroute à 130 km/h, 3 secondes de micro-sommeil correspondent à 108 mètres parcourus sans contrôle (Article R412-6).",
    difficulty: "hard", category: "Conduite et sécurité", theme: "Fatigue",
    tags: T(["fatigue", "micro-sommeil", "danger", "inconscience"]), reference: "R412-6", hasImage: false
  },

  // --- First aid (6) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas d'accident de la route, la première chose à faire est de:",
    options: O(["Protéger le lieu de l'accident en sécurisant la zone", "Appeler les secours immédiatement", "Déplacer les blessés", "Fuir les lieux"]),
    correctIndex: 0,
    explanation: "La conduite à tenir en cas d'accident suit la règle « PAS » : Protéger, Alerter, Secourir. La protection du lieu de l'accident est la priorité absolue pour éviter un sur-accident. Allumer les feux de détresse, placer un triangle de pré-signalisation (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "protéger", "PAS", "sécurité"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le triangle de pré-signalisation doit être placé à:",
    options: O(["30 mètres minimum avant l'obstacle sur route et 100 mètres sur autoroute", "Immédiatement derrière le véhicule", "100 mètres partout", "À côté du véhicule"]),
    correctIndex: 0,
    explanation: "Le triangle de pré-signalisation doit être placé à 30 mètres minimum avant l'obstacle sur route et 100 mètres sur autoroute ou route à chaussées séparées. Il doit être visible à temps pour que les autres conducteurs puissent ralentir (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "triangle", "30 mètres", "100 mètres"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le numéro d'urgence européen est:",
    options: O(["112", "15", "18", "17"]),
    correctIndex: 0,
    explanation: "Le 112 est le numéro d'urgence européen unique, gratuit et accessible depuis tous les téléphones, même sans carte SIM. En France, le 15 (SAMU), le 17 (police) et le 18 (pompiers) sont aussi disponibles. Le 112 est le numéro à retenir (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "112", "urgence", "européen"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de brûlure légère, il faut:",
    options: O(["Refroidir la brûlure sous l'eau froide pendant au moins 15 minutes", "Appliquer de la crème directement", "Couvrir avec un pansement", "Percer les cloques"]),
    correctIndex: 0,
    explanation: "En cas de brûlure légère, il faut refroidir la brûlure sous l'eau froide pendant au moins 15 minutes. Ne pas appliquer de crème, de beurre ou d'huile sur la brûlure. Ne pas percer les cloques. Consulter un médecin si nécessaire (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "brûlure", "eau froide", "premiers secours"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas d'hémorragie, la priorité est de:",
    options: O(["Comprimer la plaie et appeler les secours", "Lever le membre blessé", "Attendre les secours sans rien faire", "Laver la plaie"]),
    correctIndex: 0,
    explanation: "En cas d'hémorragie, il faut comprimer directement la plaie avec un tissu propre, maintenir la pression et appeler immédiatement les secours. Le temps est crucial : une hémorragie grave peut être fatale en quelques minutes. Ne pas enlever le tissu de compression (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "hémorragie", "compression", "urgence"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le délai d'intervention des secours (SAMU, pompiers) est d'environ:",
    options: O(["Quelques minutes à un quart d'heure selon la localisation", "1 heure", "30 minutes", "Plusieurs heures"]),
    correctIndex: 0,
    explanation: "Les secours arrivent généralement en quelques minutes en milieu urbain, et jusqu'à 15-20 minutes en zone rurale. C'est pourquoi il est essentiel de sécuriser le lieu de l'accident et d'apporter les premiers gestes de secours en attendant les équipes professionnelles (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Premiers secours",
    tags: T(["accident", "secours", "SAMU", "délai"]), reference: "R412-6", hasImage: false
  },

  // --- Child seats (8) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un enfant doit utiliser un siège auto adapté jusqu'à l'âge de:",
    options: O(["10 ans (sauf exceptions)", "12 ans", "8 ans", "6 ans"]),
    correctIndex: 0,
    explanation: "Les enfants de moins de 10 ans doivent être installés dans un dispositif de retenue homologué adapté à leur poids et leur taille. Le siège doit être fixé selon les instructions du fabricant et adapté à la morphologie de l'enfant (Article R412-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "10 ans", "retenue"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les sièges auto sont classés selon le poids de l'enfant. Le groupe 1 correspond à:",
    options: O(["9 à 18 kg (environ 1 à 4 ans)", "0 à 10 kg", "15 à 25 kg", "22 à 36 kg"]),
    correctIndex: 0,
    explanation: "Les sièges auto sont classés en groupes selon la norme européenne ECE R44/04 : groupe 0 (0-10 kg), groupe 0+ (0-13 kg), groupe 1 (9-18 kg), groupe 2 (15-25 kg), groupe 3 (22-36 kg). La norme i-Size (R129) classe les sièges par taille (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "groupe 1", "9-18 kg"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un siège auto dos à la route est recommandé pour les enfants de:",
    options: O(["Moins de 2 ans (ou jusqu'à l'âge indiqué par le fabricant)", "Moins de 6 mois", "Moins de 1 an", "Tous les enfants jusqu'à 10 ans"]),
    correctIndex: 0,
    explanation: "Les enfants de moins de 2 ans doivent idéalement être installés dos à la route, car leur cou et leur colonne vertébrale ne sont pas encore assez développés pour supporter le choc d'un impact frontal dos à la route. Suivre les recommandations du fabricant (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "dos à la route", "2 ans"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Où doit être installé un siège auto pour bébé (dos à la route)?",
    options: O(["De préférence à l'arrière du véhicule", "À l'avant avec le airbag activé", "Sur le coffre", "Sur le tableau de bord"]),
    correctIndex: 0,
    explanation: "Un siège dos à la route doit être installé de préférence à l'arrière du véhicule. Si le siège est placé à l'avant, le airbag passager doit obligatoirement être désactivé, car le déploiement du airbag pourrait projeter le siège vers l'arrière et blesser l'enfant (Article R412-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "airbag", "arrière"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un siège auto qui a subi un accident doit être:",
    options: O(["Remplacé, même s'il n'a pas de dommages visibles", "Réutilisé sans vérification", "Réparé si nécessaire", "Nettoyé et réutilisé"]),
    correctIndex: 0,
    explanation: "Un siège auto impliqué dans un accident, même mineur, doit être remplacé. Les matériaux de la coque et le harnais peuvent avoir subi des dommages invisibles qui compromettent leur efficacité en cas de nouveau choc (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "accident", "remplacement"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un rehausseur (coussin d'appoint) est adapté pour les enfants de:",
    options: O(["15 à 36 kg (environ 4 à 12 ans)", "0 à 10 kg", "9 à 18 kg", "Plus de 40 kg"]),
    correctIndex: 0,
    explanation: "Le rehausseur est adapté aux enfants pesant entre 15 et 36 kg (environ 4 à 12 ans). Il rehausse l'enfant pour que la ceinture de sécurité adulte soit correctement positionnée. La ceinture doit passer sur les épaules et non sur le cou (Article R412-1).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "rehausseur", "15-36 kg", "ceinture"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Un siège auto sans homologation (norme ECE R44 ou i-Size R129) est:",
    options: O(["Interdit à la vente et à l'utilisation", "Autorisé en complément d'un siège homologué", "Autorisé pour les trajets courts", "Autorisé en ville"]),
    correctIndex: 0,
    explanation: "Seuls les dispositifs de retenue pour enfants homologués selon la norme ECE R44/04 ou la norme i-Size (R129) peuvent être utilisés. Ces normes garantissent un niveau minimum de sécurité en cas de collision. Un siège sans homologation est illégal et dangereux (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "homologation", "ECE R44"]), reference: "R412-1", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le non-respect de l'obligation d'installer un enfant dans un siège adapté est sanctionné par:",
    options: O(["Une amende forfaitaire et un retrait de points", "Un avertissement", "Une amende sans retrait de points", "La suspension du permis"]),
    correctIndex: 0,
    explanation: "Le non-respect de l'obligation d'installer un enfant dans un dispositif de retenue adapté est passible d'une amende forfaitaire et d'un retrait de points sur le permis. Le conducteur est responsable de la sécurité de tous les passagers mineurs (Article R412-1).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Sièges auto pour enfants",
    tags: T(["enfant", "siège auto", "sanction", "points"]), reference: "R412-1", hasImage: false
  },

  // --- Divers sécurité (7) ---
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "L'angle mort est la zone qui:",
    options: O(["N'est pas visible dans les rétroviseurs", "Est visible dans tous les rétroviseurs", "Est derrière le véhicule", "Est à l'avant du véhicule"]),
    correctIndex: 0,
    explanation: "L'angle mort est la zone autour du véhicule qui n'est pas visible dans les rétroviseurs et directement par le conducteur. Pour les véhicules légers, il se situe principalement sur les côtés, légèrement en arrière. Le conducteur doit tourner la tête pour vérifier cette zone avant de manœuvrer (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["angle mort", "rétroviseur", "visibilité", "manœuvre"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le clignotant doit être mis avant:",
    options: O(["Toute manœuvre de changement de direction, de voie ou de dépassement", "Uniquement pour les virages", "Uniquement sur autoroute", "Uniquement de nuit"]),
    correctIndex: 0,
    explanation: "Le clignotant est obligatoire avant toute manœuvre modifiant la trajectoire du véhicule : tourner, changer de voie, dépasser, s'insérer, se rabattre. Il doit être actionné suffisamment tôt pour avertir les autres usagers (Article R412-10).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["clignotant", "obligatoire", "manœuvre", "signalisation"]), reference: "R412-10", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le klaxon ne doit être utilisé que pour:",
    options: O(["Avertir d'un danger immédiat", "Saluer un ami", "Exprimer sa colère", "Faire précipiter un conducteur lent"]),
    correctIndex: 0,
    explanation: "L'avertisseur sonore (klaxon) ne doit être utilisé que pour prévenir d'un danger immédiat. L'usage abusif ou inutile du klaxon est interdit, notamment en agglomération, près des hôpitaux et des écoles (Article R416-4).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["klaxon", "danger", "avertisseur", "interdit"]), reference: "R416-4", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les animaux de compagnie doivent être transportés de manière à ne pas gêner la conduite. Cela implique:",
    options: O(["Utiliser une cage, un filet de séparation ou un harnais", "Laisser l'animal libre dans l'habitacle", "L'attacher au volant", "Le mettre sur le siège passager sans attache"]),
    correctIndex: 0,
    explanation: "Les animaux doivent être transportés dans des conditions ne gênant pas la conduite et ne risquant pas de blesser les occupants. Une cage, un filet de séparation ou un harnais adapté sont des solutions conformes au Code de la route (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["animal", "transport", "cage", "sécurité"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Les médicaments avec un pictogramme « triangle rouge » et la mention « attention danger » indiquent:",
    options: O(["Qu'ils peuvent affecter la conduite (somnolence, baisse de vigilance)", "Qu'ils sont interdits aux conducteurs", "Qu'ils améliorent la conduite", "Qu'ils sont sans danger pour la conduite"]),
    correctIndex: 0,
    explanation: "Les médicaments avec le pictogramme rouge (triangle avec exclamation) et la mention « attention danger » alertent le conducteur que le médicament peut affecter sa capacité à conduire (somnolence, baisse de vigilance, vertiges). Il est recommandé de consulter un médecin ou un pharmacien (Article R412-6).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["médicaments", "pictogramme", "somnolence", "vigilance"]), reference: "R412-6", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "Le transport d'objets sur le toit d'un véhicule doit respecter:",
    options: O(["Une charge maximale et une fixation solide avec signalisation si l'objet dépasse", "Aucune réglementation", "Uniquement la charge maximale", "Uniquement la signalisation"]),
    correctIndex: 0,
    explanation: "Le transport d'objets sur le toit doit respecter la charge maximale indiquée par le constructeur. Les objets doivent être solidement arrimés. Si le chargement dépasse l'arrière du véhicule de plus d'un mètre, un panneau réglementaire et un dispositif réfléchissant doivent être placés à l'extrémité (Article R312-8).",
    difficulty: "medium", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["chargement", "toit", "fixation", "signalisation"]), reference: "R312-8", hasImage: false
  },
  {
    countryCode: "FR", licenseCode: "B", courseId: null,
    question: "En cas de panne sur la chaussée, le conducteur doit:",
    options: O(["Allumer les feux de détresse, placer le triangle et se réfugier derrière la barrière de sécurité", "Reste dans le véhicule", "Tenter de réparer immédiatement", "Appeler un ami d'abord"]),
    correctIndex: 0,
    explanation: "En cas de panne, le conducteur doit : allumer les feux de détresse, placer le triangle de pré-signalisation, mettre le gilet haute visibilité et se réfugier derrière la barrière de sécurité, à l'abri de la circulation. Ne jamais rester sur la chaussée (Article R412-6).",
    difficulty: "easy", category: "Conduite et sécurité", theme: "Divers sécurité",
    tags: T(["panne", "feux de détresse", "triangle", "sécurité"]), reference: "R412-6", hasImage: false
  },
];
