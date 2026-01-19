/**
 * Validação e sanitização de entrada
 * Proteção contra XSS, SQL Injection, etc.
 */

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < e >
    .replace(/javascript:/gi, "") // Remove javascript:
    .replace(/on\w+=/gi, "") // Remove event handlers
    .slice(0, 1000); // Limita tamanho
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valida senha forte
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (typeof password !== "string") {
    return { valid: false, errors: ["Senha inválida"] };
  }
  
  if (password.length < 8) {
    errors.push("Senha deve ter no mínimo 8 caracteres");
  }
  
  if (password.length > 128) {
    errors.push("Senha muito longa");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter letra minúscula");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter letra maiúscula");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter número");
  }
  
  // Verifica senhas comuns
  const commonPasswords = [
    "12345678", "password", "123456789", "qwerty123",
    "senha123", "admin123", "mudar123", "teste123"
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Senha muito comum, escolha outra");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valida telefone brasileiro
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== "string") return false;
  
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, "");
  
  // Deve ter 10 ou 11 dígitos (com DDD)
  return numbers.length >= 10 && numbers.length <= 11;
}

/**
 * Formata telefone
 */
export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, "");
  
  if (numbers.length === 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }
  
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  return phone;
}

/**
 * Valida CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  if (typeof cnpj !== "string") return false;
  
  const numbers = cnpj.replace(/\D/g, "");
  
  if (numbers.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Validação do dígito verificador
  let sum = 0;
  let weight = 5;
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numbers[12])) return false;
  
  sum = 0;
  weight = 6;
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(numbers[13])) return false;
  
  return true;
}

/**
 * Valida campos obrigatórios
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const field of fields) {
    const value = data[field];
    
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      missing.push(field);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Valida dados de registro
 */
export function validateRegistration(data: {
  nomeLavaJato?: string;
  cnpj?: string;
  telefoneLavaJato?: string;
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  // Campos obrigatórios
  if (!data.nomeLavaJato?.trim()) {
    errors.nomeLavaJato = "Nome do estabelecimento é obrigatório";
  } else if (data.nomeLavaJato.length < 3) {
    errors.nomeLavaJato = "Nome deve ter no mínimo 3 caracteres";
  }
  
  if (!data.nome?.trim()) {
    errors.nome = "Nome é obrigatório";
  } else if (data.nome.length < 3) {
    errors.nome = "Nome deve ter no mínimo 3 caracteres";
  }
  
  if (!data.email?.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Email inválido";
  }
  
  if (!data.senha) {
    errors.senha = "Senha é obrigatória";
  } else {
    const passwordValidation = isStrongPassword(data.senha);
    if (!passwordValidation.valid) {
      errors.senha = passwordValidation.errors[0];
    }
  }
  
  // Campos opcionais mas com validação
  if (data.cnpj && !isValidCNPJ(data.cnpj)) {
    errors.cnpj = "CNPJ inválido";
  }
  
  if (data.telefone && !isValidPhone(data.telefone)) {
    errors.telefone = "Telefone inválido";
  }
  
  if (data.telefoneLavaJato && !isValidPhone(data.telefoneLavaJato)) {
    errors.telefoneLavaJato = "Telefone do estabelecimento inválido";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida dados de login
 */
export function validateLogin(data: {
  email?: string;
  senha?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!data.email?.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Email inválido";
  }
  
  if (!data.senha) {
    errors.senha = "Senha é obrigatória";
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
