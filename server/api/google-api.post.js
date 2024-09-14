import { google } from "googleapis";
// credentials
const googleJSON = {
  type: "service_account",
  project_id: "nymbus-vips",
  private_key_id: "00657fe7bb1750259710a821ebe319f7659f72c8",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDW1hs1r9GI+NN0\nwfLIo1M2QIvczkdxTdeu9i/8KQ33CoNEvw0X70oWa1I5EvepIw6xAQI5DaVxFDBX\nj8wNv8hfEgzeSyouA7Zbywne1Oh2A9oXEwdT1q4DNG/3lQY1uoJTa26Fx0jLiQnW\nar6pbLB5gF3tUl7cAALbW6r6o4rkZG0WcP2AiYNgF1YhA1544cH0gJIHoETBpIdV\n/9mBM6LJZuANKDR3ut07km16fsUTQY3o7qbmbVnlqk9Da8eEytKj4Lq5yjAWN5tu\n+Daxiq1vPAzNdzxXVK06y/8DSc7ubmFn5uyz6P5M3KTkZ+j5di27cihm36c/mUS8\nUGsFjd5/AgMBAAECggEAG+JxvlfSED+OYALlz/RK/P6xvfjUPbjx0WweMaeOgCMl\ng0sc7Z9fHrvSp0UhT3BqcWpabyyomEhw4dybNVRQM0QfgXbWGbTc+tscA900naTF\nrjsHt3Jk5wDrtiyUlW1eNGpRpRwxrvaxh9rBC908pqM/uGmkQFU2tGFt4YGlVHFr\nn2xAILs7FLlu2AAzR1n+3rjPlJock8iY0Qe84MrfuFShVXSPURkg/i67gsxoxjKR\negmctpHSMXsnqV0USEbgFrZq0B5zHKhEsZ3oat3TH15UY0MEPTO+qYxGdkbCK6Wm\n4CIabHltJNYRJ6DZeuuVhJdTFRlaJKOftTKJoxxPgQKBgQDr3wwj2LNpC/cneYsj\nEwvn42Jec0qm0F+UTrxFe3tTD8d5J6YrKvDHn2534XoMJPCJ1GTQeoFUZFFQsdrZ\n8xW5DUphjcR01cO6bJSa/UAObwz8jS/JAoOTHUm1/53qoxaUYk7jcjmOkPOTqaXs\nXmL/rgjQJgymMQlURwY7GM35vwKBgQDpK4Uqe11oFgOGR0Yil767ZfdMoFTmOWwi\no+SXJXU0JtZ0ybQC49LrbVczYJUP2QTQifozWaNZQt6XxI4jykBo5svAZHken3tf\nQyLKx6zxSQfgdk7ULmK8pAbDmw3HMKdjErS9gnRpQXJU9oWP8ukxo3NyTY0tCUrm\ngxYJg4nLQQKBgHqSsZNbRHidcDXCUszKVBCQOIlOroebl1/RvsL41XCnrYhHU3Hx\nYajLMDP6J1tyQtHNXwp77wN1ElC17D4AtdQxlOq3KlVw1MLnNB6K5qPZj80aba+u\nr8Nen/SFPoI1eEFqCQbnUAPHTdz5dzErJ5Uo0omgjEg9CVUTh6hkTn2vAoGAK3AJ\nGdXrm8VmGLDUdwNP6/dd7696wXz3ESj5H9NBl1qY3x7oYxVwKJ2w/ghDHLWwOO1L\naB+N18YmU52xYSd/gktkr83H5pWNVTzbkW1LYZPaXM2Nd+fASyY/gFc1ZONCe6lz\ndE6GQ0mG9B8M2LlHChFKI4QhBb/SbUkEZPdVR0ECgYBHgTJA1meIUgrapx6X+SXj\npLM5eQ+FhlD92CVe9r1JZW65zkMxjy2LG6587Oqoi4KRRSwy+o/LZrSuuaXKqdxX\n3dy89C0t55RFHiWaoqmXbG4SFnQ3r3e2BQMsEiyRHrACb9bzoSsYMV9LN/Cnj8rg\niuA7+/TjjKTwZ7jaRwWrsg==\n-----END PRIVATE KEY-----\n",
  client_email: "nymbus-vips@nymbus-vips.iam.gserviceaccount.com",
  client_id: "102506474609318836645",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/nymbus-vips%40nymbus-vips.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let spreadsheetID;
  if (query.type !== 'daily') {
    spreadsheetID = ""; // Monthly
  } else {
    spreadsheetID = "15_AdeQ3KdG_5RH9o6FVKtZen30WEnoyy54dpdQKczxQ"; // Daily
  }
  // Initializes the Google APIs client library and sets up the authentication using service account credentials.
  const auth = new google.auth.GoogleAuth({
    credentials: googleJSON, // Path to your service account key file.
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scope for Google Sheets API.
  });
  const body = await readBody(event);
  // Asynchronous function to write data to a Google Sheet.
  async function writeToSheet(values) {
    const sheets = google.sheets({ version: "v4", auth }); // Creates a Sheets API client instance.
    const spreadsheetId = spreadsheetID; // The ID of the spreadsheet.
    const range = `${query.type !== 'daily' ? query.type : body[0]}!A:A`; // The range in the sheet where data will be written.
    const valueInputOption = "USER_ENTERED"; // How input data should be interpreted.

    const resource = { values }; // The data to be written.

    try {
      const res = sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      return res; // Returns the response from the Sheets API.
    } catch (error) {
      console.error("error", error); // Logs errors.
    }
  }

  const writer = await writeToSheet([body]);
  // console.log("writer", writer);

  return writer;
});