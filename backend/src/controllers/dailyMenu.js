import { prisma } from "../config/db.js";

const createDailyMenu = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingDailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        date: {
          gte: startOfToday, //greater than the startOfToday
          lte: endOfToday, //less than the endOfToday
        },
      },
    });

    if (existingDailyMenu) {
      return res.status(400).json({
        message: "Today's daily menu already exists.",
        dailyMenu: existingDailyMenu,
      });
    }

    const dailyMenu = await prisma.dailyMenu.create({
      data: {
        date: startOfToday,
      },
    });

    return res.status(201).json({
      message: "Today's daily menu created.",
      dailyMenu,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addToDailyMenuItem = async (req, res) => {
  try {
    const { menuId } = req.body;

    // Get the beginning and end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find today's DailyMenu
    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    if (!dailyMenu) {
      return res.status(404).json({
        message: "Today's daily menu has not been created yet.",
      });
    }

    // Check whether the menu item exists
    const menuItem = await prisma.menu.findUnique({
      where: {
        id: menuId,
      },
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

    // Check if the item is already in today's menu
    const alreadyAdded = await prisma.dailyMenuItem.findUnique({
      where: {
        dailyMenuId_menuId: {
          dailyMenuId: dailyMenu.id,
          menuId: menuId,
        },
      },
    });

    if (alreadyAdded) {
      return res.status(400).json({
        message: "This menu item is already in today's menu.",
      });
    }

    // Add the item to today's menu
    const dailyMenuItem = await prisma.dailyMenuItem.create({
      data: {
        dailyMenuId: dailyMenu.id,
        menuId: menuId,
      },
      include: {
        menu: true,
      },
    });

    return res.status(201).json({
      message: "Menu item added to today's menu.",
      dailyMenuItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromDailyMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const dailyMenuItem = await prisma.dailyMenuItem.findUnique({
      where: {
        id,
      },
    });

    if (!dailyMenuItem) {
      return res.status(404).json({
        message: "Daily menu item not found.",
      });
    }

    await prisma.dailyMenuItem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Menu item removed from today's menu.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { createDailyMenu, addToDailyMenuItem, removeFromDailyMenu };
