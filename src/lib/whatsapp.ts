// Integração WhatsApp - usando Evolution API ou Twilio
// Configure WHATSAPP_API_URL e WHATSAPP_API_KEY no .env

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "";
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || "";
const WHATSAPP_INSTANCE = process.env.WHATSAPP_INSTANCE || "lavajato";

interface MensagemWhatsApp {
  telefone: string;
  mensagem: string;
}

export async function enviarMensagemWhatsApp({
  telefone,
  mensagem,
}: MensagemWhatsApp): Promise<boolean> {
  if (!WHATSAPP_API_URL || !WHATSAPP_API_KEY) {
    console.log(
      "[WhatsApp] API não configurada. Mensagem que seria enviada:",
      { telefone, mensagem }
    );
    return false;
  }

  try {
    // Formato Evolution API
    const response = await fetch(
      `${WHATSAPP_API_URL}/message/sendText/${WHATSAPP_INSTANCE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: WHATSAPP_API_KEY,
        },
        body: JSON.stringify({
          number: telefone.replace(/\D/g, ""), // Remove caracteres não numéricos
          text: mensagem,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
    }

    console.log("[WhatsApp] Mensagem enviada com sucesso para:", telefone);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Erro ao enviar mensagem:", error);
    return false;
  }
}

// Templates de mensagem
export const templates = {
  osRecebida: (nome: string, carro: string, previsao: string) =>
    `🚗 Olá ${nome}! Recebemos seu ${carro}. Previsão de entrega: ${previsao}. Aguarde nosso contato!`,

  osPronta: (nome: string, carro: string) =>
    `✅ ${nome}, seu ${carro} está PRONTO! Pode vir buscar quando quiser. Obrigado pela preferência! 🙏`,

  osEntregue: (nome: string, pontos: number) =>
    `🎉 Obrigado pela visita, ${nome}! Você acumulou ${pontos} pontos de fidelidade. Volte sempre!`,

  alertaEstoque: (produto: string, quantidade: number) =>
    `⚠️ ALERTA: Estoque baixo de ${produto}. Quantidade atual: ${quantidade}. Hora de repor!`,
};

