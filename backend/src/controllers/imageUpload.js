import uploadImage from "../utilities/cloudinaryService.js";

const uploadRestaurantImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    const { type } = req.body;

    if (type !== "logo" && type !== "dish") {
      return res.status(400).json({
        message: 'Image type must be either "logo" or "dish".',
      });
    }

    const folder = `nova/restaurants/${req.restaurantId}/${type === "logo" ? "logos" : "dishes"}`;

    const result = await uploadImage(req.file.buffer, folder);

    return res.status(200).json({
      message: "Image uploaded successfully.",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error("Image upload failed:", error);

    return res.status(500).json({
      message: "Failed to upload image.",
    });
  }
};

export default uploadRestaurantImage;
