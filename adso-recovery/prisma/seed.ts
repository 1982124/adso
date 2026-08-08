import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ADSO database...')

  // ─── Clean existing data ───
  await db.studentProgress.deleteMany()
  await db.enrollment.deleteMany()
  await db.chatMessage.deleteMany()
  await db.quizAttempt.deleteMany()
  await db.question.deleteMany()
  await db.module.deleteMany()
  await db.course.deleteMany()
  await db.user.deleteMany()
  await db.analyticsEvent.deleteMany()
  await db.school.deleteMany()

  console.log('  ✓ Cleaned existing data')

  // ═══════════════════════════════════════
  // COURSES
  // ═══════════════════════════════════════

  const coursesData = [
    {
      title: 'Code de la route',
      description:
        'Maîtrisez l\'ensemble du code de la route français : signalisation, priorités, limitations de vitesse et règles essentielles pour réussir l\'examen théorique.',
      category: 'theory',
      level: 'beginner',
      duration: 120,
      order: 1,
      icon: 'BookOpen',
      isPremium: false,
    },
    {
      title: 'Conduite pratique',
      description:
        'Apprenez les bases de la conduite : démarrage, freinage, virages, manœuvres de stationnement et conduite en milieu urbain.',
      category: 'practice',
      level: 'intermediate',
      duration: 180,
      order: 2,
      icon: 'Car',
      isPremium: true,
    },
    {
      title: 'Sécurité routière',
      description:
        'Comprenez les comportements à risque, l\'importance des équipements de sécurité et les gestes qui sauvent des vies sur la route.',
      category: 'safety',
      level: 'beginner',
      duration: 90,
      order: 3,
      icon: 'Shield',
      isPremium: false,
    },
    {
      title: 'Conduite sur autoroute',
      description:
        'Techniques spécifiques pour rouler en toute sécurité sur autoroute : insertions, dépassements, distances de sécurité à haute vitesse.',
      category: 'practice',
      level: 'advanced',
      duration: 60,
      order: 4,
      icon: 'Route',
      isPremium: true,
    },
    {
      title: 'Conduite écologique',
      description:
      'Réduisez votre consommation de carburant et votre impact environnemental grâce à l\'éco-conduite : anticipation, régimes moteur optimaux.',
      category: 'eco-driving',
      level: 'intermediate',
      duration: 45,
      order: 5,
      icon: 'Leaf',
      isPremium: true,
    },
    {
      title: 'Premiers secours',
      description:
        'Les gestes de premiers secours essentiels en cas d\'accident de la route : protéger, alerter, secourir selon le protocole PASE.',
      category: 'safety',
      level: 'beginner',
      duration: 60,
      order: 6,
      icon: 'Heart',
      isPremium: false,
    },
    {
      title: 'Panneaux et signalisation',
      description:
        'Apprenez à reconnaître et interpréter tous les panneaux de signalisation routière français : danger, obligation, interdiction, indication.',
      category: 'regulations',
      level: 'beginner',
      duration: 75,
      order: 7,
      icon: 'SignpostBig',
      isPremium: false,
    },
    {
      title: 'Conduite nocturne',
      description:
        'Spécificités de la conduite de nuit : utilisation des feux, adaptation de la vitesse, vigilance accrue face à l\'éblouissement et la fatigue.',
      category: 'practice',
      level: 'advanced',
      duration: 45,
      order: 8,
      icon: 'Moon',
      isPremium: true,
    },
  ]

  const courses: Record<string, string> = {}

  for (const c of coursesData) {
    const course = await db.course.create({ data: c })
    courses[course.title] = course.id
  }

  console.log(`  ✓ Created ${coursesData.length} courses`)

  // ═══════════════════════════════════════
  // MODULES
  // ═══════════════════════════════════════

  const modulesData: Array<{
    courseId: string
    title: string
    content: string
    type: string
    order: number
    duration: number
  }> = [
    // ─── Code de la route ───
    {
      courseId: courses['Code de la route'],
      title: 'Introduction au code de la route',
      content: `# Introduction au code de la route

## Pourquoi le code de la route ?

Le code de la route est l'ensemble des règles qui régissent la circulation sur les voies publiques en France. Sa connaissance est **obligatoire** pour obtenir le permis de conduire.

## Les principes fondamentaux

- **Sécurité avant tout** : chaque règle a pour objectif de protéger les usagers
- **Partage de l'espace** : la route est un espace partagé entre piétons, cyclistes, motards et automobilistes
- **Respect des autres** : courtoisie et prudence sont les maîtres-mots

## L'examen théorique (ETG)

L'Épreuve Théorique Générale (ETG) comporte **40 questions** à choix multiples. Vous devez répondre correctement à au moins **35 questions** pour réussir (soit un score de 35/40).

> 💡 **Conseil** : Entraînez-vous régulièrement avec des séries de questions pour vous familiariser avec les situations présentées.

## Les catégories de permis

| Permis | Âge minimum | Véhicule concerné |
|--------|------------|-------------------|
| B      | 18 ans     | Voiture (PTAC ≤ 3 500 kg) |
| A1     | 16 ans     | Moto 125 cm³ |
| A2     | 18 ans     | Moto ≤ 35 kW |
| AM     | 14 ans     | Cyclomoteur 50 cm³ |`,
      type: 'lesson',
      order: 1,
      duration: 25,
    },
    {
      courseId: courses['Code de la route'],
      title: 'Priorités et croisements',
      content: `# Priorités et croisements

## Règle de priorité à droite

En l'absence de signalisation, le véhicule venant de la **droite** est prioritaire. Cette règle fondamentale s'applique dans les carrefours non signalés.

## Les cas particuliers

### Priorité à droite supprimée
Un panneau **cédez-le-passage** (triangle rouge bordé de blanc avec point d'exclamation) ou un **stop** annule la priorité à droite.

### Le panneau « route prioritaire »
Le panneau carré jaune avec barre blanche centrale indique que vous êtes sur une route prioritaire. Vous n'avez pas à céder le passage aux véhicules venant de droite aux intersections.

## Ronds-points et carrefours à sens giratoire

Dans un carrefour à sens giratoire (gyro-rond-point) signalé par un panneau, les véhicules circulant à l'intérieur sont **prioritaires** sur ceux qui s'insèrent.

> ⚠️ **Attention** : Certains anciens ronds-points français fonctionnent encore en priorité à droite. Vérifiez toujours la signalisation.

## Les passages pour piétons

Les piétons sont **toujours prioritaires** sur les passages pour piétons, qu'ils soient signalés ou non. Vous devez ralentir et vous arrêter si nécessaire.

## Véhicules prioritaires

Les véhicules d'urgence (police, pompiers, SAMU) avec gyrophares et/ou sirènes en fonctionnement sont **toujours prioritaires**. Serrez à droite et laissez passer.`,
      type: 'lesson',
      order: 2,
      duration: 30,
    },
    {
      courseId: courses['Code de la route'],
      title: 'Vitesse et limitations',
      content: `# Vitesses et limitations

## Limitations générales en France

### En agglomération
- **50 km/h** par défaut (peut être réduit à 30 km/h dans les zones 30)

### Hors agglomération

| Conditions | Route à 2 voies | Autoroute |
|------------|-----------------|-----------|
| Temps normal | 80 km/h | 130 km/h |
| Temps de pluie / autres précipitations | 80 km/h | 110 km/h |
| Jeunes conducteurs (permis < 3 ans) | 80 km/h | 110 km/h |
| Visibilité < 50 m | 50 km/h | 50 km/h |

## Dépassement des limitations

Le dépassement de la vitesse maximale autorisée de **plus de 50 km/h** constitue un **délit** passible d'une amende de **1 500 €** et d'une suspension de permis pouvant aller jusqu'à **3 ans**.

## Vitesse adaptée

Même en dessous de la limite, vous devez adapter votre vitesse aux :
- **Conditions de trafic**
- **Conditions météorologiques** (brouillard, pluie, neige)
- **État de la chaussée**
- **Visibilité**

> 💡 **Rappel** : La vitesse est le premier facteur d'accident mortel sur les routes françaises. Réduisez votre vitesse, c'est la meilleure assurance.`,
      type: 'lesson',
      order: 3,
      duration: 30,
    },
    {
      courseId: courses['Code de la route'],
      title: 'Stationnement et arrêt',
      content: `# Stationnement et arrêt

## Différence entre arrêt et stationnement

- **Arrêt** : immobilisation momentanée du véhicule (montée/descente de passagers, chargement/déchargement)
- **Stationnement** : immobilisation du véhicule qui n'est pas un arrêt

## Règles de stationnement

### Interdictions
- Sur les trottoirs et passages pour piétons
- Sur les pistes cyclables
- Aux emplacements réservés (handicapés, livraisons, taxis)
- À moins de 5 m d'un passage pour piétons
- Devant les entrées de garage et sorties d'immeubles
- Sur les bandes d'arrêt d'urgence

### Stationnement en angle
En ville, le stationnement en épi (perpendiculaire au trottoir) est obligatoire quand la signalisation l'indique.

### Le stationnement alterné
Dans certaines rues, le stationnement est alterné selon les jours (côté pair les jours pairs, côté impair les jours impairs).

## Les feux de position

À l'arrêt ou en stationnement la nuit (ou par visibilité insuffisante) hors agglomération, vous devez allumer vos **feux de position** si le stationnement est autorisé.

> ⚠️ **Attention** : Le stationnement gênant est puni d'une amende de **135 €** (contravention de 2ème classe). Le stationnement dangereux peut entraîner la mise en fourrière.`,
      type: 'lesson',
      order: 4,
      duration: 35,
    },

    // ─── Conduite pratique ───
    {
      courseId: courses['Conduite pratique'],
      title: 'Premiers pas au volant',
      content: `# Premiers pas au volant

## Avant de démarrer

### Réglage du siège
- Distance pédalier : jambe légèrement fléchie sur la pédale d'embrayage
- Dos droit contre le dossier
- Bras légèrement fléchis sur le volant

### Les rétroviseurs
- **Rétroviseur intérieur** : voir l'arrière de la voie
- **Rétroviseurs extérieurs** : voir une petite bande de la carrosserie

### La ceinture de sécurité
Obligatoire pour **tous les passagers**, à l'avant comme à l'arrière. L'amende est de **135 €** par passager non attaché.

## Démarrer le véhicule

1. Vérifiez que le **levier de vitesses** est au point mort
2. **Enfoncez la pédale d'embrayage** à fond
3. **Démarrez le moteur**
4. **Sélectionnez la 1ère vitesse**
5. **Vérifiez les alentours** (rétroviseurs + angle mort)
6. Mettez le **clignotant**
7. **Lâchez l'embrayage progressivement** tout en accélérant doucement

> 💡 **Conseil** : Pour trouver le point de patinage de l'embrayage, relâchez très lentement la pédale jusqu'à sentir le véhicule vibrer légèrement.

## Les pieds sur les pédales

- **Pied gauche** : uniquement sur l'embrayage (jamais sur le frein !)
- **Pied droit** : alternativement sur le frein et l'accélérateur`,
      type: 'lesson',
      order: 1,
      duration: 35,
    },
    {
      courseId: courses['Conduite pratique'],
      title: 'Freinage et distances d\'arrêt',
      content: `# Freinage et distances d'arrêt

## Les 3 composantes de la distance d'arrêt

La **distance d'arrêt** = **distance de réaction** + **distance de freinage**

### Distance de réaction
Temps de réaction moyen : **1 seconde**. Pendant ce temps, le véhicule continue d'avancer.

À 50 km/h, vous parcourez environ **14 m** avant même de commencer à freiner.

### Distance de freinage
C'est la distance parcourue entre le début du freinage et l'arrêt complet. Elle dépend de :
- La **vitesse** (proportionnelle au carré de la vitesse)
- L'**état de la chaussée** (sèche, mouillée, enneigée)
- L'**état des pneus** et des freins
- La **pente** de la route

## Tableau récapitulatif

| Vitesse | Temps sec (route sèche) | Temps sec (route mouillée) |
|---------|------------------------|---------------------------|
| 30 km/h | 14 m                   | 28 m                      |
| 50 km/h | 25 m                   | 50 m                      |
| 90 km/h | 81 m                   | 162 m                     |
| 130 km/h| 169 m                  | 338 m                     |

## La distance de sécurité

Sur route, la distance minimale entre deux véhicules est de **2 secondes**. Sur autoroute, comptez **au moins 91 mètres** (soit 2 bandes de marquage au sol).

> ⚠️ **En cas de pluie**, doublez la distance de sécurité !`,
      type: 'lesson',
      order: 2,
      duration: 40,
    },
    {
      courseId: courses['Conduite pratique'],
      title: 'Les manœuvres de stationnement',
      content: `# Les manœuvres de stationnement

## Le créneau

La manœuvre de stationnement en créneau est l'une des plus redoutées, mais elle devient naturelle avec de la pratique.

### Étapes
1. **Alignez-vous** parallèlement au véhicule devant l'emplacement
2. Reculez **lentement** en braquant vers la place
3. Quand votre siège est à hauteur de l'arrière du véhicule voisin, **contre-braquez**
4. **Redressez** le volant progressivement
5. Ajustez votre position

> 💡 **Astuce** : Laissez environ 50 cm entre votre véhicule et celui de devant avant de commencer la manœuvre.

## Le stationnement en épi

1. Avancez jusqu'à ce que l'arrière de votre véhicule dépasse légèrement l'emplacement
2. Braquez **à fond** du côté de la place
3. Reculez lentement
4. Redressez quand le véhicule est parallèle aux lignes

## Le stationnement en bataille

Le plus simple : braquez vers la place avant d'entrer, puis redressez une fois engagé.

## La marche arrière

- Toujours **tourner la tête** pour regarder en arrière
- Contrôlez aussi les **rétroviseurs**
- Allez lentement (1ère vitesse ou embrayage pointé)
- Vérifiez les **angles morts**`,
      type: 'lesson',
      order: 3,
      duration: 45,
    },
    {
      courseId: courses['Conduite pratique'],
      title: 'Conduite en milieu urbain',
      content: `# Conduite en milieu urbain

## Les spécificités de la ville

La conduite en ville demande une **attention permanente**. Les dangers sont nombreux :
- Piétons imprévisibles
- Cyclistes et trottinettes
- Véhicules stationnés qui masquent la vue
- Trams et bus
- Travaux et déviations

## Les feux tricolores

### Signification
- **Rouge** : obligation de s'arrêter
- **Orange** : obligation de s'arrêter sauf si le freinage présente un danger
- **Vert** : passage autorisé, mais prudence

### Le feu orange clignotant
Il impose de **ralentir** et de céder le passage si nécessaire. Il ne signifie pas que vous pouvez passer.

## Les cédez-le-passage
Un panneau cédez-le-passage **n'oblige pas à s'arrêter**, sauf si un véhicule approche. Vous devez simplement ralentir suffisamment pour vous arrêter si nécessaire.

## Les zones de rencontre

Dans les zones de rencontre (signalées par un panneau carré bleu avec silhouette), la vitesse est limitée à **20 km/h**. Les piétons ont la priorité sur toute la largeur de la chaussée.

## Les couloirs de bus

Interdits aux voitures sauf s'ils sont signalés par un panneau « voitures autorisées ». L'amende pour emprunter un couloir de bus est de **135 €**.`,
      type: 'lesson',
      order: 4,
      duration: 60,
    },

    // ─── Sécurité routière ───
    {
      courseId: courses['Sécurité routière'],
      title: 'Les équipements de sécurité',
      content: `# Les équipements de sécurité

## Obligations du conducteur

### Ceinture de sécurité
Obligatoire pour le conducteur et **tous les passagers**. En cas de non-port :
- Amende de **135 €** par personne non attachée
- Retrait de **3 points** sur le permis (conducteur non attaché)

### Casque (2 roues)
Obligatoire pour les cyclomoteurs et motos. Le casque doit être **homologué** et **attaché**.

### Équipements obligatoires du véhicule
Votre véhicule doit comporter :
- Un **triangle de pré-signalisation**
- Un **gilet de haute visibilité**
- Un **extincteur** (véhicules de transport de personnes)

## Obligations des passagers

### Enfants
- Moins de 10 ans : doivent être transportés à l'**arrière**
- Jusqu'à 10 ans (ou 135 cm) : utilisation d'un **dispositif de retenue** adapté (siège auto, réhausseur)

### Moto
- Le passager doit porter un casque homologué
- Le passager doit avoir des **repose-pieds**

## Les aides à la conduite

- **ABS** (Antiblockier System) : évite le blocage des roues au freinage
- **ESP** (Electronic Stability Program) : aide à maintenir la trajectoire
- **Airbags** : protection en cas de choc frontal
- **AFU** (Aide au Freinage d'Urgence) : renforce le freinage en cas d'urgence

> ⚠️ **Rappel** : Ces systèmes aident mais ne remplacent pas la vigilance du conducteur.`,
      type: 'lesson',
      order: 1,
      duration: 25,
    },
    {
      courseId: courses['Sécurité routière'],
      title: 'Alcool, drogues et conduite',
      content: `# Alcool, drogues et conduite

## Les limites légales d'alcoolémie

| Catégorie | Taux max (sang) | Taux max (air) |
|-----------|-----------------|----------------|
| Conducteur général | 0,5 g/L | 0,25 mg/L |
| Jeune conducteur (< 3 ans) | 0,2 g/L | 0,10 mg/L |
| Transport en commun | 0,2 g/L | 0,10 mg/L |

## Les sanctions

### Délit (≥ 0,8 g/L ou refus de souffler)
- Amende de **4 500 €**
- Retrait de **6 points**
- Suspension du permis jusqu'à **3 ans**
- Peine de prison jusqu'à **2 ans**

### Contravention (0,5 à 0,79 g/L)
- Amende de **135 €**
- Retrait de **6 points**

## Délai d'élimination de l'alcool
Le corps élimine en moyenne **0,15 g/L par heure**. Un repas festif peut mettre **plusieurs heures** avant de pouvoir reprendre le volant.

## Les stupéfiants
La conduite sous l'emprise de stupéfiants est un **délit** :
- Amende de **4 500 €**
- Retrait de **6 points**
- Suspension du permis jusqu'à **3 ans**
- Peine de prison jusqu'à **2 ans**

> ⚠️ **Cumul alcool + drogues** : Les sanctions sont **aggravées**. Peine de prison pouvant atteindre **3 ans** et amende de **9 000 €**.

## Éthylotest antidémarrage (EAD)

Depuis 2019, les condamnés pour conduite en état d'ivresse peuvent être obligés d'installer un EAD dans leur véhicule.`,
      type: 'lesson',
      order: 2,
      duration: 25,
    },
    {
      courseId: courses['Sécurité routière'],
      title: 'Fatigue et conduite',
      content: `# Fatigue et conduite

## Un danger mortel sous-estimé

La fatigue est impliquée dans environ **20 % des accidents mortels** sur autoroute. C'est la **première cause** d'accident sur les longs trajets.

## Les signes de fatigue

- **Bâillements** répétés
- **Paupières lourdes**
- Difficulté à **maintenir sa trajectoire**
- Difficulté à **concentrer**
- Sensations de **vide** ou d'irritabilité

## Les facteurs aggravants

- Conduite entre **2h et 6h du matin** et entre **14h et 16h** (baisses physiologiques)
- Trajets **longs et monotones** (autoroute)
- Manque de **sommeil** la nuit précédente
- **Médicaments** (somnolence)
- Repas **copieux**

## Les préventions

- Faites une **pause toutes les 2 heures** (15 minutes minimum)
- Ne conduisez pas aux **heures creuses** si possible
- **Partagez la conduite** sur les longs trajets
- Hydratez-vous régulièrement
- Si la fatigue s'installe : **arrêtez-vous et dormez** (20 minutes de sieste suffisent)

> 💡 **Le café n'est efficace** qu'après 20 minutes. Il ne remplace pas le sommeil.`,
      type: 'lesson',
      order: 3,
      duration: 20,
    },
    {
      courseId: courses['Sécurité routière'],
      title: 'Téléphone au volant',
      content: `# Téléphone au volant

## Interdiction formelle

Il est **strictement interdit** de tenir un téléphone en main pendant la conduite, même à l'arrêt à un feu rouge.

### Sanctions
- Amende de **135 €**
- Retrait de **3 points** sur le permis
- Suspension de permis possible pour récidive

## Le kit mains libres

L'utilisation d'un kit **mains libres** intégrée au véhicule est autorisée, mais **pas les écouteurs** (oreillettes). Cependant, l'utilisation du téléphone, même en mains libres, **diminue fortement l'attention**.

## Les chiffres

- Temps d'attention détournée en regardant son téléphone : **4 à 5 secondes**
- À 130 km/h, le véhicule parcourt **plus de 180 m** les yeux rivés sur l'écran
- Risque d'accident multiplié par **23**

## Les réseaux sociaux et la conduite

Filmer ou prendre des photos en conduisant est un **délit** puni de :
- Amende de **1 500 €**
- Retrait de **3 points**
- Suspension de permis possible

> ⚠️ **Conseil** : Mettez votre téléphone en mode « Ne pas déranger » avant de prendre le volant. Aucun message ne vaut une vie.`,
      type: 'lesson',
      order: 4,
      duration: 20,
    },

    // ─── Conduite sur autoroute ───
    {
      courseId: courses['Conduite sur autoroute'],
      title: 'Entrée et insertion sur autoroute',
      content: `# Entrée et insertion sur autoroute

## L'accélération d'insertion

L'autoroute est une voie **à sens unique**, sans carrefour. L'insertion se fait par une **bande d'accélération**.

### Étapes d'insertion
1. Sur la bande d'accélération, **accélérez** pour atteindre la vitesse des véhicules sur la voie de droite
2. **Regardez dans le rétroviseur gauche** et vérifiez l'angle mort
3. **Mettez le clignotant gauche**
4. Insérez-vous **sans gêner** les véhicules déjà sur l'autoroute
5. Une fois inséré, **coupez le clignotant**

## Vitesse minimum

La vitesse minimum sur autoroute est de **80 km/h** sauf circonstances exceptionnelles (embouteillage, intempéries).

## Ce qui est interdit sur autoroute

- **Faire demi-tour**
- **Reculer**
- **S'arrêter** sur la chaussée (sauf urgence)
- **Emprunter la bande d'arrêt d'urgence** pour circuler
- **Circuler à contre-sens**

> 💡 **Astuce** : L'angle mort gauche est particulièrement dangereux lors de l'insertion. Tournez brièvement la tête pour vérifier.`,
      type: 'lesson',
      order: 1,
      duration: 20,
    },
    {
      courseId: courses['Conduite sur autoroute'],
      title: 'Dépassement sur autoroute',
      content: `# Dépassement sur autoroute

## Les voies de circulation

- **Voie de droite** : voie de circulation normale
- **Voie du milieu** : dépassement et circulation fluide
- **Voie de gauche** : uniquement pour le dépassement

## Règles de dépassement

1. **Vérifiez** les rétroviseurs et l'angle mort gauche
2. **Mettez le clignotant gauche**
3. Dépassez en **accélérant** pour ne pas rester trop longtemps sur la voie de gauche
4. Une fois le véhicule dépassé avec une marge suffisante, **mettez le clignotant droit**
5. **Reprenez la voie de droite** dès que possible

## Règle de la voie de gauche

La voie de gauche est **strictement réservée au dépassement**. Vous ne devez pas y circuler de manière prolongée. En cas de non-respect :
- Amende de **135 €**
- Retrait de **3 points** si la manœuvre est dangereuse

## Distances de sécurité sur autoroute

La distance minimale est de **2 secondes**, soit environ **91 mètres** à 130 km/h (2 bandes de marquage).

> ⚠️ **Par temps de pluie**, la distance passe à **3 secondes** et la vitesse est limitée à **110 km/h**.`,
      type: 'lesson',
      order: 2,
      duration: 20,
    },
    {
      courseId: courses['Conduite sur autoroute'],
      title: 'Panne et urgences sur autoroute',
      content: `# Panne et urgences sur autoroute

## En cas de panne

### Les 3 étapes obligatoires

1. **Allumez les feux de détresse** (warnings)
2. **Garez-vous** le plus à droite possible, sur la bande d'arrêt d'urgence
3. **Mettez le gilet de sécurité** **avant** de sortir du véhicule

### Se signaler

- Placez le **triangle de pré-signalisation** à **30 m minimum** derrière votre véhicule (100 m recommandé)
- **Restez derrière la glissière de sécurité**, du côté droit de la route
- **Appelez le 112** (numéro d'urgence européen)

## Les numéros d'urgence

- **112** : numéro d'urgence européen (tous réseaux)
- **15** : SAMU
- **17** : Police / Gendarmerie
- **18** : Pompiers

## La bande d'arrêt d'urgence

Elle n'est **pas une voie de circulation**. Son utilisation pour rouler est punie d'une amende de **135 €** et d'un retrait de **3 points**.

## Les postes d'appel d'urgence

Ils sont situés tous les **2 kilomètres** sur l'autoroute. Ils permettent de contacter directement le poste de surveillance le plus proche.

> ⚠️ **Ne jamais** rester dans le véhicule sur la bande d'arrêt d'urgence. Un choc arrière à 130 km/h est souvent mortel.`,
      type: 'lesson',
      order: 3,
      duration: 20,
    },

    // ─── Conduite écologique ───
    {
      courseId: courses['Conduite écologique'],
      title: 'Principes de l\'éco-conduite',
      content: `# Principes de l'éco-conduite

## Qu'est-ce que l'éco-conduite ?

L'éco-conduite est un ensemble de pratiques de conduite qui permettent de :
- **Réduire la consommation** de carburant de 15 à 20 %
- **Diminuer les émissions** de CO₂
- **Préserver** le véhicule (moins d'usure des freins et pneus)
- **Améliorer** la sécurité

## Les 5 règles d'or

### 1. Anticiper
Le regard doit être **loin devant** (10 à 15 secondes de trajet). Repérez les feux, les ralentissements et les panneaux à l'avance pour éviter les freinages brutaux.

### 2. Passer les vitesses rapidement
- Passez la **2ème** dès **10 km/h**
- Passez la **3ème** dès **25 km/h**
- Passez la **4ème** dès **40 km/h**
- Passez la **5ème** dès **50 km/h**

### 3. Maintenir une vitesse régulière
Utilisez le **régulateur de vitesse** sur route et autoroute. Les accélérations et freinages consomment énormément.

### 4. Couper le moteur à l'arrêt
Coupez le moteur si vous êtes à l'arrêt plus de **30 secondes** (feux, passages à niveau). Le système Start & Stop le fait automatiquement.

### 5. Vérifier la pression des pneus
Des pneus **sous-gonflés** augmentent la consommation de **3 à 5 %**. Vérifiez la pression chaque mois.

> 💡 **Bon à savoir** : L'éco-conduite peut faire économiser **300 à 500 €** par an en carburant.`,
      type: 'lesson',
      order: 1,
      duration: 15,
    },
    {
      courseId: courses['Conduite écologique'],
      title: 'Régimes moteur et consommation',
      content: `# Régimes moteur et consommation

## Le régime moteur optimal

Le **régime moteur** (en tours/minute, tr/min) influence directement la consommation :

- **Régime bas (1 000 - 1 500 tr/min)** : risque de calage, mauvais couple
- **Régime optimal (1 500 - 2 500 tr/min)** : meilleur rendement, consommation minimale
- **Régime élevé (> 2 500 tr/min)** : surconsommation, usure prématurée

## Le compte-tours

Surveillez le compte-tours pour maintenir le régime dans la **zone verte**. Changez de vitesse avant d'atteindre la zone rouge.

## Impact des rapports de vitesse

| Rapport | Consommation relative |
|---------|----------------------|
| 1ère    | Très élevée          |
| 2ème    | Élevée               |
| 3ème    | Modérée              |
| 4ème    | Faible               |
| 5ème    | Minimale             |

## Le frein moteur

Privilégiez le **frein moteur** (rétrogradage) au freinage sur pédale :
- Zéro consommation de carburant (coupure d'injection)
- Moins d'usure des plaquettes de frein
- Prévisibilité pour les véhicules derrière

> 💡 **Astuce** : En descente, rétrogradez plutôt que de freiner. Votre véhicule ne consomme rien en décélération.`,
      type: 'lesson',
      order: 2,
      duration: 15,
    },
    {
      courseId: courses['Conduite écologique'],
      title: 'Impact environnemental et alternatives',
      content: `# Impact environnemental et alternatives

## Le bilan carbone de la voiture

Un véhicule moyen émet environ **120 g de CO₂ par km**. Pour 15 000 km par an, cela représente **1,8 tonne de CO₂**.

## Les alternatives écologiques

### Véhicules électriques
- **Zéro émission** à l'utilisation
- Coût au km très faible (environ 2-3 €/100 km)
- Aide à l'achat de l'État jusqu'à **7 000 €** (bonus écologique)

### Véhicules hybrides
- Consommation réduite en ville (jusqu'à -40 %)
- Pas d'anxiété d'autonomie
- Récupération d'énergie au freinage

### Le covoiturage
- Réduction des coûts et des émissions par **2 ou plus**
- Lanes réservées dans certaines villes
- Aide de l'État via la prime covoiturage

## Les transports en commun

En France :
- Le réseau **TGV** est l'un des moins polluants au monde
- Les métros et tramways produisent peu de CO₂
- Le vélo est idéal pour les trajets courts (< 5 km)

> 💡 **Le saviez-vous ?** Si chaque Français roulait 10 km/h moins vite sur autoroute, la France économiserait **2,5 millions de tonnes de CO₂ par an**.`,
      type: 'lesson',
      order: 3,
      duration: 15,
    },

    // ─── Premiers secours ───
    {
      courseId: courses['Premiers secours'],
      title: 'Le protocole PASE',
      content: `# Le protocole PASE

## Protéger — Alerter — Secourir — Évaluer

Le protocole PASE est la méthode à suivre en cas d'accident de la route.

### 1. PROTÉGER

La sécurité est la **priorité absolue**.

- **Allumez vos feux de détresse**
- **Garez-vous** en sécurité (derrière l'accident si possible)
- **Enfilez votre gilet** de haute visibilité
- **Demandez aux autres** de se mettre en sécurité
- **Balisez** la zone avec un triangle (30 m minimum en amont)

### 2. ALERTER

Appelez le **112** (numéro d'urgence européen) ou le **15** (SAMU).

Informations à communiquer :
- **Localisation** précise (autoroute, borne kilométrique, sens)
- **Nombre de véhicules** impliqués
- **Nombre de victimes** et état apparent
- **Risques particuliers** (feu, fuite, produits dangereux)

### 3. SECOURIR

**Ne déplacez pas un blessé** sauf :
- Danger immédiat (incendie, explosion)
- Nécessité de pratiquer un massage cardiaque sur un sol dur

Actions possibles :
- **Ouvrez les voies aériennes** (basculer la tête en arrière)
- **Arrêtez une hémorragie** par compression directe
- **Pratiquez un massage cardiaque** si la personne ne respire plus

### 4. ÉVALUER

- Surveillez l'état de la victime en attendant les secours
- **Parlez-lui** et rassurez-la
- Notez tout changement d'état

> ⚠️ **Important** : En cas de doute sur les actions à mener, le 112 vous guidera par téléphone.`,
      type: 'lesson',
      order: 1,
      duration: 20,
    },
    {
      courseId: courses['Premiers secours'],
      title: 'Massage cardiaque et réanimation',
      content: `# Massage cardiaque et réanimation

## Quand pratiquer un massage cardiaque ?

Un massage cardiaque est nécessaire quand une personne est **inconsciente** et **ne respire pas** (ou respire de façon anormale, hoquets). C'est une **urgence vitale**.

## Les étapes du massage cardiaque

### Vérifier la conscience
Tapez doucement les épaules et demandez : « Vous m'entendez ? »

### Vérifier la respiration
- Baissez-vous, regardez la poitrine
- Écoutez et ressentez le souffle pendant **10 secondes maximum**

### Appeler les secours
Appelez le **112** ou demandez à quelqu'un de le faire.

### Le massage cardiaque
1. **Allongez** la victime sur le dos sur un sol **dur**
2. Mettez-vous **à genoux** à côté de la victime
3. Placez le **talon d'une main** au centre de la poitrine (sur le sternum)
4. Placez l'autre main **par-dessus**, doigts entrelacés
5. Comprimez le sternum de **5 à 6 cm**
6. Rythme : **100 à 120 compressions par minute**
7. Continuez **sans interruption** jusqu'à l'arrivée des secours

## Le DAE (Défibrillateur Automatisé Externe)

- Suivez les **instructions vocales** de l'appareil
- Tout le monde peut l'utiliser, **aucune formation n'est requise**
- Appliquez les électrodes comme indiqué
- Le DAE analyse et décide s'il faut administrer un choc

> 💡 **Rythme** : Pensez à la chanson « Stayin' Alive » des Bee Gees (103 BPM) pour maintenir le bon rythme de compressions.`,
      type: 'lesson',
      order: 2,
      duration: 20,
    },
    {
      courseId: courses['Premiers secours'],
      title: 'Gestes d\'urgence courants',
      content: `# Gestes d'urgence courants

## Hémorragie externe

### Compressez immédiatement
1. Appuyez **fortement** sur la blessure avec un linge propre
2. Maintenez la **pression en continu** (ne relâchez surtout pas)
3. Si le linge est imbibé, **ajoutez-en un autre par-dessus** sans retirer le premier
4. Allongez la personne et **surélévez le membre** blessé si possible

> ⚠️ **Ne jamais utiliser de garrot** sauf en cas de sauvetage extrême ( membre arraché). Le garrot doit être noté avec l'heure de pose.

## Brûlures

- **Arrosez** abondamment à l'eau froide pendant **15 minutes minimum**
- Retirez les vêtements autour de la brûlure (sauf s'ils sont collés)
- **Couvrez** avec un linge propre
- **Ne percez pas** les cloques
- **N'appliquez jamais** de pommade, beurre ou dentifrice

## Malaise cardiaque

- Asseyez la personne dans une **position demi-assise**
- **Desserrez** ses vêtements
- Demandez-lui si elle a un traitement et **aidez-la à le prendre**
- Si elle a un spray de nitroglycérine, **aidez-la à l'utiliser**
- Appelez le **15** (SAMU) immédiatement

## Perte de connaissance

### Position Latérale de Sécurité (PLS)
1. Placez le bras le plus proche du sauveteur à **angle droit**
2. Ramenez l'autre main contre la **joue**
3. Pliez la **jambe la plus éloignée**
4. **Tirez** sur la jambe fléchie pour faire rouler la personne
5. **Ouvrez les voies aériennes** (tête basculée en arrière)
6. **Surveillez** la respiration en permanence`,
      type: 'lesson',
      order: 3,
      duration: 20,
    },

    // ─── Panneaux et signalisation ───
    {
      courseId: courses['Panneaux et signalisation'],
      title: 'Les panneaux de danger',
      content: `# Les panneaux de danger

## Forme et couleur

Les panneaux de danger sont de forme **triangulaire** avec un fond **blanc**, un bord **rouge** et un **symbole noir** au centre.

## Les principaux panneaux de danger

### Virages et intersections
- **Virage dangereux** : flèche courbée
- **Succession de virages** : double flèche courbée
- **Intersection** : croisement de routes
- **Cédant le passage** : triangle inversé (pointe vers le bas)

### Profil de la route
- **Ralentisseur** (dos d'âne)
- **Descente dangereuse** (pente avec pourcentage)
- **Montée raide**
- **Passage à niveau** (croix de Saint-André)

### Autres dangers
- **Piétons** : silhouette piéton
- **Enfants** : silhouettes d'enfants
- **Cyclistes** : silhouette cycliste
- **Animaux sauvages** : silhouette de cerf
- **Chute de pierres** : rochers
- **Vent latéral** : drapeau
- **Neige / glace** : flocon
- **Brouillard** : lignes ondulées

> 💡 **Règle** : En voyant un panneau de danger, **réduisez votre vitesse** et soyez particulièrement vigilant.`,
      type: 'lesson',
      order: 1,
      duration: 20,
    },
    {
      courseId: courses['Panneaux et signalisation'],
      title: 'Les panneaux d\'interdiction et d\'obligation',
      content: `# Les panneaux d'interdiction et d'obligation

## Panneaux d'interdiction

### Forme
Ronds à fond **blanc**, bord **rouge**, avec un ou plusieurs **symboles noirs** barrés d'une **barre rouge diagonale**.

### Principaux panneaux

| Panneau | Signification |
|---------|--------------|
| Sens interdit | Accès interdit dans ce sens |
| Cercle rouge vide | Interdiction de circuler (tous véhicules) |
| Vitesse barrée | Limitation de vitesse |
| Camion barré | Interdiction aux poids lourds |
| Voiture + remorque | Interdiction aux véhicules avec remorque |
| Cycliste barré | Interdiction aux cyclistes |
| Corne de brume barrée | Interdiction de klaxonner |

### Les panneaux de fin d'interdiction
Les panneaux de fin d'interdiction sont de forme **ronde** avec un bord **gris** (noir) et des **bandes grises** (noires) en diagonale.

## Panneaux d'obligation

### Forme
Ronds à fond **bleu** avec un **symbole blanc**.

### Principaux panneaux

| Panneau | Signification |
|---------|--------------|
| Flèche blanche | Obligation de suivre cette direction |
| Vélo blanc | Piste cyclable obligatoire |
| Chaînes à neige | Équipement en chaînes obligatoire |
| Cercle bleu vide | Obligation d'aller tout droit |

> ⚠️ **Attention** : L'absence de panneau de fin d'interdiction signifie que l'interdiction reste en vigueur jusqu'au prochain carrefour.`,
      type: 'lesson',
      order: 2,
      duration: 25,
    },
    {
      courseId: courses['Panneaux et signalisation'],
      title: 'Les panneaux de direction et d\'indication',
      content: `# Les panneaux de direction et d'indication

## Panneaux d'indication

### Forme
Carrés ou rectangulaires à fond **bleu**, **vert**, **blanc** ou **brun** avec des **symboles blancs** ou **noirs**.

### Panneaux bleus (obligation / service)
- **Autoroute** : rectangle bleu avec pont
- **Stationnement** : P bleu (stationnement réglementé)
- **Sens giratoire** : flèches circulaires

### Panneaux verts (direction)

Utilisés pour l'**orientation** et les **distances** :
- **Direction** : nom des villes
- **Confirmation** : distance vers une ville
- **Dernier sorti** : information sur la prochaine sortie

### Panneaux blancs ( indication)

- **Rappel de limitation de vitesse**
- **Fin de zone** (agglomération, etc.)
- **Zones de rencontre** (carré bleu avec piéton et vélo)

### Panneaux bruns (tourisme)

- Sites touristiques
- Musées et monuments
- Aire de repos panoramique

## Le marquage au sol

| Marquage | Signification |
|----------|-------------|
| Ligne blanche continue | Interdiction de franchir |
| Ligne blanche discontinue | Autorisation de franchir |
| Ligne jaune | Stationnement ou arrêt interdit |
| Zébra (passage piéton) | Priorité aux piétons |
| Flèches peintes | Obligation de direction |
| Cédez-le-passage (triangles) | Marquage au sol complétant le panneau |

> 💡 **Rappel** : Un marquage au sol a la **même valeur juridique** qu'un panneau.`,
      type: 'lesson',
      order: 3,
      duration: 30,
    },

    // ─── Conduite nocturne ───
    {
      courseId: courses['Conduite nocturne'],
      title: 'Éclairage du véhicule',
      content: `# Éclairage du véhicule

## Les différents feux

### Feux de position (veilleuse)
- **Usage** : stationnement la nuit hors agglomération
- **Portée** : environ 30 m
- **Vitesse maximale** : impossible de circuler avec les seuls feux de position

### Feux de croisement (codes)
- **Usage** : nuit, brouillard, neige, tunnels
- **Obligation** : dès que la visibilité est < 200 m
- **Portée** : environ 30 m
- **Vitesse max recommandée** : 50 km/h en pleine nuit hors éclairage public

### Feux de route (pleins phares)
- **Usage** : routes non éclairées, hors agglomération
- **Portée** : environ 100 m
- **Interdiction** : en agglomération, en cas de croisement, derrière un véhicule, brouillard

### Feux de brouillard avant
- **Usage** : brouillard épais, neige forte, pluie battante
- Peuvent remplacer ou compléter les feux de croisement

### Feux de brouillard arrière
- **Usage** : brouillard épais (visibilité < 50 m)
- Obligatoires si vous utilisez les feux de brouillard avant

## Réglage des feux

Les feux doivent être **régulièrement vérifiés et réglés**. Un mauvais réglage peut éblouir les autres conducteurs ou réduire votre visibilité.

> ⚠️ **Oublier d'allumer ses feux** la nuit est puni d'une amende de **135 €** et d'un retrait de **4 points**.`,
      type: 'lesson',
      order: 1,
      duration: 15,
    },
    {
      courseId: courses['Conduite nocturne'],
      title: 'S\'adapter à la conduite de nuit',
      content: `# S'adapter à la conduite de nuit

## Les défis de la nuit

- **Réduction de la visibilité** : le champ de vision est considérablement réduit
- **Éblouissement** : feux des autres véhicules, reflets
- **Fatigue accrue** : la nuit perturbe le rythme circadien
- **Effet de surprise** : obstacles et piétons plus difficiles à apercevoir

## Adapter sa conduite

### Vitesse
Réduisez votre vitesse pour pouvoir **s'arrêter dans la distance éclairée** par vos feux de croisement (environ 30 m).

### La fatigue nocturne

- La conduite entre **2h et 6h** est particulièrement dangereuse
- Faites une pause toutes les **2 heures**
- Si vous ressentez des signes de somnolence : **arrêtez-vous et dormez 20 minutes**

### Faire face à l'éblouissement

- **Ne fixez pas** les phares des véhicules venant en face
- **Regardez le bord droit** de la route
- Si vous êtes ébloui : **ralentissez** sans vous arrêter brutalement
- **Nettoyez régulièrement** votre pare-brise (intérieur et extérieur)

## Les animaux la nuit

- Les yeux des animaux **réfléchissent** la lumière (points lumineux)
- En cas de présence animale : **klaxonnez longuement** et **ralentissez**
- Ne faites **jamais d'évitement brusque** : risquez de perdre le contrôle

> 💡 **Astuce** : Un pare-brise propre à l'intérieur réduit considérablement l'éblouissement. Nettoyez-le régulièrement avec un produit adapté.`,
      type: 'lesson',
      order: 2,
      duration: 15,
    },
    {
      courseId: courses['Conduite nocturne'],
      title: 'Véhicules lents et convois exceptionnels',
      content: `# Véhicules lents et convois exceptionnels de nuit

## Les véhicules lents la nuit

Les véhicules lents (tracteurs, engins agricoles, véhicules de travaux) doivent être signalés :
- **Panneau de véhicule lent** (triangle rouge avec un véhicule noir)
- **Gyrophare** ou **feux d'accompagnement**
- Marquage réfléchissant

### Comportement à adopter
- **Repérez-les de loin** grâce à leurs feux
- **Ralentissez** à l'approche
- **Dépassez avec prudence** : vérifiez la visibilité et l'espace
- Signalez votre dépassement avec un **appel de phares** (coup bref)

## Les convois exceptionnels

Les convois exceptionnels (transports de charges volumineuses) sont signalés par :
- Un **gyrophare jaune**
- Des **panneaux d'accompagnement**
- Des **véhicules pilotes** à l'avant et/ou à l'arrière

### Comportement à adopter
- **Ne dépassez jamais** un convoi exceptionnel sans l'autorisation du véhicule pilote
- **Maintenez vos distances** : les convois freinent plus lentement
- **Suivez les indications** des véhicules pilotes

## La signalisation d'urgence

En cas de danger la nuit :
- **Allumez les feux de détresse** (warnings)
- **Utilisez le triangle** de pré-signalisation
- **Portez votre gilet** haute visibilité
- **Appelez le 112**

> ⚠️ **À retenir** : La nuit, votre principal ennemi est la surprise. Anticipez, ralentissez et soyez visible.`,
      type: 'lesson',
      order: 3,
      duration: 15,
    },
  ]

  for (const m of modulesData) {
    await db.module.create({ data: m })
  }

  console.log(`  ✓ Created ${modulesData.length} modules`)

  // ═══════════════════════════════════════
  // QUESTIONS (20)
  // ═══════════════════════════════════════

  const questionsData = [
    {
      courseId: courses['Code de la route'],
      question: 'Quelle est la vitesse maximale autorisée hors agglomération sur une route à deux voies (temps sec) ?',
      options: JSON.stringify([
        '90 km/h',
        '80 km/h',
        '110 km/h',
        '70 km/h',
      ]),
      correctIndex: 1,
      explanation:
        'Depuis le 1er juillet 2018, la vitesse maximale sur les routes à deux voies sans séparateur central est de 80 km/h par temps sec.',
      difficulty: 'easy',
      category: 'regulation',
    },
    {
      courseId: courses['Code de la route'],
      question: 'En l\'absence de signalisation, quel véhicule est prioritaire à une intersection ?',
      options: JSON.stringify([
        'Le véhicule venant de gauche',
        'Le véhicule venant de droite',
        'Le véhicule le plus gros',
        'Le véhicule qui arrive en premier',
      ]),
      correctIndex: 1,
      explanation:
        'La règle générale de la priorité à droite s\'applique en l\'absence de toute signalisation. Le véhicule abordant l\'intersection par la droite est prioritaire.',
      difficulty: 'easy',
      category: 'priority',
    },
    {
      courseId: courses['Code de la route'],
      question: 'Quelle est la vitesse maximale autorisée sur autoroute par temps de pluie ?',
      options: JSON.stringify([
        '100 km/h',
        '110 km/h',
        '130 km/h',
        '90 km/h',
      ]),
      correctIndex: 1,
      explanation:
        'Par temps de pluie ou autres précipitations, la vitesse sur autoroute est limitée à 110 km/h au lieu de 130 km/h.',
      difficulty: 'easy',
      category: 'regulation',
    },
    {
      courseId: courses['Code de la route'],
      question: 'À quelle distance minimum d\'un passage pour piétons le stationnement est-il interdit ?',
      options: JSON.stringify([
        '3 mètres',
        '10 mètres',
        '5 mètres',
        '1 mètre',
      ]),
      correctIndex: 2,
      explanation:
        'Le stationnement est interdit à moins de 5 mètres d\'un passage pour piétons, mesurés du début ou de la fin du marquage.',
      difficulty: 'medium',
      category: 'regulation',
    },
    {
      courseId: courses['Sécurité routière'],
      question: 'Quel est le taux maximum d\'alcoolémie autorisé pour un jeune conducteur (permis de moins de 3 ans) ?',
      options: JSON.stringify([
        '0,5 g/L de sang',
        '0,8 g/L de sang',
        '0,2 g/L de sang',
        '0,0 g/L de sang',
      ]),
      correctIndex: 2,
      explanation:
        'Pour les jeunes conducteurs (permis probatoire, moins de 3 ans), le taux d\'alcoolémie maximal est de 0,2 g/L de sang (soit 0,10 mg/L d\'air expiré).',
      difficulty: 'medium',
      category: 'regulation',
    },
    {
      courseId: courses['Sécurité routière'],
      question: 'Quelle est la distance de sécurité minimale à respecter sur autoroute à 130 km/h ?',
      options: JSON.stringify([
        '50 mètres',
        '73 mètres',
        '91 mètres',
        '120 mètres',
      ]),
      correctIndex: 2,
      explanation:
        'Sur autoroute, la distance de sécurité correspond à 2 secondes, soit environ 91 mètres à 130 km/h. Cela correspond à 2 bandes de marquage au sol.',
      difficulty: 'medium',
      category: 'safety',
    },
    {
      courseId: courses['Code de la route'],
      question: 'Que signifie un panneau rond avec un fond bleu et une flèche blanche ?',
      options: JSON.stringify([
        'Une direction conseillée',
        'Une obligation de suivre cette direction',
        'Une indication touristique',
        'Une interdiction de tourner',
      ]),
      correctIndex: 1,
      explanation:
        'Un panneau rond à fond bleu avec un symbole blanc est un panneau d\'obligation. Il indique une direction que vous êtes obligé de suivre.',
      difficulty: 'easy',
      category: 'sign',
    },
    {
      courseId: courses['Code de la route'],
      question: 'Dans un carrefour à sens giratoire (gyro-rond-point), qui est prioritaire ?',
      options: JSON.stringify([
        'Les véhicules qui s\'insèrent',
        'Les véhicules circulant à l\'intérieur',
        'Le véhicule venant de droite',
        'Le véhicule le plus gros',
      ]),
      correctIndex: 1,
      explanation:
        'Dans un carrefour à sens giratoire signalé par un panneau, les véhicules déjà engagés à l\'intérieur sont prioritaires sur ceux qui s\'apprêtent à s\'insérer.',
      difficulty: 'easy',
      category: 'priority',
    },
    {
      courseId: courses['Sécurité routière'],
      question: 'Quelle est l\'amende pour le non-port de la ceinture de sécurité par le conducteur ?',
      options: JSON.stringify([
        '68 €',
        '90 €',
        '135 €',
        '200 €',
      ]),
      correctIndex: 2,
      explanation:
        'Le non-port de la ceinture de sécurité par le conducteur est puni d\'une amende de 135 € (contravention de 4ème classe) et d\'un retrait de 3 points.',
      difficulty: 'medium',
      category: 'regulation',
    },
    {
      courseId: courses['Conduite pratique'],
      question: 'À 50 km/h, quelle est la distance d\'arrêt approximative sur route sèche ?',
      options: JSON.stringify([
        '14 mètres',
        '25 mètres',
        '50 mètres',
        '10 mètres',
      ]),
      correctIndex: 1,
      explanation:
        'À 50 km/h sur route sèche, la distance d\'arrêt est d\'environ 25 mètres (14 m de temps de réaction + 11 m de distance de freinage).',
      difficulty: 'medium',
      category: 'safety',
    },
    {
      courseId: courses['Code de la route'],
      question: 'Un feu orange fixe au carrefour impose :',
      options: JSON.stringify([
        'D\'accélérer pour passer avant le rouge',
        'De s\'arrêter systématiquement',
        'De s\'arrêter sauf si le freinage présente un danger',
        'De ralentir sans s\'arrêter',
      ]),
      correctIndex: 2,
      explanation:
        'Le feu orange impose l\'arrêt, comme le feu rouge. Toutefois, le conducteur n\'est pas tenu de s\'arrêter si son véhicule est trop proche pour pouvoir le faire en sécurité.',
      difficulty: 'easy',
      category: 'sign',
    },
    {
      courseId: courses['Panneaux et signalisation'],
      question: 'Quelle est la forme des panneaux de danger ?',
      options: JSON.stringify([
        'Rond',
        'Carré',
        'Triangulaire',
        'Octogonal',
      ]),
      correctIndex: 2,
      explanation:
        'Les panneaux de danger sont de forme triangulaire avec un fond blanc, un bord rouge et un pictogramme noir. Ils avertissent d\'un danger à proximité.',
      difficulty: 'easy',
      category: 'sign',
    },
    {
      courseId: courses['Conduite sur autoroute'],
      question: 'Sur autoroute, la voie de gauche est :',
      options: JSON.stringify([
        'Pour la circulation rapide',
        'Réservée au dépassement uniquement',
        'Pour les véhicules de plus de 3,5 tonnes',
        'Pour les véhicules lents',
      ]),
      correctIndex: 1,
      explanation:
        'Sur autoroute, la voie de gauche est strictement réservée au dépassement. Une fois le dépassement effectué, vous devez reprendre la voie de droite.',
      difficulty: 'easy',
      category: 'regulation',
    },
    {
      courseId: courses['Premiers secours'],
      question: 'Quel est le premier réflexe à avoir en arrivant sur un accident de la route ?',
      options: JSON.stringify([
        'Secourir immédiatement les blessés',
        'Appeler les secours',
        'Protéger les lieux de l\'accident',
        'Déplacer les véhicules',
      ]),
      correctIndex: 2,
      explanation:
        'Le protocole PASE commence par PROTÉGER. Avant toute chose, il faut sécuriser les lieux pour éviter un sur-accident (feux de détresse, gilet, triangle).',
      difficulty: 'easy',
      category: 'safety',
    },
    {
      courseId: courses['Conduite nocturne'],
      question: 'En conduisant de nuit avec les feux de croisement, quelle est la vitesse maximale recommandée hors agglomération ?',
      options: JSON.stringify([
        '90 km/h',
        '70 km/h',
        '80 km/h',
        '50 km/h',
      ]),
      correctIndex: 2,
      explanation:
        'Avec les feux de croisement (portée d\'environ 30 m), la vitesse recommandée est de 80 km/h pour pouvoir s\'arrêter dans la distance éclairée. En l\'absence d\'éclairage public, on recommande 50 km/h.',
      difficulty: 'medium',
      category: 'safety',
    },
    {
      courseId: courses['Sécurité routière'],
      question: 'L\'utilisation du téléphone tenu en main en conduisant est punie de :',
      options: JSON.stringify([
        '68 € et 1 point',
        '135 € et 3 points',
        '90 € et 2 points',
        '200 € et 4 points',
      ]),
      correctIndex: 1,
      explanation:
        'L\'utilisation d\'un téléphone tenu en main pendant la conduite est punie d\'une amende de 135 € et d\'un retrait de 3 points sur le permis de conduire.',
      difficulty: 'easy',
      category: 'regulation',
    },
    {
      courseId: courses['Conduite écologique'],
      question: 'En éco-conduite, à quel régime moteur la consommation est-elle la plus faible ?',
      options: JSON.stringify([
        '3 000 à 4 000 tr/min',
        '4 000 à 5 000 tr/min',
        '1 000 à 1 200 tr/min',
        '1 500 à 2 500 tr/min',
      ]),
      correctIndex: 3,
      explanation:
        'Le régime moteur optimal pour la consommation se situe entre 1 500 et 2 500 tr/min. En dessous, le couple est insuffisant. Au-dessus, la surconsommation augmente.',
      difficulty: 'medium',
      category: 'safety',
    },
    {
      courseId: courses['Code de la route'],
      question: 'Quelle est la limitation de vitesse dans une zone de rencontre ?',
      options: JSON.stringify([
        '30 km/h',
        '20 km/h',
        '10 km/h',
        '50 km/h',
      ]),
      correctIndex: 1,
      explanation:
        'Dans les zones de rencontre, la vitesse est limitée à 20 km/h. Les piétons ont la priorité sur toute la largeur de la chaussée et peuvent circuler librement.',
      difficulty: 'medium',
      category: 'regulation',
    },
    {
      courseId: courses['Premiers secours'],
      question: 'À quelle fréquence doit-on pratiquer les compressions thoraciques lors d\'un massage cardiaque ?',
      options: JSON.stringify([
        '60 à 80 par minute',
        '80 à 100 par minute',
        '100 à 120 par minute',
        '120 à 140 par minute',
      ]),
      correctIndex: 2,
      explanation:
        'Le rythme recommandé pour les compressions thoraciques est de 100 à 120 par minute, avec une profondeur de 5 à 6 cm. Le rythme de la chanson « Stayin\' Alive » des Bee Gees (103 BPM) est un bon repère.',
      difficulty: 'medium',
      category: 'safety',
    },
    {
      courseId: courses['Panneaux et signalisation'],
      question: 'Un panneau carré bleu avec un « P » blanc indique :',
      options: JSON.stringify([
        'Un parking gratuit',
        'Un parking payant et réglementé',
        'Une zone piétonne',
        'Un passage pour piétons',
      ]),
      correctIndex: 1,
      explanation:
        'Le panneau carré bleu avec un « P » blanc indique un stationnement réglementé. Il peut être payant ou soumis à un contrôle horaire. Consultez les panneaux additionnels pour les conditions.',
      difficulty: 'easy',
      category: 'sign',
    },
  ]

  for (const q of questionsData) {
    await db.question.create({ data: q })
  }

  console.log(`  ✓ Created ${questionsData.length} questions`)

  // ═══════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════

  const demoUser = await db.user.create({
    data: {
      email: 'demo@adso.com',
      name: 'Élève Démo',
      role: 'student',
      country: 'FR',
      language: 'fr',
      subscription: 'premium',
    },
  })
  console.log(`  ✓ Created demo user: ${demoUser.email}`)

  const instructorUser = await db.user.create({
    data: {
      email: 'instructor@adso.com',
      name: 'Marie Dupont',
      role: 'instructor',
      country: 'FR',
      language: 'fr',
      subscription: 'premium',
    },
  })
  console.log(`  ✓ Created instructor user: ${instructorUser.email}`)

  // ═══════════════════════════════════════
  // ENROLLMENTS (demo user enrolled in a few courses)
  // ═══════════════════════════════════════

  const enrollmentsData = [
    { courseId: courses['Code de la route'], userId: demoUser.id },
    { courseId: courses['Sécurité routière'], userId: demoUser.id },
    { courseId: courses['Panneaux et signalisation'], userId: demoUser.id },
  ]

  for (const e of enrollmentsData) {
    await db.enrollment.create({ data: e })
  }
  console.log(`  ✓ Created ${enrollmentsData.length} enrollments`)

  // ═══════════════════════════════════════
  // STUDENT PROGRESS
  // ═══════════════════════════════════════

  const progressData = [
    {
      userId: demoUser.id,
      courseId: courses['Code de la route'],
      progress: 65,
      status: 'in_progress',
      lastAccess: new Date(),
    },
    {
      userId: demoUser.id,
      courseId: courses['Sécurité routière'],
      progress: 30,
      status: 'in_progress',
      lastAccess: new Date(),
    },
    {
      userId: demoUser.id,
      courseId: courses['Panneaux et signalisation'],
      progress: 0,
      status: 'not_started',
      lastAccess: null,
    },
  ]

  for (const p of progressData) {
    await db.studentProgress.create({ data: p })
  }
  console.log(`  ✓ Created ${progressData.length} progress records`)

  console.log('\n✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await db.$disconnect()
    process.exit(1)
  })
