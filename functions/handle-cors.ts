import type { Handler } from "@netlify/functions";

const handler: Handler = async (event, _) => {
  if (
    event.queryStringParameters == null || event.queryStringParameters.access_token == undefined || event.queryStringParameters.message_ids == undefined
  ) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 400,
        code: "missing_parameters"
      }),
    };
  }
  event.queryStringParameters.message_ids.split(",").forEach(async (message_id) => {
    await fetch(
      "https://msg.ischool.com.tw/services/personal/messages",
      {
          method: "PUT",
          body: `access_token=${event.queryStringParameters!.access_token}&message_id=${message_id}`,
          headers: {
              "Host": "msg.ischool.com.tw",
              "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 11; sdk_gphone_arm64 Build/RSR1.210722.002)",
              "Origin": "https://msg.ischool.com.tw/",
              "Content-Type": "application/x-www-form-urlencoded"
          }
      }
    )
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

export { handler };