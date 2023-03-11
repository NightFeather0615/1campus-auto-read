import { Handler } from "@netlify/functions";

const countPerPage = 100;
const pageNo = 1;

const handler: Handler = async (event, _) => {
  if (
    event.queryStringParameters == null || event.queryStringParameters.access_token == undefined
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

  let messages: any = await (await fetch(
    `https://msg.ischool.com.tw/services/personal/messages?access_token=${event.queryStringParameters!.access_token}&count_per_page=${countPerPage}&page_no=${pageNo}`,
    {
      method: "GET"
    }
  )).json();

  messages
    .filter(messageData => messageData.read_time == null)
    .map(messageData => messageData.message_id)
    .forEach(async (messageId) => {
      await fetch(
        "https://msg.ischool.com.tw/services/personal/messages",
        {
          method: "PUT",
          body: `access_token=${event.queryStringParameters!.access_token}&message_id=${messageId}`,
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
    body: JSON.stringify({success: true}),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

export { handler };