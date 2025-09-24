// Currency utilities for Philippine Peso (PHP)

/**
 * Convert peso amount to cents (for backend storage)
 * @param pesos - Amount in pesos (e.g., 150.50)
 * @returns Amount in cents (e.g., 15050)
 */
export function pesosTocents(pesos: number): number {
  return Math.round(pesos * 100)
}

/**
 * Convert cents to peso amount (for display)
 * @param cents - Amount in cents (e.g., 15050)
 * @returns Amount in pesos (e.g., 150.50)
 */
export function centsToPesos(cents: number): number {
  return cents / 100
}

/**
 * Format peso amount for display
 * @param pesos - Amount in pesos
 * @returns Formatted string (e.g., "₱150.50")
 */
export function formatPesos(pesos: number): string {
  return `₱${pesos.toFixed(2)}`
}

/**
 * Format cents amount for display
 * @param cents - Amount in cents
 * @returns Formatted string (e.g., "₱150.50")
 */
export function formatCents(cents: number): string {
  return formatPesos(centsToPesos(cents))
}

/**
 * Parse peso string input to number
 * @param input - String input (e.g., "150.50", "₱150.50", "150")
 * @returns Peso amount as number, or null if invalid
 */
export function parsePesoInput(input: string): number | null {
  if (!input || typeof input !== 'string') {
    return null
  }
  
  // Remove currency symbol and whitespace
  const cleanInput = input.replace(/[₱\s,]/g, '')
  
  // Parse as float
  const parsed = parseFloat(cleanInput)
  
  // Validate the result
  if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
    return null
  }
  
  return parsed
}

/**
 * Validate peso amount
 * @param amount - Amount to validate
 * @param min - Minimum amount (default: 0.01)
 * @param max - Maximum amount (default: 1,000,000)
 * @returns Validation result
 */
export function validatePesoAmount(
  amount: number, 
  min: number = 0.01, 
  max: number = 1000000
): { valid: boolean; error?: string } {
  if (!Number.isFinite(amount)) {
    return { valid: false, error: 'Please enter a valid amount' }
  }
  
  if (amount < min) {
    return { valid: false, error: `Amount must be at least ${formatPesos(min)}` }
  }
  
  if (amount > max) {
    return { valid: false, error: `Amount cannot exceed ${formatPesos(max)}` }
  }
  
  return { valid: true }
}

/**
 * Round peso amount to 2 decimal places
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export function roundPesos(amount: number): number {
  return Math.round(amount * 100) / 100
}

/**
 * Check if two peso amounts are equal (accounting for floating point precision)
 * @param amount1 - First amount
 * @param amount2 - Second amount
 * @returns Whether amounts are equal
 */
export function pesoAmountsEqual(amount1: number, amount2: number): boolean {
  return Math.abs(amount1 - amount2) < 0.01
}