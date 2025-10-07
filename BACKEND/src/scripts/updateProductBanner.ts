import prismaClient from "../../prisma";

async function updateBanner() {
  const oldBanner = "de8c3c52a5be1460f04b839d3c5f5e6e-kATANA.jpg";
  const newBanner = "f01fd795d71bb0cbe54702bf89da2293-kATANA.jpg";

  const product = await prismaClient.product.findFirst({
    where: { banner: oldBanner },
  });

  if (!product) {
    console.log("Produto com banner antigo não encontrado.");
    return;
  }

  await prismaClient.product.update({
    where: { id: product.id },
    data: { banner: newBanner },
  });

  console.log(`Banner atualizado para o produto ${product.name}`);
}

updateBanner()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
