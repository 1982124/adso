// ═════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Certification Engine
// Certificate data generation, verification hash, and QR code data.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════

import type { CertificateData } from './types';

/**
 * Generate a unique certificate ID in the format ADSO-XXXX-XXXX.
 * Uses a combination of random hex segments.
 * @returns A unique certificate ID string
 */
export function generateCertificateId(): string {
  const segment = (): string =>
    Math.random().toString(16).substring(2, 6).toUpperCase();
  return `ADSO-${segment()}-${segment()}`;
}

/**
 * Generate a verification hash for a certificate.
 * Produces a deterministic SHA-like hash using a simple string hashing algorithm.
 * Not cryptographically secure — for display/verification purposes only.
 * @param certData - Certificate data to hash
 * @returns Hex string hash
 */
export function generateVerificationHash(certData: CertificateData): string {
  const payload = [
    certData.certificateId,
    certData.type,
    certData.countryCode,
    certData.licenseCode ?? '',
    String(certData.score ?? 0),
    certData.issuedAt.toISOString(),
  ].join('|');

  // Simple hash function (djb2 variant)
  let hash1 = 5381;
  let hash2 = 52711;

  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }

  const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');

  return `${hex1}${hex2}`;
}

/**
 * Generate QR code data string for a certificate.
 * The data can be encoded into a QR code for verification.
 * @param certId - The certificate ID
 * @returns URL-like string for QR code encoding
 */
export function generateQRData(certId: string): string {
  return `https://adso.verify/${certId}`;
}

/**
 * Format a certificate for display.
 * Returns a structured object with formatted fields.
 * @param cert - Certificate data
 * @returns Formatted certificate display data
 */
export function formatCertificate(cert: CertificateData): {
  title: string;
  subtitle: string;
  issuedDate: string;
  expiryDate: string | null;
  scoreDisplay: string;
  verificationId: string;
  qrData: string;
} {
  const typeLabel = getCertificateTypeLabel(cert.type);
  const subtitle = cert.licenseCode
    ? `${cert.countryCode} — Permis ${cert.licenseCode}`
    : `ADSO — ${cert.countryCode}`;

  return {
    title: `${typeLabel}: ${cert.title}`,
    subtitle,
    issuedDate: formatDate(cert.issuedAt),
    expiryDate: cert.expiresAt ? formatDate(cert.expiresAt) : null,
    scoreDisplay: cert.score !== null ? `${cert.score}%` : 'N/A',
    verificationId: cert.certificateId,
    qrData: cert.qrData,
  };
}

/**
 * Validate certificate data integrity.
 * Checks that required fields are present and the verification hash matches.
 * @param cert - Certificate data to validate
 * @returns True if the certificate data is valid
 */
export function isValidCertificate(cert: CertificateData): boolean {
  // Check required fields
  if (!cert.id || !cert.certificateId || !cert.type || !cert.title) {
    return false;
  }

  if (!cert.countryCode) {
    return false;
  }

  // Check certificate ID format (ADSO-XXXX-XXXX)
  const idPattern = /^ADSO-[A-F0-9]{4}-[A-F0-9]{4}$/;
  if (!idPattern.test(cert.certificateId)) {
    return false;
  }

  // Verify hash matches
  const expectedHash = generateVerificationHash(cert);
  if (cert.verificationHash !== expectedHash) {
    return false;
  }

  // Check issued date is not in the future
  if (cert.issuedAt > new Date()) {
    return false;
  }

  return true;
}

/**
 * Get a human-readable label for a certificate type.
 * @param type - Certificate type string
 * @returns Human-readable type label in French
 */
export function getCertificateTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    course_completion: 'Completion de Cours',
    exam_passed: 'Examen Réussi',
    full_license: 'Permis Complet',
    safety_award: 'Prix de Sécurité',
  };
  return labels[type] ?? type;
}

/**
 * Calculate the expiry date for a certificate based on its type.
 * @param type - Certificate type
 * @returns Expiry date, or null if the certificate does not expire
 */
export function calculateExpiryDate(type: string): Date | null {
  const now = new Date();

  switch (type) {
    case 'course_completion':
      // Course completion certificates don't expire
      return null;
    case 'exam_passed':
      // Exam pass is valid for 2 years
      const examExpiry = new Date(now);
      examExpiry.setFullYear(examExpiry.getFullYear() + 2);
      return examExpiry;
    case 'full_license':
      // Full license doesn't expire (governed by authority)
      return null;
    case 'safety_award':
      // Safety awards valid for 1 year
      const safetyExpiry = new Date(now);
      safetyExpiry.setFullYear(safetyExpiry.getFullYear() + 1);
      return safetyExpiry;
    default:
      return null;
  }
}

/**
 * Format a Date object into a human-readable French date string.
 * @param date - Date to format
 * @returns Formatted date string (e.g., "15 janvier 2025")
 */
export function formatDate(date: Date): string {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];

  const d = new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}
