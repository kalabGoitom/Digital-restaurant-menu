import {prisma} from  "../config/db.js"

const createMenu = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const menuExists = await prisma.menu.findFirst({ where: { name: name } });
    if (menuExists)
      return res
        .status(400)
        .json({ message: " A menu item with this name already exists." });
    const menuItem = await prisma.menu.create({
      data: { name, description, price, imageUrl, available: true, category },
    });
    res.status(201).json({ message: "Menu created.", menuItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllMenu = async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany();
    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, available } =
      req.body;
    const updatedItem = await prisma.menu.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        imageUrl,
        category,
        available,
      },
    });
    res.status(200).json({ message: "Menu item updated.", updatedItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItemExists = await prisma.menu.findUnique({ where: { id: id } });
    if (!menuItemExists) {
      return res.status(404).json({ message: "Menu item not found." });
    }
    const menuItem = await prisma.menu.delete({ where: { id: id } });
    res.status(200).json({ message: "Menu item deleted." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createMenu, getAllMenu, editMenu, deleteMenu };
