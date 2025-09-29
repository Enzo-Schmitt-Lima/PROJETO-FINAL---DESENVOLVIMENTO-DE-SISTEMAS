import prismaClient from "../../../prisma";

interface IUpdateProduct {
  id: string;
  name?: string;
  description?: string;
  price?: string;
  banner?: string;
  category_id?: string;
}

export class UpdateProductService {
  async execute({ id, name, description, price, banner, category_id }: IUpdateProduct) {
    const data: any = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = price;
    if (banner) data.banner = banner;
    if (category_id) data.category_id = category_id;

    const updated = await prismaClient.product.update({
      where: { id },
      data,
    });

    return updated;
  }
}
