import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const countPerPage = 100;
let pageNo = 1;

const apiUrl = "https://asia-east1-campus-cdddd.cloudfunctions.net";

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

  let accessToken: string = event.queryStringParameters!.access_token;

  let messages: any = (
    (
      await (
        await fetch(
          `${apiUrl}/mobileTW/getMessages?access_token=${accessToken}&count_per_page=${countPerPage}&page_no=${pageNo}`,
        )
      ).json()
    ) as any
  ).filter(messageData => messageData.read_time === null);

  while (messages.length > 0) {
    messages = (
      (
        await (
          await fetch(
            `${apiUrl}/mobileTW/getMessages?access_token=${accessToken}&count_per_page=${countPerPage}&page_no=${pageNo}`,
          )
        ).json()
      ) as any
    ).filter(messageData => messageData.read_time === null);

    messages
      .map(messageData => `receiver_id=${messageData.receiver_id}&notice_id=${messageData.content.meta.notice_id}`)
      .forEach(async (messageQuery) => {
        await fetch(
          `${apiUrl}/mobileTW/readMessage?access_token=${accessToken}&${messageQuery}&dsns=tcivs.tc.edu.tw&student_id=undefined&role=student`,
        )
      });
    
    pageNo += 1;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({success: true}),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

export { handler };
