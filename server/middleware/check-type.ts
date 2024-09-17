// server/middleware/check-type.ts
export default defineEventHandler((event) => {
  const url = getRequestURL(event); // Get the full request URL
  const query = getQuery(event);

  // Check if 'type' query exists in the request URL
  if (!query.type && url.pathname.startsWith("/campaign")) {
    // If the 'type' query is missing, you can return an error or modify the response
    throw createError({
      statusCode: 400,
      statusMessage: "Missing 'type' query parameter",
    });
  }

  // If the 'type' query is found, proceed as normal
  // console.log("Type query found:", query.type);
});
