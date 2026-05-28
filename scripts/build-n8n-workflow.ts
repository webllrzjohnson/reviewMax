import fs from "node:fs";
import path from "node:path";

const buildPrompt = fs.readFileSync(
  path.join("n8n", "code", "01-build-claude-prompt.js"),
  "utf8",
);
const parseResponse = fs.readFileSync(
  path.join("n8n", "code", "02-parse-claude-response.js"),
  "utf8",
);

const claudeBody =
  '={{ JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4096, system: $json.claude_system, messages: [{ role: "user", content: $json.claude_user }] }) }}';

const workflow = {
  name: "ReviewMax - Generate Review",
  nodes: [
    {
      parameters: {
        content:
          "## ReviewMax setup\n\n1. **Claude API** node → create Header Auth credential (name: `x-api-key`, value: your Anthropic API key)\n2. **Publish to ReviewMax** → set URL to `https://YOUR_DOMAIN/api/webhook/n8n`\n3. **Publish to ReviewMax** → set `X-Webhook-Secret` header to match ReviewMax `WEBHOOK_SECRET`\n4. **Activate** this workflow\n5. Copy **Webhook** Production URL → ReviewMax `N8N_REVIEW_WEBHOOK_URL`",
        height: 360,
        width: 440,
      },
      id: "sticky-note-1",
      name: "Setup notes",
      type: "n8n-nodes-base.stickyNote",
      typeVersion: 1,
      position: [-220, 80],
    },
    {
      parameters: {
        httpMethod: "POST",
        path: "review-request",
        responseMode: "onReceived",
        options: {},
      },
      id: "webhook-1",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      webhookId: "reviewmax-review-request",
    },
    {
      parameters: { jsCode: buildPrompt, mode: "runOnceForAllItems" },
      id: "code-1",
      name: "Build Claude prompt",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [480, 300],
    },
    {
      parameters: {
        method: "POST",
        url: "https://api.anthropic.com/v1/messages",
        authentication: "genericCredentialType",
        genericAuthType: "httpHeaderAuth",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "anthropic-version", value: "2023-06-01" },
            { name: "content-type", value: "application/json" },
          ],
        },
        sendBody: true,
        specifyBody: "json",
        jsonBody: claudeBody,
        options: {},
      },
      id: "http-claude",
      name: "Claude API",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [720, 300],
    },
    {
      parameters: { jsCode: parseResponse, mode: "runOnceForAllItems" },
      id: "code-2",
      name: "Parse Claude response",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [960, 300],
    },
    {
      parameters: {
        method: "POST",
        url: "https://YOUR_REVIEWMAX_DOMAIN/api/webhook/n8n",
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: "Content-Type", value: "application/json" },
            {
              name: "X-Webhook-Secret",
              value: "reviewmax-local-webhook-secret-change-me",
            },
          ],
        },
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify($json) }}",
        options: {},
      },
      id: "http-publish",
      name: "Publish to ReviewMax",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [1200, 300],
    },
  ],
  connections: {
    Webhook: {
      main: [[{ node: "Build Claude prompt", type: "main", index: 0 }]],
    },
    "Build Claude prompt": {
      main: [[{ node: "Claude API", type: "main", index: 0 }]],
    },
    "Claude API": {
      main: [[{ node: "Parse Claude response", type: "main", index: 0 }]],
    },
    "Parse Claude response": {
      main: [[{ node: "Publish to ReviewMax", type: "main", index: 0 }]],
    },
  },
  pinData: {},
  settings: { executionOrder: "v1" },
  staticData: null,
  tags: [],
  triggerCount: 0,
  active: false,
};

const outPath = path.join("n8n", "reviewmax-generate-review.workflow.json");
fs.writeFileSync(outPath, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`Wrote ${outPath}`);
