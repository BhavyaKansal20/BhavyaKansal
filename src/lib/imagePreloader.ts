export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const preloadImages = async (imagePaths: string[]): Promise<void> => {
  try {
    await Promise.all(imagePaths.map(preloadImage));
    console.log(`Successfully preloaded ${imagePaths.length} images`);
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// Extract thumbnail images from projects data
export const getProjectThumbnails = (): string[] => {
  return [
    "/Bhavya-Kansal-PFP.jpg"
  ];
};