/**
 * Script para gerar conteúdo SEO para todas as cidades usando ChatGPT
 * 
 * Uso: npx ts-node scripts/generate-seo-content.ts
 * Ou: npm run generate-seo
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

// Copiar a lista de cidades do arquivo principal
interface CidadeSEO {
  slug: string;
  nome: string;
  estado: string;
  uf: string;
  regiao: string;
  populacao: number;
  keywords: string[];
}

interface ConteudoSEO {
  titulo: string;
  subtitulo: string;
  descricaoMeta: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
  }[];
  beneficios: string[];
  faq: {
    pergunta: string;
    resposta: string;
  }[];
  ctaTexto: string;
}

// Lista de cidades (mesmo do seo-cities.ts)
const cidadesBrasil: CidadeSEO[] = [
  { slug: "sao-paulo", nome: "São Paulo", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 12400000, keywords: ["lava jato sp", "lava rápido zona sul", "lava rápido zona norte"] },
  { slug: "rio-de-janeiro", nome: "Rio de Janeiro", estado: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste", populacao: 6700000, keywords: ["lava jato rj", "lava rápido zona oeste", "lava jato copacabana"] },
  { slug: "brasilia", nome: "Brasília", estado: "Distrito Federal", uf: "DF", regiao: "Centro-Oeste", populacao: 3100000, keywords: ["lava jato df", "lava rápido asa norte", "lava jato taguatinga"] },
  { slug: "salvador", nome: "Salvador", estado: "Bahia", uf: "BA", regiao: "Nordeste", populacao: 2900000, keywords: ["lava jato ba", "lava rápido salvador"] },
  { slug: "fortaleza", nome: "Fortaleza", estado: "Ceará", uf: "CE", regiao: "Nordeste", populacao: 2700000, keywords: ["lava jato ce", "lava rápido fortaleza"] },
  { slug: "belo-horizonte", nome: "Belo Horizonte", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 2500000, keywords: ["lava jato bh", "lava rápido mg"] },
  { slug: "manaus", nome: "Manaus", estado: "Amazonas", uf: "AM", regiao: "Norte", populacao: 2200000, keywords: ["lava jato manaus", "lava rápido am"] },
  { slug: "curitiba", nome: "Curitiba", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 1900000, keywords: ["lava jato curitiba", "lava rápido pr"] },
  { slug: "recife", nome: "Recife", estado: "Pernambuco", uf: "PE", regiao: "Nordeste", populacao: 1600000, keywords: ["lava jato recife", "lava rápido pe"] },
  { slug: "goiania", nome: "Goiânia", estado: "Goiás", uf: "GO", regiao: "Centro-Oeste", populacao: 1500000, keywords: ["lava jato goiania", "lava rápido go"] },
  { slug: "belem", nome: "Belém", estado: "Pará", uf: "PA", regiao: "Norte", populacao: 1500000, keywords: ["lava jato belem", "lava rápido pa"] },
  { slug: "porto-alegre", nome: "Porto Alegre", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 1500000, keywords: ["lava jato poa", "lava rápido rs"] },
  { slug: "guarulhos", nome: "Guarulhos", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 1400000, keywords: ["lava jato guarulhos"] },
  { slug: "campinas", nome: "Campinas", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 1200000, keywords: ["lava jato campinas"] },
  { slug: "sao-luis", nome: "São Luís", estado: "Maranhão", uf: "MA", regiao: "Nordeste", populacao: 1100000, keywords: ["lava jato sao luis", "lava rápido ma"] },
  { slug: "sao-goncalo", nome: "São Gonçalo", estado: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste", populacao: 1100000, keywords: ["lava jato sao goncalo"] },
  { slug: "maceio", nome: "Maceió", estado: "Alagoas", uf: "AL", regiao: "Nordeste", populacao: 1000000, keywords: ["lava jato maceio", "lava rápido al"] },
  { slug: "duque-de-caxias", nome: "Duque de Caxias", estado: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste", populacao: 920000, keywords: ["lava jato caxias"] },
  { slug: "natal", nome: "Natal", estado: "Rio Grande do Norte", uf: "RN", regiao: "Nordeste", populacao: 890000, keywords: ["lava jato natal", "lava rápido rn"] },
  { slug: "teresina", nome: "Teresina", estado: "Piauí", uf: "PI", regiao: "Nordeste", populacao: 870000, keywords: ["lava jato teresina", "lava rápido pi"] },
  { slug: "campo-grande", nome: "Campo Grande", estado: "Mato Grosso do Sul", uf: "MS", regiao: "Centro-Oeste", populacao: 900000, keywords: ["lava jato campo grande", "lava rápido ms"] },
  { slug: "osasco", nome: "Osasco", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 700000, keywords: ["lava jato osasco"] },
  { slug: "santo-andre", nome: "Santo André", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 720000, keywords: ["lava jato santo andre", "lava rápido abc"] },
  { slug: "joao-pessoa", nome: "João Pessoa", estado: "Paraíba", uf: "PB", regiao: "Nordeste", populacao: 820000, keywords: ["lava jato joao pessoa", "lava rápido pb"] },
  { slug: "jaboatao-dos-guararapes", nome: "Jaboatão dos Guararapes", estado: "Pernambuco", uf: "PE", regiao: "Nordeste", populacao: 700000, keywords: ["lava jato jaboatao"] },
  { slug: "sao-bernardo-do-campo", nome: "São Bernardo do Campo", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 840000, keywords: ["lava jato sbc", "lava rápido abc"] },
  { slug: "ribeirao-preto", nome: "Ribeirão Preto", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 710000, keywords: ["lava jato ribeirao preto"] },
  { slug: "cuiaba", nome: "Cuiabá", estado: "Mato Grosso", uf: "MT", regiao: "Centro-Oeste", populacao: 620000, keywords: ["lava jato cuiaba", "lava rápido mt"] },
  { slug: "feira-de-santana", nome: "Feira de Santana", estado: "Bahia", uf: "BA", regiao: "Nordeste", populacao: 620000, keywords: ["lava jato feira de santana"] },
  { slug: "aracaju", nome: "Aracaju", estado: "Sergipe", uf: "SE", regiao: "Nordeste", populacao: 670000, keywords: ["lava jato aracaju", "lava rápido se"] },
  { slug: "londrina", nome: "Londrina", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 580000, keywords: ["lava jato londrina"] },
  { slug: "juiz-de-fora", nome: "Juiz de Fora", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 570000, keywords: ["lava jato juiz de fora"] },
  { slug: "joinville", nome: "Joinville", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 600000, keywords: ["lava jato joinville"] },
  { slug: "niteroi", nome: "Niterói", estado: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste", populacao: 520000, keywords: ["lava jato niteroi"] },
  { slug: "sao-jose-dos-campos", nome: "São José dos Campos", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 730000, keywords: ["lava jato sjc", "lava jato são josé dos campos"] },
  { slug: "uberlandia", nome: "Uberlândia", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 700000, keywords: ["lava jato uberlandia"] },
  { slug: "sorocaba", nome: "Sorocaba", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 690000, keywords: ["lava jato sorocaba"] },
  { slug: "contagem", nome: "Contagem", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 670000, keywords: ["lava jato contagem"] },
  { slug: "aparecida-de-goiania", nome: "Aparecida de Goiânia", estado: "Goiás", uf: "GO", regiao: "Centro-Oeste", populacao: 590000, keywords: ["lava jato aparecida de goiania"] },
  { slug: "florianopolis", nome: "Florianópolis", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 510000, keywords: ["lava jato floripa", "lava rápido sc"] },
  { slug: "porto-velho", nome: "Porto Velho", estado: "Rondônia", uf: "RO", regiao: "Norte", populacao: 540000, keywords: ["lava jato porto velho", "lava rápido ro"] },
  { slug: "serra", nome: "Serra", estado: "Espírito Santo", uf: "ES", regiao: "Sudeste", populacao: 520000, keywords: ["lava jato serra es"] },
  { slug: "vitoria", nome: "Vitória", estado: "Espírito Santo", uf: "ES", regiao: "Sudeste", populacao: 360000, keywords: ["lava jato vitoria", "lava rápido es"] },
  { slug: "caxias-do-sul", nome: "Caxias do Sul", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 510000, keywords: ["lava jato caxias do sul"] },
  { slug: "vila-velha", nome: "Vila Velha", estado: "Espírito Santo", uf: "ES", regiao: "Sudeste", populacao: 500000, keywords: ["lava jato vila velha"] },
  { slug: "santos", nome: "Santos", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 430000, keywords: ["lava jato santos", "lava rápido baixada santista"] },
  { slug: "mogi-das-cruzes", nome: "Mogi das Cruzes", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 450000, keywords: ["lava jato mogi das cruzes"] },
  { slug: "betim", nome: "Betim", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 440000, keywords: ["lava jato betim"] },
  { slug: "diadema", nome: "Diadema", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 420000, keywords: ["lava jato diadema"] },
  { slug: "campina-grande", nome: "Campina Grande", estado: "Paraíba", uf: "PB", regiao: "Nordeste", populacao: 410000, keywords: ["lava jato campina grande"] },
  { slug: "piracicaba", nome: "Piracicaba", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 410000, keywords: ["lava jato piracicaba"] },
  { slug: "carapicuiba", nome: "Carapicuíba", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 400000, keywords: ["lava jato carapicuiba"] },
  { slug: "olinda", nome: "Olinda", estado: "Pernambuco", uf: "PE", regiao: "Nordeste", populacao: 390000, keywords: ["lava jato olinda"] },
  { slug: "jundiai", nome: "Jundiaí", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 420000, keywords: ["lava jato jundiai"] },
  { slug: "montes-claros", nome: "Montes Claros", estado: "Minas Gerais", uf: "MG", regiao: "Sudeste", populacao: 410000, keywords: ["lava jato montes claros"] },
  { slug: "petropolis", nome: "Petrópolis", estado: "Rio de Janeiro", uf: "RJ", regiao: "Sudeste", populacao: 310000, keywords: ["lava jato petropolis"] },
  { slug: "anapolis", nome: "Anápolis", estado: "Goiás", uf: "GO", regiao: "Centro-Oeste", populacao: 390000, keywords: ["lava jato anapolis"] },
  { slug: "cariacica", nome: "Cariacica", estado: "Espírito Santo", uf: "ES", regiao: "Sudeste", populacao: 380000, keywords: ["lava jato cariacica"] },
  { slug: "bauru", nome: "Bauru", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 380000, keywords: ["lava jato bauru"] },
  { slug: "maringa", nome: "Maringá", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 430000, keywords: ["lava jato maringa"] },
  { slug: "ponta-grossa", nome: "Ponta Grossa", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 350000, keywords: ["lava jato ponta grossa"] },
  { slug: "blumenau", nome: "Blumenau", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 360000, keywords: ["lava jato blumenau"] },
  { slug: "cascavel", nome: "Cascavel", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 330000, keywords: ["lava jato cascavel"] },
  { slug: "franca", nome: "Franca", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 350000, keywords: ["lava jato franca"] },
  { slug: "praia-grande", nome: "Praia Grande", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 330000, keywords: ["lava jato praia grande"] },
  { slug: "guaruja", nome: "Guarujá", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 320000, keywords: ["lava jato guaruja"] },
  { slug: "taubate", nome: "Taubaté", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 320000, keywords: ["lava jato taubate"] },
  { slug: "limeira", nome: "Limeira", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 310000, keywords: ["lava jato limeira"] },
  { slug: "sao-vicente", nome: "São Vicente", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 360000, keywords: ["lava jato sao vicente"] },
  { slug: "suzano", nome: "Suzano", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 300000, keywords: ["lava jato suzano"] },
  { slug: "foz-do-iguacu", nome: "Foz do Iguaçu", estado: "Paraná", uf: "PR", regiao: "Sul", populacao: 260000, keywords: ["lava jato foz do iguacu"] },
  { slug: "sao-jose-do-rio-preto", nome: "São José do Rio Preto", estado: "São Paulo", uf: "SP", regiao: "Sudeste", populacao: 460000, keywords: ["lava jato rio preto"] },
  { slug: "chapeco", nome: "Chapecó", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 220000, keywords: ["lava jato chapeco"] },
  { slug: "itajai", nome: "Itajaí", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 220000, keywords: ["lava jato itajai"] },
  { slug: "balneario-camboriu", nome: "Balneário Camboriú", estado: "Santa Catarina", uf: "SC", regiao: "Sul", populacao: 150000, keywords: ["lava jato balneario camboriu", "lava jato bc"] },
  { slug: "novo-hamburgo", nome: "Novo Hamburgo", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 250000, keywords: ["lava jato novo hamburgo"] },
  { slug: "canoas", nome: "Canoas", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 350000, keywords: ["lava jato canoas"] },
  { slug: "pelotas", nome: "Pelotas", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 340000, keywords: ["lava jato pelotas"] },
  { slug: "santa-maria", nome: "Santa Maria", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 280000, keywords: ["lava jato santa maria rs"] },
  { slug: "gravata", nome: "Gravataí", estado: "Rio Grande do Sul", uf: "RS", regiao: "Sul", populacao: 280000, keywords: ["lava jato gravatai"] },
  { slug: "palmas", nome: "Palmas", estado: "Tocantins", uf: "TO", regiao: "Norte", populacao: 310000, keywords: ["lava jato palmas", "lava rápido to"] },
  { slug: "rio-branco", nome: "Rio Branco", estado: "Acre", uf: "AC", regiao: "Norte", populacao: 410000, keywords: ["lava jato rio branco", "lava rápido ac"] },
  { slug: "macapa", nome: "Macapá", estado: "Amapá", uf: "AP", regiao: "Norte", populacao: 510000, keywords: ["lava jato macapa", "lava rápido ap"] },
  { slug: "boa-vista", nome: "Boa Vista", estado: "Roraima", uf: "RR", regiao: "Norte", populacao: 420000, keywords: ["lava jato boa vista", "lava rápido rr"] },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function gerarConteudo(cidade: CidadeSEO): Promise<ConteudoSEO> {
  const prompt = `Você é um especialista em SEO e copywriting para SaaS brasileiro. Gere conteúdo otimizado para SEO para uma landing page do Lavify - Sistema de Gestão para Lava Rápidos/Lava Jatos.

CIDADE: ${cidade.nome}, ${cidade.estado} (${cidade.uf})
REGIÃO: ${cidade.regiao}
POPULAÇÃO: ~${(cidade.populacao / 1000).toFixed(0)} mil habitantes

OBJETIVO: Ranquear para buscas como "sistema para lava rápido ${cidade.nome.toLowerCase()}", "software lava jato ${cidade.uf}", etc.

Retorne um JSON com a seguinte estrutura:
{
  "titulo": "H1 otimizado (máx 60 caracteres) - incluir cidade",
  "subtitulo": "Subtítulo persuasivo (máx 120 caracteres)",
  "descricaoMeta": "Meta description otimizada (máx 155 caracteres) com call-to-action",
  "introducao": "Parágrafo introdutório de 2-3 frases focado na dor do dono de lava jato na cidade",
  "secoes": [
    {
      "titulo": "Título da seção H2",
      "conteudo": "Conteúdo de 2-3 parágrafos otimizado"
    }
  ],
  "beneficios": ["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4", "Benefício 5", "Benefício 6"],
  "faq": [
    {
      "pergunta": "Pergunta frequente sobre sistema para lava jato em ${cidade.nome}",
      "resposta": "Resposta completa e útil"
    }
  ],
  "ctaTexto": "Texto do botão de CTA persuasivo"
}

REGRAS:
1. Use português brasileiro natural e persuasivo
2. Mencione a cidade naturalmente no conteúdo (sem keyword stuffing)
3. Foque nos benefícios: controle de pátio, agendamento online, WhatsApp automático, financeiro integrado
4. Inclua termos semânticos: gestão, controle, organização, automação, produtividade
5. Tom: profissional mas acessível para donos de lava jatos
6. Inclua 3 seções diferentes sobre: (1) Desafios de gestão na cidade, (2) Funcionalidades do sistema, (3) Por que escolher o Lavify
7. Inclua 4 FAQs relevantes para a região
8. O conteúdo deve ser ÚNICO e não genérico

Responda APENAS com o JSON válido, sem markdown ou explicações.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um assistente especializado em gerar conteúdo SEO em português brasileiro. Responda sempre em JSON válido."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const responseText = completion.choices[0]?.message?.content || "";
  const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  return JSON.parse(cleanJson) as ConteudoSEO;
}

async function main() {
  console.log("🚀 Iniciando geração de conteúdo SEO...\n");
  
  const conteudos: Record<string, ConteudoSEO> = {};
  const errors: string[] = [];
  
  // Carregar conteúdo existente se houver
  const outputPath = path.join(__dirname, "../src/data/seo-content.json");
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
      Object.assign(conteudos, existing);
      console.log(`📂 Carregado ${Object.keys(conteudos).length} conteúdos existentes\n`);
    } catch (e) {
      console.log("⚠️ Não foi possível carregar conteúdo existente\n");
    }
  }
  
  for (let i = 0; i < cidadesBrasil.length; i++) {
    const cidade = cidadesBrasil[i];
    
    // Pular se já existe
    if (conteudos[cidade.slug]) {
      console.log(`⏭️  [${i + 1}/${cidadesBrasil.length}] ${cidade.nome} - já existe`);
      continue;
    }
    
    try {
      console.log(`🔄 [${i + 1}/${cidadesBrasil.length}] Gerando: ${cidade.nome}, ${cidade.uf}...`);
      
      const conteudo = await gerarConteudo(cidade);
      conteudos[cidade.slug] = conteudo;
      
      console.log(`✅ [${i + 1}/${cidadesBrasil.length}] ${cidade.nome} - OK`);
      
      // Salvar a cada cidade (para não perder progresso)
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(conteudos, null, 2), "utf-8");
      
      // Delay para não exceder rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      console.error(`❌ [${i + 1}/${cidadesBrasil.length}] ${cidade.nome} - ERRO: ${error.message}`);
      errors.push(`${cidade.nome}: ${error.message}`);
      
      // Delay maior em caso de erro (pode ser rate limit)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Geração concluída!`);
  console.log(`📊 Total: ${Object.keys(conteudos).length}/${cidadesBrasil.length} cidades`);
  console.log(`📁 Arquivo: ${outputPath}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ Erros (${errors.length}):`);
    errors.forEach(e => console.log(`   - ${e}`));
  }
}

main().catch(console.error);

