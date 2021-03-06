import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

const {
  PROJECT_ID,
  ACCESS_TOKEN,
  ASSIGNEE_IDS = undefined,
  ISSUE_LABELS
} = process.env;

function log(tag: string, body: any) {
  console.log(
    JSON.stringify({
      tag,
      body
    })
  );
}

const gitlab = axios.create({
  baseURL: `https://gitlab.com/api/v4/projects/${PROJECT_ID}`,
  headers: {
    "PRIVATE-TOKEN": `${ACCESS_TOKEN}`
  }
});

async function createIssue(email: string) {
  await gitlab.post("/issues", null, {
    params: {
      title: `New Lead: '${email}'`,
      assignee_ids: ASSIGNEE_IDS,
      confidential: true,
      labels: ISSUE_LABELS
    }
  });

  log("CREATED_ISSUE", email);
}

export default async (request: NowRequest, response: NowResponse) => {
  const { email = undefined } = request.body || {};

  if (email) {
    log("RECEIVED_MAIL", email);
    await createIssue(email);
  }

  response.status(303);
  response.setHeader("Location", "/thanks.html");
  response.end();
};
