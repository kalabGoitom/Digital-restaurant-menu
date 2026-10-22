import { prisma } from "../config/db.js";

const createMenu = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const menuExists = await prisma.menu.findFirst({
      where: {
        name,
        restaurantId: req.restaurantId,
      },
    });

    if (menuExists) {
      return res.status(400).json({
        message: "A menu item with this name already exists.",
      });
    }

    const menuItem = await prisma.menu.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        available: true,
        category,
        restaurantId: req.restaurantId,
      },
    });

    res.status(201).json({
      message: "Menu created.",
      menuItem,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getAllMenu = async (req, res) => {
  try {
    const menuItems = await prisma.menu.findMany({
      where: {
        restaurantId: req.restaurantId,
      },
    });

    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      imageUrl,
      category,
      available,
      featured,
    } = req.body;

    const updatedItem = await prisma.menu.updateMany({
      where: {
        id,
        restaurantId: req.restaurantId,
      },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        imageUrl,
        category,
        available,
        featured,
      },
    });

    if (updatedItem.count === 0) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      message: "Menu item updated.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await prisma.menu.deleteMany({
      where: {
        id,
        restaurantId: req.restaurantId,
      },
    });

    if (deletedItem.count === 0) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    res.status(200).json({
      message: "Menu item deleted.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export { createMenu, getAllMenu, editMenu, deleteMenu };
