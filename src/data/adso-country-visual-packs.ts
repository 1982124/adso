export type CountryVisualStatus = 'base' | 'enrich' | 'to-create' | 'to-verify';

export type AdsoCountryVisualPack = {
  code: string;
  name: string;
  visualStatus: CountryVisualStatus;
  priority: 'core' | 'progressive';
};

/** Every African country remains represented even before its local visual pack is enriched. */
export const ADSO_COUNTRY_VISUAL_PACKS: readonly AdsoCountryVisualPack[] = [
  ['DZ','Algérie'],['AO','Angola'],['BJ','Bénin'],['BW','Botswana'],['BF','Burkina Faso'],['BI','Burundi'],['CV','Cabo Verde'],['CM','Cameroun'],['CF','République centrafricaine'],['TD','Tchad'],['KM','Comores'],['CG','Congo'],['CD','République démocratique du Congo'],['CI','Côte d’Ivoire'],['DJ','Djibouti'],['EG','Égypte'],['GQ','Guinée équatoriale'],['ER','Érythrée'],['SZ','Eswatini'],['ET','Éthiopie'],['GA','Gabon'],['GM','Gambie'],['GH','Ghana'],['GN','Guinée'],['GW','Guinée-Bissau'],['KE','Kenya'],['LS','Lesotho'],['LR','Libéria'],['LY','Libye'],['MG','Madagascar'],['MW','Malawi'],['ML','Mali'],['MR','Mauritanie'],['MU','Maurice'],['MA','Maroc'],['MZ','Mozambique'],['NA','Namibie'],['NE','Niger'],['NG','Nigéria'],['RW','Rwanda'],['ST','Sao Tomé-et-Principe'],['SN','Sénégal'],['SC','Seychelles'],['SL','Sierra Leone'],['SO','Somalie'],['ZA','Afrique du Sud'],['SS','Soudan du Sud'],['SD','Soudan'],['TZ','Tanzanie'],['TG','Togo'],['TN','Tunisie'],['UG','Ouganda'],['ZM','Zambie'],['ZW','Zimbabwe'],
].map(([code, name]) => ({ code, name, visualStatus: 'base', priority: 'progressive' })) as readonly AdsoCountryVisualPack[];
