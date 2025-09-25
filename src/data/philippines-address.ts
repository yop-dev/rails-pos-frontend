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
  REGION7: [
    { value: 'BOH', label: 'Bohol', code: 'BOH' },
    { value: 'CEB', label: 'Cebu', code: 'CEB' },
    { value: 'NEG', label: 'Negros Oriental', code: 'NEG' },
    { value: 'SIQ', label: 'Siquijor', code: 'SIQ' }
  ]
}

// Cities by province (simplified list with major cities)
export const cities: Record<string, AddressOption[]> = {
  MNL: [
    { value: 'MNL_CITY', label: 'Manila City', code: 'MNL_CITY' }
  ],
  QC: [
    { value: 'QC_CITY', label: 'Quezon City', code: 'QC_CITY' }
  ],
  MKT: [
    { value: 'MKT_CITY', label: 'Makati City', code: 'MKT_CITY' }
  ],
  TAY: [
    { value: 'TAY_CITY', label: 'Taguig City', code: 'TAY_CITY' }
  ],
  PAS: [
    { value: 'PAS_CITY', label: 'Pasay City', code: 'PAS_CITY' }
  ],
  PSG: [
    { value: 'PSG_CITY', label: 'Pasig City', code: 'PSG_CITY' }
  ],
  MAR: [
    { value: 'MAR_CITY', label: 'Marikina City', code: 'MAR_CITY' }
  ],
  CAV: [
    { value: 'CAV_DASMA', label: 'Dasmariñas', code: 'CAV_DASMA' },
    { value: 'CAV_IMUS', label: 'Imus', code: 'CAV_IMUS' },
    { value: 'CAV_BAC', label: 'Bacoor', code: 'CAV_BAC' },
    { value: 'CAV_CW', label: 'Cavite City', code: 'CAV_CW' }
  ],
  LAG: [
    { value: 'LAG_SC', label: 'Santa Cruz', code: 'LAG_SC' },
    { value: 'LAG_CB', label: 'Calamba', code: 'LAG_CB' },
    { value: 'LAG_SLB', label: 'San Pablo', code: 'LAG_SLB' },
    { value: 'LAG_BIN', label: 'Biñan', code: 'LAG_BIN' }
  ],
  CEB: [
    { value: 'CEB_CITY', label: 'Cebu City', code: 'CEB_CITY' },
    { value: 'CEB_LAP', label: 'Lapu-Lapu', code: 'CEB_LAP' },
    { value: 'CEB_MAN', label: 'Mandaue', code: 'CEB_MAN' },
    { value: 'CEB_TOL', label: 'Toledo', code: 'CEB_TOL' }
  ]
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
    { value: 'MNL_SAMPALOC', label: 'Sampaloc', code: 'MNL_SAMPALOC' }
  ],
  QC_CITY: [
    { value: 'QC_DILIMAN', label: 'Diliman', code: 'QC_DILIMAN' },
    { value: 'QC_QUEZONHILL', label: 'Quezon Hill', code: 'QC_QUEZONHILL' },
    { value: 'QC_CUBAO', label: 'Cubao', code: 'QC_CUBAO' },
    { value: 'QC_FAIRVIEW', label: 'Fairview', code: 'QC_FAIRVIEW' },
    { value: 'QC_NOVALICHES', label: 'Novaliches', code: 'QC_NOVALICHES' },
    { value: 'QC_PROJECT2', label: 'Project 2', code: 'QC_PROJECT2' },
    { value: 'QC_PROJECT3', label: 'Project 3', code: 'QC_PROJECT3' }
  ],
  MKT_CITY: [
    { value: 'MKT_POBLACION', label: 'Poblacion', code: 'MKT_POBLACION' },
    { value: 'MKT_BELMONTE', label: 'Bel-Air', code: 'MKT_BELMONTE' },
    { value: 'MKT_DASMA', label: 'Dasmariñas Village', code: 'MKT_DASMA' },
    { value: 'MKT_FORBES', label: 'Forbes Park', code: 'MKT_FORBES' },
    { value: 'MKT_LEGASPI', label: 'Legaspi Village', code: 'MKT_LEGASPI' },
    { value: 'MKT_SALCEDO', label: 'Salcedo Village', code: 'MKT_SALCEDO' }
  ],
  CEB_CITY: [
    { value: 'CEB_LAHUG', label: 'Lahug', code: 'CEB_LAHUG' },
    { value: 'CEB_IT_PARK', label: 'Apas (IT Park)', code: 'CEB_IT_PARK' },
    { value: 'CEB_CAPITOL', label: 'Capitol Site', code: 'CEB_CAPITOL' },
    { value: 'CEB_COLON', label: 'Colon', code: 'CEB_COLON' },
    { value: 'CEB_FUENTE', label: 'Fuente', code: 'CEB_FUENTE' }
  ]
}

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
  return cities[provinceCode] || []
}

export function getBarangays(cityCode: string): AddressOption[] {
  return barangays[cityCode] || []
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