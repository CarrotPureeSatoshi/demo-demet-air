// Value Object - Email with validation

const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'mailinator.com',
  'maildrop.cc',
  'trashmail.com',
  'yopmail.com',
];

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    const trimmed = email.trim().toLowerCase();

    // RFC 5322 basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error('Format email invalide');
    }

    // Check disposable domains
    const domain = trimmed.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      throw new Error('Email temporaire non accepté');
    }

    return new Email(trimmed);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
