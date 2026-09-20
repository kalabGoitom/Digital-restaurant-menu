const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const generateUniqueSlug = async (name, prisma) => {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (!existingRestaurant) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export { generateSlug, generateUniqueSlug };
