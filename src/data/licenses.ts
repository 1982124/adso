// ADSO — License Types Data
// 7 driving license types with full metadata

export interface LicenseType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: 'automobile' | 'motorcycle' | 'heavy';
  icon: string;
  minimumAge: number;
  requirements: string[];
  modules: string[];
}

export const licenseTypes: LicenseType[] = [
  {
    id: 'auto',
    name: 'Permis Auto (B)',
    shortName: 'Permis B',
    description:
      'Le permis B permet de conduire un véhicule automobile dont le poids total autorisé en charge (PTAC) n\'excède pas 3 500 kg, comportant au plus 9 places assises outre le siège du conducteur. C\'est le permis le plus courant et le premier obtenu par la majorité des conducteurs.',
    category: 'automobile',
    icon: 'Car',
    minimumAge: 18,
    requirements: [
      'Âge minimum de 18 ans révolus',
      'Certificat médical de conformité',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Attestation de formation à la conduite',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Justificatif de domicile de moins de 3 mois',
      'Avoir réussi l\'examen théorique général (ETG)',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-priorites', 'mod-conduite-base', 'mod-examen-blanc'],
  },
  {
    id: 'moto',
    name: 'Permis Moto (A)',
    shortName: 'Permis A',
    description:
      'Le permis A permet de conduire une motocyclette d\'une puissance maximale de 35 kW (47,6 ch) et dont le rapport puissance/poids n\'excède pas 0,2 kW/kg. Il s\'adresse aux motards expérimentés souhaitant conduire des motos de cylindrée moyenne à élevée.',
    category: 'motorcycle',
    icon: 'Bike',
    minimumAge: 20,
    requirements: [
      'Âge minimum de 20 ans (ou 18 ans avec permis A2 depuis 2 ans)',
      'Certificat médical de conformité',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Attestation de formation pratique moto',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Avoir validé la formation hors circulation (HCF)',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-equilibre-moto', 'mod-conduite-moto', 'mod-examen-blanc-moto'],
  },
  {
    id: 'moto-lourde',
    name: 'Permis Moto Lourde (A2)',
    shortName: 'Permis A2',
    description:
      'Le permis A2 permet de conduire une motocyclette d\'une puissance maximale de 35 kW (47,6 ch) et dont le rapport puissance/poids n\'excède pas 0,2 kW/kg. Ce permis est accessible dès 18 ans et constitue une étape vers le permis A.',
    category: 'motorcycle',
    icon: 'Bike',
    minimumAge: 18,
    requirements: [
      'Âge minimum de 18 ans',
      'Certificat médical de conformité',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Attestation de formation pratique moto',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Avoir validé la formation hors circulation (HCF)',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-equilibre-moto', 'mod-conduite-moto-a2', 'mod-examen-blanc-moto'],
  },
  {
    id: 'poids-lourds',
    name: 'Permis Poids Lourds (C)',
    shortName: 'Permis C',
    description:
      'Le permis C permet de conduire un véhicule automobile dont le poids total autorisé en charge (PTAC) excède 3 500 kg, tel qu\'un camion, à l\'exclusion de ceux destinés au transport de personnes. Ce permis est indispensable pour les professionnels du transport de marchandises.',
    category: 'heavy',
    icon: 'Truck',
    minimumAge: 21,
    requirements: [
      'Âge minimum de 21 ans révolus',
      'Certificat médical de catégorie C',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Attestation de formation à la conduite poids lourds',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Permis B en cours de validité',
      'Fichier des permis de conduire (FPC) à jour',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-priorites', 'mod-transport-marchandises', 'mod-conduite-pl', 'mod-examen-blanc-pl'],
  },
  {
    id: 'poids-lourds-remorque',
    name: 'Permis Poids Lourds + Remorque (CE)',
    shortName: 'Permis CE',
    description:
      'Le permis CE permet de conduire un ensemble de véhicules composé d\'un tracteur de la catégorie C et d\'une remorque dont le PTAC excède 750 kg. Ce permis est destiné aux conducteurs de trains routiers et de semi-remorques.',
    category: 'heavy',
    icon: 'Truck',
    minimumAge: 21,
    requirements: [
      'Âge minimum de 21 ans révolus',
      'Certificat médical de catégorie CE',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Attestation de formation à la conduite poids lourds',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Permis C en cours de validité',
      'Formation spécifique attelage et manœuvres',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-priorites', 'mod-transport-marchandises', 'mod-attelage-remorque', 'mod-conduite-ce', 'mod-examen-blanc-ce'],
  },
  {
    id: 'transport-personnes',
    name: 'Permis Transport de Personnes (D)',
    shortName: 'Permis D',
    description:
      'Le permis D permet de conduire un véhicule automobile affecté au transport de personnes et comportant plus de 8 places assises outre le siège du conducteur, tel qu\'un autocar ou un bus. Ce permis est obligatoire pour les chauffeurs de transport en commun.',
    category: 'heavy',
    icon: 'Bus',
    minimumAge: 24,
    requirements: [
      'Âge minimum de 24 ans révolus',
      'Certificat médical de catégorie D',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Attestation de formation transport de personnes',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Permis B en cours de validité',
      'FPC (Fichier Permis de Conduire) à jour',
      'Casier judiciaire vierge',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-priorites', 'mod-transport-personnes', 'mod-conduite-bus', 'mod-securite-passagers', 'mod-examen-blanc-d'],
  },
  {
    id: 'transport-marchandises',
    name: 'Permis Transport de Marchandises (C1E)',
    shortName: 'Permis C1E',
    description:
      'Le permis C1E permet de conduire un ensemble de véhicules composé d\'un tracteur de la catégorie C1 (PTAC entre 3 500 kg et 7 500 kg) et d\'une remorque dont le PTAC excède 750 kg, le PTAC total de l\'ensemble ne dépassant pas 12 000 kg. Convient pour les livraisons moyennes.',
    category: 'heavy',
    icon: 'Truck',
    minimumAge: 21,
    requirements: [
      'Âge minimum de 21 ans révolus',
      'Certificat médical de catégorie C1E',
      'Pièce d\'identité valide (CNI ou passeport)',
      '2 photos d\'identité récentes',
      'Formulaire de demande de permis de conduire (cerfa)',
      'Attestation de formation à la conduite',
      'Avoir réussi l\'examen théorique général (ETG)',
      'Permis B en cours de validité',
      'Formation spécifique attelage',
    ],
    modules: ['mod-theorie-code', 'mod-signalisation', 'mod-priorites', 'mod-transport-marchandises', 'mod-attelage-remorque', 'mod-conduite-c1e', 'mod-examen-blanc-c1e'],
  },
];

export function getLicenseTypeById(id: string): LicenseType | undefined {
  return licenseTypes.find((lt) => lt.id === id);
}
