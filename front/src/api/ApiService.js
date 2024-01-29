export const fetchHallData = async () => {
  try {
    const response = await fetch('http://localhost:3001/load-image');
    const svgData = await response.text();
    return { svgData };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
