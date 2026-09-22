import { prisma } from "../config/db.js";

const createDailyMenu = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required.",
      });
    }

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (startOfDay < today) {
      return res.status(400).json({
        message: "You cannot create a daily menu for a past date.",
      });
    }

    const existingDailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: req.restaurantId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingDailyMenu) {
      return res.status(400).json({
        message: "A daily menu already exists for this date.",
        dailyMenu: existingDailyMenu,
      });
    }

    const dailyMenu = await prisma.dailyMenu.create({
      data: {
        date: startOfDay,
        restaurantId: req.restaurantId,
      },
    });

    return res.status(201).json({
      message: "Daily menu created.",
      dailyMenu,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "A daily menu already exists for this date.",
      });
    }

    return res.status(500).json({
      message: "Failed to create daily menu.",
    });
  }
};

const addToDailyMenuItem = async (req, res) => {
  try {
    const { dailyMenuId, menuId } = req.body;

    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        id: dailyMenuId,
        restaurantId: req.restaurantId,
      },
    });

    if (!dailyMenu) {
      return res.status(404).json({
        message: "Daily menu not found.",
      });
    }

    const menuItem = await prisma.menu.findFirst({
      where: {
        id: menuId,
        restaurantId: req.restaurantId,
      },
    });

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found.",
      });
    }

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
        message: "This menu item is already in this daily menu.",
      });
    }

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
      message: "Menu item added to daily menu.",
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
      include: {
        dailyMenu: true,
      },
    });

    if (!dailyMenuItem) {
      return res.status(404).json({
        message: "Daily menu item not found.",
      });
    }

    if (dailyMenuItem.dailyMenu.restaurantId !== req.restaurantId) {
      return res.status(403).json({
        message: "You do not have permission to remove this menu item.",
      });
    }

    await prisma.dailyMenuItem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Menu item removed from daily menu.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getDailyMenu = async (req, res) => {
  try {
    const { date } = req.query;

    const selectedDate = new Date(date);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: req.restaurantId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!dailyMenu) {
      return res.status(404).json({
        message: "Daily menu not found for this date.",
      });
    }

    return res.status(200).json({
      dailyMenu,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createDailyMenu,
  addToDailyMenuItem,
  removeFromDailyMenu,
  getDailyMenu,
};
