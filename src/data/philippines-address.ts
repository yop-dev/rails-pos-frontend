// Philippines Address Data
// This is a simplified version with major locations for the POS system

export interface AddressOption {
  value: string
  label: string
  code: string
}

// Major regions in Philippines
export const regions: AddressOption[] = [
  { value: 'NCR', label: 'National Capital Region (Metro Manila)', code: 'NCR' },
  { value: 'CAR', label: 'Cordillera Administrative Region', code: 'CAR' },
  { value: 'REGION1', label: 'Region I (Ilocos Region)', code: 'REGION1' },
  { value: 'REGION2', label: 'Region II (Cagayan Valley)', code: 'REGION2' },
  { value: 'REGION3', label: 'Region III (Central Luzon)', code: 'REGION3' },
  { value: 'REGION4A', label: 'Region IV-A (CALABARZON)', code: 'REGION4A' },
  { value: 'REGION4B', label: 'Region IV-B (MIMAROPA)', code: 'REGION4B' },
  { value: 'REGION5', label: 'Region V (Bicol Region)', code: 'REGION5' },
  { value: 'REGION6', label: 'Region VI (Western Visayas)', code: 'REGION6' },
  { value: 'REGION7', label: 'Region VII (Central Visayas)', code: 'REGION7' },
  { value: 'REGION8', label: 'Region VIII (Eastern Visayas)', code: 'REGION8' },
  { value: 'REGION9', label: 'Region IX (Zamboanga Peninsula)', code: 'REGION9' },
  { value: 'REGION10', label: 'Region X (Northern Mindanao)', code: 'REGION10' },
  { value: 'REGION11', label: 'Region XI (Davao Region)', code: 'REGION11' },
  { value: 'REGION12', label: 'Region XII (SOCCSKSARGEN)', code: 'REGION12' },
  { value: 'REGION13', label: 'Region XIII (Caraga)', code: 'REGION13' },
  { value: 'BARMM', label: 'Bangsamoro Autonomous Region in Muslim Mindanao', code: 'BARMM' }
]

// Provinces by region
export const provinces: Record<string, AddressOption[]> = {
  NCR: [
    { value: 'MNL', label: 'Manila', code: 'MNL' },
    { value: 'QC', label: 'Quezon City', code: 'QC' },
    { value: 'MKT', label: 'Makati', code: 'MKT' },
    { value: 'TAY', label: 'Taguig', code: 'TAY' },
    { value: 'PAS', label: 'Pasay', code: 'PAS' },
    { value: 'BGC', label: 'Bonifacio Global City', code: 'BGC' },
    { value: 'PSG', label: 'Pasig', code: 'PSG' },
    { value: 'MAR', label: 'Marikina', code: 'MAR' },
    { value: 'SJC', label: 'San Juan', code: 'SJC' },
    { value: 'MND', label: 'Mandaluyong', code: 'MND' },
    { value: 'CAL', label: 'Caloocan', code: 'CAL' },
    { value: 'VAL', label: 'Valenzuela', code: 'VAL' },
    { value: 'NAV', label: 'Navotas', code: 'NAV' },
    { value: 'MAL', label: 'Malabon', code: 'MAL' },
    { value: 'LPA', label: 'Las Piñas', code: 'LPA' },
    { value: 'MUN', label: 'Muntinlupa', code: 'MUN' },
    { value: 'PAR', label: 'Parañaque', code: 'PAR' }
  ],
  CAR: [
    { value: 'ABR', label: 'Abra', code: 'ABR' },
    { value: 'APY', label: 'Apayao', code: 'APY' },
    { value: 'BEN', label: 'Benguet', code: 'BEN' },
    { value: 'IFU', label: 'Ifugao', code: 'IFU' },
    { value: 'KAL', label: 'Kalinga', code: 'KAL' },
    { value: 'MTN', label: 'Mountain Province', code: 'MTN' }
  ],
  REGION1: [
    { value: 'ILN', label: 'Ilocos Norte', code: 'ILN' },
    { value: 'ILS', label: 'Ilocos Sur', code: 'ILS' },
    { value: 'LUN', label: 'La Union', code: 'LUN' },
    { value: 'PAN', label: 'Pangasinan', code: 'PAN' }
  ],
  REGION2: [
    { value: 'BAT2', label: 'Batanes', code: 'BAT2' },
    { value: 'CAG', label: 'Cagayan', code: 'CAG' },
    { value: 'ISA', label: 'Isabela', code: 'ISA' },
    { value: 'NVI', label: 'Nueva Vizcaya', code: 'NVI' },
    { value: 'QUI', label: 'Quirino', code: 'QUI' }
  ],
  REGION3: [
    { value: 'BTN', label: 'Bataan', code: 'BTN' },
    { value: 'BUL', label: 'Bulacan', code: 'BUL' },
    { value: 'NVE', label: 'Nueva Ecija', code: 'NVE' },
    { value: 'PAM', label: 'Pampanga', code: 'PAM' },
    { value: 'TAR', label: 'Tarlac', code: 'TAR' },
    { value: 'ZAM', label: 'Zambales', code: 'ZAM' },
    { value: 'AUR', label: 'Aurora', code: 'AUR' }
  ],
  REGION4A: [
    { value: 'BAT', label: 'Batangas', code: 'BAT' },
    { value: 'CAV', label: 'Cavite', code: 'CAV' },
    { value: 'LAG', label: 'Laguna', code: 'LAG' },
    { value: 'QUE', label: 'Quezon', code: 'QUE' },
    { value: 'RIZ', label: 'Rizal', code: 'RIZ' }
  ],
  REGION4B: [
    { value: 'MAR2', label: 'Marinduque', code: 'MAR2' },
    { value: 'OCC', label: 'Occidental Mindoro', code: 'OCC' },
    { value: 'ORI', label: 'Oriental Mindoro', code: 'ORI' },
    { value: 'PAL', label: 'Palawan', code: 'PAL' },
    { value: 'ROM', label: 'Romblon', code: 'ROM' }
  ],
  REGION5: [
    { value: 'ALB', label: 'Albay', code: 'ALB' },
    { value: 'CAM', label: 'Camarines Norte', code: 'CAM' },
    { value: 'CAS', label: 'Camarines Sur', code: 'CAS' },
    { value: 'CAT', label: 'Catanduanes', code: 'CAT' },
    { value: 'MAS', label: 'Masbate', code: 'MAS' },
    { value: 'SOR', label: 'Sorsogon', code: 'SOR' }
  ],
  REGION6: [
    { value: 'AKL', label: 'Aklan', code: 'AKL' },
    { value: 'ANT', label: 'Antique', code: 'ANT' },
    { value: 'CAP', label: 'Capiz', code: 'CAP' },
    { value: 'GDR', label: 'Guimaras', code: 'GDR' },
    { value: 'ILO', label: 'Iloilo', code: 'ILO' },
    { value: 'NEG2', label: 'Negros Occidental', code: 'NEG2' }
  ],
  REGION7: [
    { value: 'BOH', label: 'Bohol', code: 'BOH' },
    { value: 'CEB', label: 'Cebu', code: 'CEB' },
    { value: 'NEG', label: 'Negros Oriental', code: 'NEG' },
    { value: 'SIQ', label: 'Siquijor', code: 'SIQ' }
  ],
  REGION8: [
    { value: 'BIL', label: 'Biliran', code: 'BIL' },
    { value: 'EAS', label: 'Eastern Samar', code: 'EAS' },
    { value: 'LEY', label: 'Leyte', code: 'LEY' },
    { value: 'NOR', label: 'Northern Samar', code: 'NOR' },
    { value: 'SAM', label: 'Samar', code: 'SAM' },
    { value: 'SOU', label: 'Southern Leyte', code: 'SOU' }
  ],
  REGION9: [
    { value: 'ZAN', label: 'Zamboanga del Norte', code: 'ZAN' },
    { value: 'ZAS', label: 'Zamboanga del Sur', code: 'ZAS' },
    { value: 'ZSI', label: 'Zamboanga Sibugay', code: 'ZSI' }
  ],
  REGION10: [
    { value: 'BUK', label: 'Bukidnon', code: 'BUK' },
    { value: 'CAM2', label: 'Camiguin', code: 'CAM2' },
    { value: 'LAN', label: 'Lanao del Norte', code: 'LAN' },
    { value: 'MIS', label: 'Misamis Occidental', code: 'MIS' },
    { value: 'MOR', label: 'Misamis Oriental', code: 'MOR' }
  ],
  REGION11: [
    { value: 'COM', label: 'Davao de Oro', code: 'COM' },
    { value: 'DAV', label: 'Davao del Norte', code: 'DAV' },
    { value: 'DAS', label: 'Davao del Sur', code: 'DAS' },
    { value: 'DAO', label: 'Davao Occidental', code: 'DAO' },
    { value: 'DAR', label: 'Davao Oriental', code: 'DAR' }
  ],
  REGION12: [
    { value: 'COT', label: 'Cotabato', code: 'COT' },
    { value: 'SAR', label: 'Sarangani', code: 'SAR' },
    { value: 'SCO', label: 'South Cotabato', code: 'SCO' },
    { value: 'SUL', label: 'Sultan Kudarat', code: 'SUL' }
  ],
  REGION13: [
    { value: 'AGU', label: 'Agusan del Norte', code: 'AGU' },
    { value: 'AGS', label: 'Agusan del Sur', code: 'AGS' },
    { value: 'DIN', label: 'Dinagat Islands', code: 'DIN' },
    { value: 'SUN', label: 'Surigao del Norte', code: 'SUN' },
    { value: 'SUS', label: 'Surigao del Sur', code: 'SUS' }
  ],
  BARMM: [
    { value: 'BAS', label: 'Basilan', code: 'BAS' },
    { value: 'LAS', label: 'Lanao del Sur', code: 'LAS' },
    { value: 'MAG', label: 'Maguindanao del Norte', code: 'MAG' },
    { value: 'MAS2', label: 'Maguindanao del Sur', code: 'MAS2' },
    { value: 'SUL2', label: 'Sulu', code: 'SUL2' },
    { value: 'TAW', label: 'Tawi-Tawi', code: 'TAW' }
  ]
}

// Cities by province (simplified list with major cities)
export const cities: Record<string, AddressOption[]> = {
  // NCR
  MNL: [
    { value: 'MNL_CITY', label: 'Manila City', code: 'MNL_CITY' },
    { value: 'MNL_OTHER', label: 'Other', code: 'MNL_OTHER' }
  ],
  QC: [
    { value: 'QC_CITY', label: 'Quezon City', code: 'QC_CITY' },
    { value: 'QC_OTHER', label: 'Other', code: 'QC_OTHER' }
  ],
  MKT: [
    { value: 'MKT_CITY', label: 'Makati City', code: 'MKT_CITY' },
    { value: 'MKT_OTHER', label: 'Other', code: 'MKT_OTHER' }
  ],
  TAY: [
    { value: 'TAY_CITY', label: 'Taguig City', code: 'TAY_CITY' },
    { value: 'TAY_OTHER', label: 'Other', code: 'TAY_OTHER' }
  ],
  PAS: [
    { value: 'PAS_CITY', label: 'Pasay City', code: 'PAS_CITY' },
    { value: 'PAS_OTHER', label: 'Other', code: 'PAS_OTHER' }
  ],
  PSG: [
    { value: 'PSG_CITY', label: 'Pasig City', code: 'PSG_CITY' },
    { value: 'PSG_OTHER', label: 'Other', code: 'PSG_OTHER' }
  ],
  MAR: [
    { value: 'MAR_CITY', label: 'Marikina City', code: 'MAR_CITY' },
    { value: 'MAR_OTHER', label: 'Other', code: 'MAR_OTHER' }
  ],
  SJC: [
    { value: 'SJC_CITY', label: 'San Juan City', code: 'SJC_CITY' },
    { value: 'SJC_OTHER', label: 'Other', code: 'SJC_OTHER' }
  ],
  MND: [
    { value: 'MND_CITY', label: 'Mandaluyong City', code: 'MND_CITY' },
    { value: 'MND_OTHER', label: 'Other', code: 'MND_OTHER' }
  ],
  CAL: [
    { value: 'CAL_CITY', label: 'Caloocan City', code: 'CAL_CITY' },
    { value: 'CAL_OTHER', label: 'Other', code: 'CAL_OTHER' }
  ],
  VAL: [
    { value: 'VAL_CITY', label: 'Valenzuela City', code: 'VAL_CITY' },
    { value: 'VAL_OTHER', label: 'Other', code: 'VAL_OTHER' }
  ],
  NAV: [
    { value: 'NAV_CITY', label: 'Navotas City', code: 'NAV_CITY' },
    { value: 'NAV_OTHER', label: 'Other', code: 'NAV_OTHER' }
  ],
  MAL: [
    { value: 'MAL_CITY', label: 'Malabon City', code: 'MAL_CITY' },
    { value: 'MAL_OTHER', label: 'Other', code: 'MAL_OTHER' }
  ],
  LPA: [
    { value: 'LPA_CITY', label: 'Las Piñas City', code: 'LPA_CITY' },
    { value: 'LPA_OTHER', label: 'Other', code: 'LPA_OTHER' }
  ],
  MUN: [
    { value: 'MUN_CITY', label: 'Muntinlupa City', code: 'MUN_CITY' },
    { value: 'MUN_OTHER', label: 'Other', code: 'MUN_OTHER' }
  ],
  PAR: [
    { value: 'PAR_CITY', label: 'Parañaque City', code: 'PAR_CITY' },
    { value: 'PAR_OTHER', label: 'Other', code: 'PAR_OTHER' }
  ],
  BGC: [
    { value: 'BGC_AREA', label: 'BGC Area', code: 'BGC_AREA' },
    { value: 'BGC_OTHER', label: 'Other', code: 'BGC_OTHER' }
  ],
  
  // CAR
  ABR: [
    { value: 'ABR_BANGUED', label: 'Bangued', code: 'ABR_BANGUED' },
    { value: 'ABR_OTHER', label: 'Other Municipality', code: 'ABR_OTHER' }
  ],
  APY: [
    { value: 'APY_KABUGAO', label: 'Kabugao', code: 'APY_KABUGAO' },
    { value: 'APY_OTHER', label: 'Other Municipality', code: 'APY_OTHER' }
  ],
  BEN: [
    { value: 'BEN_BAGUIO', label: 'Baguio City', code: 'BEN_BAGUIO' },
    { value: 'BEN_TUBA', label: 'Tuba', code: 'BEN_TUBA' },
    { value: 'BEN_OTHER', label: 'Other Municipality', code: 'BEN_OTHER' }
  ],
  IFU: [
    { value: 'IFU_LAGAWE', label: 'Lagawe', code: 'IFU_LAGAWE' },
    { value: 'IFU_OTHER', label: 'Other Municipality', code: 'IFU_OTHER' }
  ],
  KAL: [
    { value: 'KAL_TABUK', label: 'Tabuk City', code: 'KAL_TABUK' },
    { value: 'KAL_OTHER', label: 'Other Municipality', code: 'KAL_OTHER' }
  ],
  MTN: [
    { value: 'MTN_BONTOC', label: 'Bontoc', code: 'MTN_BONTOC' },
    { value: 'MTN_OTHER', label: 'Other Municipality', code: 'MTN_OTHER' }
  ],
  
  // REGION1
  ILN: [
    { value: 'ILN_LAOAG', label: 'Laoag City', code: 'ILN_LAOAG' },
    { value: 'ILN_BATAC', label: 'Batac City', code: 'ILN_BATAC' },
    { value: 'ILN_OTHER', label: 'Other Municipality', code: 'ILN_OTHER' }
  ],
  ILS: [
    { value: 'ILS_VIGAN', label: 'Vigan City', code: 'ILS_VIGAN' },
    { value: 'ILS_CANDON', label: 'Candon City', code: 'ILS_CANDON' },
    { value: 'ILS_OTHER', label: 'Other Municipality', code: 'ILS_OTHER' }
  ],
  LUN: [
    { value: 'LUN_SANFER', label: 'San Fernando City', code: 'LUN_SANFER' },
    { value: 'LUN_BAUANG', label: 'Bauang', code: 'LUN_BAUANG' },
    { value: 'LUN_OTHER', label: 'Other Municipality', code: 'LUN_OTHER' }
  ],
  PAN: [
    { value: 'PAN_DAGUPAN', label: 'Dagupan City', code: 'PAN_DAGUPAN' },
    { value: 'PAN_ALAMINOS', label: 'Alaminos City', code: 'PAN_ALAMINOS' },
    { value: 'PAN_OTHER', label: 'Other Municipality', code: 'PAN_OTHER' }
  ],
  
  // REGION2
  BAT2: [
    { value: 'BAT2_BASCO', label: 'Basco', code: 'BAT2_BASCO' },
    { value: 'BAT2_OTHER', label: 'Other Municipality', code: 'BAT2_OTHER' }
  ],
  CAG: [
    { value: 'CAG_TUGUEGARAO', label: 'Tuguegarao City', code: 'CAG_TUGUEGARAO' },
    { value: 'CAG_OTHER', label: 'Other Municipality', code: 'CAG_OTHER' }
  ],
  ISA: [
    { value: 'ISA_ILAGAN', label: 'Ilagan City', code: 'ISA_ILAGAN' },
    { value: 'ISA_SANTIAGO', label: 'Santiago City', code: 'ISA_SANTIAGO' },
    { value: 'ISA_OTHER', label: 'Other Municipality', code: 'ISA_OTHER' }
  ],
  NVI: [
    { value: 'NVI_BAYOMBONG', label: 'Bayombong', code: 'NVI_BAYOMBONG' },
    { value: 'NVI_OTHER', label: 'Other Municipality', code: 'NVI_OTHER' }
  ],
  QUI: [
    { value: 'QUI_CABARROGUIS', label: 'Cabarroguis', code: 'QUI_CABARROGUIS' },
    { value: 'QUI_OTHER', label: 'Other Municipality', code: 'QUI_OTHER' }
  ],
  
  // REGION3
  BTN: [
    { value: 'BTN_BALANGA', label: 'Balanga City', code: 'BTN_BALANGA' },
    { value: 'BTN_OTHER', label: 'Other Municipality', code: 'BTN_OTHER' }
  ],
  BUL: [
    { value: 'BUL_MALOLOS', label: 'Malolos City', code: 'BUL_MALOLOS' },
    { value: 'BUL_MEYCAUAYAN', label: 'Meycauayan City', code: 'BUL_MEYCAUAYAN' },
    { value: 'BUL_OTHER', label: 'Other Municipality', code: 'BUL_OTHER' }
  ],
  NVE: [
    { value: 'NVE_CABANATUAN', label: 'Cabanatuan City', code: 'NVE_CABANATUAN' },
    { value: 'NVE_GAPAN', label: 'Gapan City', code: 'NVE_GAPAN' },
    { value: 'NVE_OTHER', label: 'Other Municipality', code: 'NVE_OTHER' }
  ],
  PAM: [
    { value: 'PAM_SAN_FERNANDO', label: 'San Fernando City', code: 'PAM_SAN_FERNANDO' },
    { value: 'PAM_ANGELES', label: 'Angeles City', code: 'PAM_ANGELES' },
    { value: 'PAM_OTHER', label: 'Other Municipality', code: 'PAM_OTHER' }
  ],
  TAR: [
    { value: 'TAR_TARLAC_CITY', label: 'Tarlac City', code: 'TAR_TARLAC_CITY' },
    { value: 'TAR_OTHER', label: 'Other Municipality', code: 'TAR_OTHER' }
  ],
  ZAM: [
    { value: 'ZAM_OLONGAPO', label: 'Olongapo City', code: 'ZAM_OLONGAPO' },
    { value: 'ZAM_IBA', label: 'Iba', code: 'ZAM_IBA' },
    { value: 'ZAM_OTHER', label: 'Other Municipality', code: 'ZAM_OTHER' }
  ],
  AUR: [
    { value: 'AUR_BALER', label: 'Baler', code: 'AUR_BALER' },
    { value: 'AUR_OTHER', label: 'Other Municipality', code: 'AUR_OTHER' }
  ],
  
  // REGION4A (CALABARZON)
  BAT: [
    { value: 'BAT_BATANGAS_CITY', label: 'Batangas City', code: 'BAT_BATANGAS_CITY' },
    { value: 'BAT_LIPA', label: 'Lipa City', code: 'BAT_LIPA' },
    { value: 'BAT_OTHER', label: 'Other Municipality', code: 'BAT_OTHER' }
  ],
  CAV: [
    { value: 'CAV_DASMA', label: 'Dasmariñas', code: 'CAV_DASMA' },
    { value: 'CAV_IMUS', label: 'Imus', code: 'CAV_IMUS' },
    { value: 'CAV_BAC', label: 'Bacoor', code: 'CAV_BAC' },
    { value: 'CAV_CW', label: 'Cavite City', code: 'CAV_CW' },
    { value: 'CAV_OTHER', label: 'Other Municipality', code: 'CAV_OTHER' }
  ],
  LAG: [
    { value: 'LAG_SC', label: 'Santa Cruz', code: 'LAG_SC' },
    { value: 'LAG_CB', label: 'Calamba', code: 'LAG_CB' },
    { value: 'LAG_SLB', label: 'San Pablo', code: 'LAG_SLB' },
    { value: 'LAG_BIN', label: 'Biñan', code: 'LAG_BIN' },
    { value: 'LAG_OTHER', label: 'Other Municipality', code: 'LAG_OTHER' }
  ],
  QUE: [
    { value: 'QUE_LUCENA', label: 'Lucena City', code: 'QUE_LUCENA' },
    { value: 'QUE_TAYABAS', label: 'Tayabas City', code: 'QUE_TAYABAS' },
    { value: 'QUE_OTHER', label: 'Other Municipality', code: 'QUE_OTHER' }
  ],
  RIZ: [
    { value: 'RIZ_ANTIPOLO', label: 'Antipolo City', code: 'RIZ_ANTIPOLO' },
    { value: 'RIZ_CAINTA', label: 'Cainta', code: 'RIZ_CAINTA' },
    { value: 'RIZ_OTHER', label: 'Other Municipality', code: 'RIZ_OTHER' }
  ],
  
  // Add cities for all other provinces with at least one main city/municipality and "Other" option
  MAR2: [{ value: 'MAR2_BOAC', label: 'Boac', code: 'MAR2_BOAC' }, { value: 'MAR2_OTHER', label: 'Other Municipality', code: 'MAR2_OTHER' }],
  OCC: [{ value: 'OCC_MAMBURAO', label: 'Mamburao', code: 'OCC_MAMBURAO' }, { value: 'OCC_OTHER', label: 'Other Municipality', code: 'OCC_OTHER' }],
  ORI: [{ value: 'ORI_CALAPAN', label: 'Calapan City', code: 'ORI_CALAPAN' }, { value: 'ORI_OTHER', label: 'Other Municipality', code: 'ORI_OTHER' }],
  PAL: [{ value: 'PAL_PUERTO_PRINCESA', label: 'Puerto Princesa City', code: 'PAL_PUERTO_PRINCESA' }, { value: 'PAL_OTHER', label: 'Other Municipality', code: 'PAL_OTHER' }],
  ROM: [{ value: 'ROM_ROMBLON', label: 'Romblon', code: 'ROM_ROMBLON' }, { value: 'ROM_OTHER', label: 'Other Municipality', code: 'ROM_OTHER' }],
  
  ALB: [{ value: 'ALB_LEGAZPI', label: 'Legazpi City', code: 'ALB_LEGAZPI' }, { value: 'ALB_OTHER', label: 'Other Municipality', code: 'ALB_OTHER' }],
  CAM: [{ value: 'CAM_DAET', label: 'Daet', code: 'CAM_DAET' }, { value: 'CAM_OTHER', label: 'Other Municipality', code: 'CAM_OTHER' }],
  CAS: [{ value: 'CAS_NAGA', label: 'Naga City', code: 'CAS_NAGA' }, { value: 'CAS_OTHER', label: 'Other Municipality', code: 'CAS_OTHER' }],
  CAT: [{ value: 'CAT_VIRAC', label: 'Virac', code: 'CAT_VIRAC' }, { value: 'CAT_OTHER', label: 'Other Municipality', code: 'CAT_OTHER' }],
  MAS: [{ value: 'MAS_MASBATE_CITY', label: 'Masbate City', code: 'MAS_MASBATE_CITY' }, { value: 'MAS_OTHER', label: 'Other Municipality', code: 'MAS_OTHER' }],
  SOR: [{ value: 'SOR_SORSOGON_CITY', label: 'Sorsogon City', code: 'SOR_SORSOGON_CITY' }, { value: 'SOR_OTHER', label: 'Other Municipality', code: 'SOR_OTHER' }],
  
  AKL: [{ value: 'AKL_KALIBO', label: 'Kalibo', code: 'AKL_KALIBO' }, { value: 'AKL_OTHER', label: 'Other Municipality', code: 'AKL_OTHER' }],
  ANT: [{ value: 'ANT_SAN_JOSE', label: 'San Jose de Buenavista', code: 'ANT_SAN_JOSE' }, { value: 'ANT_OTHER', label: 'Other Municipality', code: 'ANT_OTHER' }],
  CAP: [{ value: 'CAP_ROXAS', label: 'Roxas City', code: 'CAP_ROXAS' }, { value: 'CAP_OTHER', label: 'Other Municipality', code: 'CAP_OTHER' }],
  GDR: [{ value: 'GDR_JORDAN', label: 'Jordan', code: 'GDR_JORDAN' }, { value: 'GDR_OTHER', label: 'Other Municipality', code: 'GDR_OTHER' }],
  ILO: [{ value: 'ILO_ILOILO_CITY', label: 'Iloilo City', code: 'ILO_ILOILO_CITY' }, { value: 'ILO_OTHER', label: 'Other Municipality', code: 'ILO_OTHER' }],
  NEG2: [{ value: 'NEG2_BACOLOD', label: 'Bacolod City', code: 'NEG2_BACOLOD' }, { value: 'NEG2_OTHER', label: 'Other Municipality', code: 'NEG2_OTHER' }],
  
  BOH: [{ value: 'BOH_TAGBILARAN', label: 'Tagbilaran City', code: 'BOH_TAGBILARAN' }, { value: 'BOH_OTHER', label: 'Other Municipality', code: 'BOH_OTHER' }],
  CEB: [
    { value: 'CEB_CITY', label: 'Cebu City', code: 'CEB_CITY' },
    { value: 'CEB_LAP', label: 'Lapu-Lapu', code: 'CEB_LAP' },
    { value: 'CEB_MAN', label: 'Mandaue', code: 'CEB_MAN' },
    { value: 'CEB_TOL', label: 'Toledo', code: 'CEB_TOL' },
    { value: 'CEB_OTHER', label: 'Other Municipality', code: 'CEB_OTHER' }
  ],
  NEG: [{ value: 'NEG_DUMAGUETE', label: 'Dumaguete City', code: 'NEG_DUMAGUETE' }, { value: 'NEG_OTHER', label: 'Other Municipality', code: 'NEG_OTHER' }],
  SIQ: [{ value: 'SIQ_SIQUIJOR', label: 'Siquijor', code: 'SIQ_SIQUIJOR' }, { value: 'SIQ_OTHER', label: 'Other Municipality', code: 'SIQ_OTHER' }],
  
  // Continue for remaining regions...
  BIL: [{ value: 'BIL_NAVAL', label: 'Naval', code: 'BIL_NAVAL' }, { value: 'BIL_OTHER', label: 'Other Municipality', code: 'BIL_OTHER' }],
  EAS: [{ value: 'EAS_BORONGAN', label: 'Borongan City', code: 'EAS_BORONGAN' }, { value: 'EAS_OTHER', label: 'Other Municipality', code: 'EAS_OTHER' }],
  LEY: [{ value: 'LEY_TACLOBAN', label: 'Tacloban City', code: 'LEY_TACLOBAN' }, { value: 'LEY_OTHER', label: 'Other Municipality', code: 'LEY_OTHER' }],
  NOR: [{ value: 'NOR_CATARMAN', label: 'Catarman', code: 'NOR_CATARMAN' }, { value: 'NOR_OTHER', label: 'Other Municipality', code: 'NOR_OTHER' }],
  SAM: [{ value: 'SAM_CATBALOGAN', label: 'Catbalogan City', code: 'SAM_CATBALOGAN' }, { value: 'SAM_OTHER', label: 'Other Municipality', code: 'SAM_OTHER' }],
  SOU: [{ value: 'SOU_MAASIN', label: 'Maasin City', code: 'SOU_MAASIN' }, { value: 'SOU_OTHER', label: 'Other Municipality', code: 'SOU_OTHER' }],
  
  ZAN: [{ value: 'ZAN_DIPOLOG', label: 'Dipolog City', code: 'ZAN_DIPOLOG' }, { value: 'ZAN_OTHER', label: 'Other Municipality', code: 'ZAN_OTHER' }],
  ZAS: [{ value: 'ZAS_PAGADIAN', label: 'Pagadian City', code: 'ZAS_PAGADIAN' }, { value: 'ZAS_OTHER', label: 'Other Municipality', code: 'ZAS_OTHER' }],
  ZSI: [{ value: 'ZSI_IPIL', label: 'Ipil', code: 'ZSI_IPIL' }, { value: 'ZSI_OTHER', label: 'Other Municipality', code: 'ZSI_OTHER' }],
  
  BUK: [{ value: 'BUK_MALAYBALAY', label: 'Malaybalay City', code: 'BUK_MALAYBALAY' }, { value: 'BUK_OTHER', label: 'Other Municipality', code: 'BUK_OTHER' }],
  CAM2: [{ value: 'CAM2_MAMBAJAO', label: 'Mambajao', code: 'CAM2_MAMBAJAO' }, { value: 'CAM2_OTHER', label: 'Other Municipality', code: 'CAM2_OTHER' }],
  LAN: [{ value: 'LAN_ILIGAN', label: 'Iligan City', code: 'LAN_ILIGAN' }, { value: 'LAN_OTHER', label: 'Other Municipality', code: 'LAN_OTHER' }],
  MIS: [{ value: 'MIS_OROQUIETA', label: 'Oroquieta City', code: 'MIS_OROQUIETA' }, { value: 'MIS_OTHER', label: 'Other Municipality', code: 'MIS_OTHER' }],
  MOR: [{ value: 'MOR_CAGAYAN_DE_ORO', label: 'Cagayan de Oro City', code: 'MOR_CAGAYAN_DE_ORO' }, { value: 'MOR_OTHER', label: 'Other Municipality', code: 'MOR_OTHER' }],
  
  COM: [{ value: 'COM_NABUNTURAN', label: 'Nabunturan', code: 'COM_NABUNTURAN' }, { value: 'COM_OTHER', label: 'Other Municipality', code: 'COM_OTHER' }],
  DAV: [{ value: 'DAV_TAGUM', label: 'Tagum City', code: 'DAV_TAGUM' }, { value: 'DAV_OTHER', label: 'Other Municipality', code: 'DAV_OTHER' }],
  DAS: [{ value: 'DAS_DAVAO_CITY', label: 'Davao City', code: 'DAS_DAVAO_CITY' }, { value: 'DAS_OTHER', label: 'Other Municipality', code: 'DAS_OTHER' }],
  DAO: [{ value: 'DAO_MALITA', label: 'Malita', code: 'DAO_MALITA' }, { value: 'DAO_OTHER', label: 'Other Municipality', code: 'DAO_OTHER' }],
  DAR: [{ value: 'DAR_MATI', label: 'Mati City', code: 'DAR_MATI' }, { value: 'DAR_OTHER', label: 'Other Municipality', code: 'DAR_OTHER' }],
  
  COT: [{ value: 'COT_KIDAPAWAN', label: 'Kidapawan City', code: 'COT_KIDAPAWAN' }, { value: 'COT_OTHER', label: 'Other Municipality', code: 'COT_OTHER' }],
  SAR: [{ value: 'SAR_ALABEL', label: 'Alabel', code: 'SAR_ALABEL' }, { value: 'SAR_OTHER', label: 'Other Municipality', code: 'SAR_OTHER' }],
  SCO: [{ value: 'SCO_KORONADAL', label: 'Koronadal City', code: 'SCO_KORONADAL' }, { value: 'SCO_OTHER', label: 'Other Municipality', code: 'SCO_OTHER' }],
  SUL: [{ value: 'SUL_ISULAN', label: 'Isulan', code: 'SUL_ISULAN' }, { value: 'SUL_OTHER', label: 'Other Municipality', code: 'SUL_OTHER' }],
  
  AGU: [{ value: 'AGU_BUTUAN', label: 'Butuan City', code: 'AGU_BUTUAN' }, { value: 'AGU_OTHER', label: 'Other Municipality', code: 'AGU_OTHER' }],
  AGS: [{ value: 'AGS_BAYUGAN', label: 'Bayugan City', code: 'AGS_BAYUGAN' }, { value: 'AGS_OTHER', label: 'Other Municipality', code: 'AGS_OTHER' }],
  DIN: [{ value: 'DIN_SAN_JOSE', label: 'San Jose', code: 'DIN_SAN_JOSE' }, { value: 'DIN_OTHER', label: 'Other Municipality', code: 'DIN_OTHER' }],
  SUN: [{ value: 'SUN_SURIGAO_CITY', label: 'Surigao City', code: 'SUN_SURIGAO_CITY' }, { value: 'SUN_OTHER', label: 'Other Municipality', code: 'SUN_OTHER' }],
  SUS: [{ value: 'SUS_TANDAG', label: 'Tandag City', code: 'SUS_TANDAG' }, { value: 'SUS_OTHER', label: 'Other Municipality', code: 'SUS_OTHER' }],
  
  BAS: [{ value: 'BAS_ISABELA_CITY', label: 'Isabela City', code: 'BAS_ISABELA_CITY' }, { value: 'BAS_OTHER', label: 'Other Municipality', code: 'BAS_OTHER' }],
  LAS: [{ value: 'LAS_MARAWI', label: 'Marawi City', code: 'LAS_MARAWI' }, { value: 'LAS_OTHER', label: 'Other Municipality', code: 'LAS_OTHER' }],
  MAG: [{ value: 'MAG_BULUAN', label: 'Buluan', code: 'MAG_BULUAN' }, { value: 'MAG_OTHER', label: 'Other Municipality', code: 'MAG_OTHER' }],
  MAS2: [{ value: 'MAS2_COTABATO_CITY', label: 'Cotabato City', code: 'MAS2_COTABATO_CITY' }, { value: 'MAS2_OTHER', label: 'Other Municipality', code: 'MAS2_OTHER' }],
  SUL2: [{ value: 'SUL2_JOLO', label: 'Jolo', code: 'SUL2_JOLO' }, { value: 'SUL2_OTHER', label: 'Other Municipality', code: 'SUL2_OTHER' }],
  TAW: [{ value: 'TAW_BONGAO', label: 'Bongao', code: 'TAW_BONGAO' }, { value: 'TAW_OTHER', label: 'Other Municipality', code: 'TAW_OTHER' }]
}

// Sample barangays by city (limited list for demonstration)
export const barangays: Record<string, AddressOption[]> = {
  MNL_CITY: [
    { value: 'MNL_BINONDO', label: 'Binondo', code: 'MNL_BINONDO' },
    { value: 'MNL_INTRAMUROS', label: 'Intramuros', code: 'MNL_INTRAMUROS' },
    { value: 'MNL_MALATE', label: 'Malate', code: 'MNL_MALATE' },
    { value: 'MNL_ERMITA', label: 'Ermita', code: 'MNL_ERMITA' },
    { value: 'MNL_STACRUZ', label: 'Sta. Cruz', code: 'MNL_STACRUZ' },
    { value: 'MNL_QUIAPO', label: 'Quiapo', code: 'MNL_QUIAPO' },
    { value: 'MNL_SAMPALOC', label: 'Sampaloc', code: 'MNL_SAMPALOC' },
    { value: 'MNL_OTHER', label: 'Other Barangay', code: 'MNL_OTHER' }
  ],
  QC_CITY: [
    { value: 'QC_DILIMAN', label: 'Diliman', code: 'QC_DILIMAN' },
    { value: 'QC_QUEZONHILL', label: 'Quezon Hill', code: 'QC_QUEZONHILL' },
    { value: 'QC_CUBAO', label: 'Cubao', code: 'QC_CUBAO' },
    { value: 'QC_FAIRVIEW', label: 'Fairview', code: 'QC_FAIRVIEW' },
    { value: 'QC_NOVALICHES', label: 'Novaliches', code: 'QC_NOVALICHES' },
    { value: 'QC_PROJECT2', label: 'Project 2', code: 'QC_PROJECT2' },
    { value: 'QC_PROJECT3', label: 'Project 3', code: 'QC_PROJECT3' },
    { value: 'QC_OTHER', label: 'Other Barangay', code: 'QC_OTHER' }
  ],
  MKT_CITY: [
    { value: 'MKT_POBLACION', label: 'Poblacion', code: 'MKT_POBLACION' },
    { value: 'MKT_BELMONTE', label: 'Bel-Air', code: 'MKT_BELMONTE' },
    { value: 'MKT_DASMA', label: 'Dasmariñas Village', code: 'MKT_DASMA' },
    { value: 'MKT_FORBES', label: 'Forbes Park', code: 'MKT_FORBES' },
    { value: 'MKT_LEGASPI', label: 'Legaspi Village', code: 'MKT_LEGASPI' },
    { value: 'MKT_SALCEDO', label: 'Salcedo Village', code: 'MKT_SALCEDO' },
    { value: 'MKT_OTHER', label: 'Other Barangay', code: 'MKT_OTHER' }
  ],
  CEB_CITY: [
    { value: 'CEB_LAHUG', label: 'Lahug', code: 'CEB_LAHUG' },
    { value: 'CEB_IT_PARK', label: 'Apas (IT Park)', code: 'CEB_IT_PARK' },
    { value: 'CEB_CAPITOL', label: 'Capitol Site', code: 'CEB_CAPITOL' },
    { value: 'CEB_COLON', label: 'Colon', code: 'CEB_COLON' },
    { value: 'CEB_FUENTE', label: 'Fuente', code: 'CEB_FUENTE' },
    { value: 'CEB_OTHER', label: 'Other Barangay', code: 'CEB_OTHER' }
  ]
}

// Default fallback options
const DEFAULT_BARANGAY_OPTIONS: AddressOption[] = [
  { value: 'POBLACION', label: 'Poblacion', code: 'POBLACION' },
  { value: 'BARANGAY_1', label: 'Barangay 1', code: 'BARANGAY_1' },
  { value: 'OTHER_BARANGAY', label: 'Other Barangay', code: 'OTHER_BARANGAY' }
]

// Postal codes mapping (simplified)
export const postalCodes: Record<string, string> = {
  MNL_BINONDO: '1006',
  MNL_INTRAMUROS: '1002',
  MNL_MALATE: '1004',
  MNL_ERMITA: '1000',
  MNL_STACRUZ: '1003',
  MNL_QUIAPO: '1001',
  QC_DILIMAN: '1101',
  QC_CUBAO: '1109',
  QC_FAIRVIEW: '1118',
  MKT_POBLACION: '1200',
  MKT_LEGASPI: '1229',
  MKT_SALCEDO: '1227',
  CEB_LAHUG: '6000',
  CEB_IT_PARK: '6000',
  CEB_CAPITOL: '6000'
}

// Helper functions
export function getProvinces(regionCode: string): AddressOption[] {
  return provinces[regionCode] || []
}

export function getCities(provinceCode: string): AddressOption[] {
  const citiesForProvince = cities[provinceCode]
  if (citiesForProvince && citiesForProvince.length > 0) {
    return citiesForProvince
  }
  // If no cities are defined for this province, provide a generic fallback
  return [
    { value: `${provinceCode}_MAIN`, label: 'Main City/Municipality', code: `${provinceCode}_MAIN` },
    { value: `${provinceCode}_OTHER`, label: 'Other Municipality', code: `${provinceCode}_OTHER` }
  ]
}

export function getBarangays(cityCode: string): AddressOption[] {
  const barangaysForCity = barangays[cityCode]
  if (barangaysForCity && barangaysForCity.length > 0) {
    return barangaysForCity
  }
  // If no barangays are defined for this city, provide generic fallbacks
  return DEFAULT_BARANGAY_OPTIONS
}

export function getPostalCode(barangayCode: string): string {
  return postalCodes[barangayCode] || ''
}

export function findByCode<T extends AddressOption>(items: T[], code: string): T | undefined {
  return items.find(item => item.code === code)
}

export function findByValue<T extends AddressOption>(items: T[], value: string): T | undefined {
  return items.find(item => item.value === value)
}