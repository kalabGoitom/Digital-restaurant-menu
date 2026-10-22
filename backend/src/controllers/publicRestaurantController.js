import { prisma } from "../config/db.js";
import { getCurrentDateForTimezone } from "../utilities/dateUtils.js";

const getPublicRestaurant = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        defaultLanguage: true,
        isActive: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (!restaurant.isActive) {
      return res.status(403).json({
        message: "This restaurant is currently unavailable.",
      });
    }

    return res.status(200).json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        logoUrl: restaurant.logoUrl,
        primaryColor: restaurant.primaryColor,
        secondaryColor: restaurant.secondaryColor,
        accentColor: restaurant.accentColor,
        defaultLanguage: restaurant.defaultLanguage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPublicDailyMenu = async (req, res) => {
  try {
    const { slug } = req.params;

    const selectedDateString = getCurrentDateForTimezone("Africa/Addis_Ababa");

    const selectedDate = new Date(`${selectedDateString}T00:00:00.000Z`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }

    console.log(selectedDate);

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (!restaurant.isActive) {
      return res.status(403).json({
        message: "This restaurant is currently unavailable.",
      });
    }

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dailyMenu = await prisma.dailyMenu.findFirst({
      where: {
        restaurantId: restaurant.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        date: true,
        items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                category: true,
                available: true,
                featured: true,
              },
            },
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
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
      },
      dailyMenu,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { getPublicRestaurant, getPublicDailyMenu };
