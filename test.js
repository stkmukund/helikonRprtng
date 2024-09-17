const requestOptionsFront = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers if needed
  },
};

const fetchCampaignData = async (startDate, endDate) => {
  const response = await fetch(
    `https://helikon-rprtng.vercel.app/campaigns/bank-sites/?startDate=${startDate}&endDate=${endDate}`,
    requestOptionsFront
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response;
};

const formatDateString = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // Format as MM/DD/YYYY
};

const processMonthlyReports = async (year, month) => {
  // Adjust month to 0-based index (0 for January, 1 for February, etc.)
  const startMonth = month - 1;
  
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 1, 1); // End date is the first day of the next month
  
  while (startDate < endDate) {
    const formattedStartDate = formatDateString(startDate);
    const formattedEndDate = formatDateString(new Date(startDate.getTime() + 24 * 60 * 60 * 1000)); // One day after

    try {
      console.log(`Fetching data for ${formattedStartDate} to ${formattedEndDate}`);
      await fetchCampaignData(formattedStartDate, formattedEndDate);
      console.log(`Successfully fetched data for ${formattedStartDate} to ${formattedEndDate}`);
    } catch (error) {
      console.error(`Error fetching data for ${formattedStartDate} to ${formattedEndDate}: ${error}`);
    }

    // Move to the next day
    startDate.setDate(startDate.getDate() + 1);
  }
};

// Example usage:
processMonthlyReports(2024, 1); // January 2024
