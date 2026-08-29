import { prisma } from "../config/db.js";

const getTodaysMenu = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        date: {
          gte: startOfToday,
          lte: endOfToday,
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
        message: "Today's menu has not been created yet.",
      });
    }

    return res.status(200).json({
      date: dailyMenu.date,
      menuItems: dailyMenu.items.map((item) => item.menu),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default getTodaysMenu;
