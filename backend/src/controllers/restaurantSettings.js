import { prisma } from "../config/db.js";

const getRestaurantSettings = async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: req.restaurantId,
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
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      restaurant,
    });
  } catch (error) {
    console.error("Failed to fetch restaurant settings:", error);

    return res.status(500).json({
      message: "Failed to fetch restaurant settings.",
    });
  }
};

const updateRestaurantSettings = async (req, res) => {
  try {
    const {
      name,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      defaultLanguage,
    } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: req.restaurantId,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: req.restaurantId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(primaryColor !== undefined && { primaryColor }),
        ...(secondaryColor !== undefined && { secondaryColor }),
        ...(accentColor !== undefined && { accentColor }),
        ...(defaultLanguage !== undefined && { defaultLanguage }),
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
      },
    });

    return res.status(200).json({
      message: "Restaurant settings updated successfully.",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Failed to update restaurant settings:", error);

    return res.status(500).json({
      message: "Failed to update restaurant settings.",
    });
  }
};

export { getRestaurantSettings, updateRestaurantSettings };
