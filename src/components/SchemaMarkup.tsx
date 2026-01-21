/**
 * Componente para adicionar Schema Markup (JSON-LD) em páginas
 * Pode ser usado em componentes Server e Client
 */

"use client";

interface SchemaMarkupProps {
  schema: object | object[];
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
}

// Export default para uso mais simples
export default SchemaMarkup;

