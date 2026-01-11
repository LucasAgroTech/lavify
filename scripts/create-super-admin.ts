import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || "admin@lavify.com.br";
  const senha = process.env.SUPER_ADMIN_SENHA || "SuperAdmin@123";
  const nome = process.env.SUPER_ADMIN_NOME || "Super Admin";

  // Verifica se já existe
  const existe = await prisma.superAdmin.findUnique({
    where: { email },
  });

  if (existe) {
    console.log("Super Admin já existe:", email);
    return;
  }

  // Cria o super admin
  const senhaHash = await bcrypt.hash(senha, 12);

  const superAdmin = await prisma.superAdmin.create({
    data: {
      email,
      senha: senhaHash,
      nome,
    },
  });

  console.log("✅ Super Admin criado com sucesso!");
  console.log("   Email:", superAdmin.email);
  console.log("   Nome:", superAdmin.nome);
  console.log("\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!");
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

