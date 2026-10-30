---
name: ezys-docs
description: Find and explain the official Ezys documentation — the Partner API (quotes, firm quotes, intents, execution status, receipts, webhooks, authentication and request signing, idempotency, errors, money and amounts), the OpenAPI contract, and how fintech service providers and FX trading institutions use the Ezys solver network. Use when integrating with Ezys, writing or reviewing code that calls the Ezys API, or answering Ezys developer questions.
---

# Ezys Docs

Answer from the Ezys documentation, not from memory. Start with the guide for the reader's role, then read the API Reference page and the OpenAPI operation needed to implement it. Do not guess base URLs, endpoint paths, header names, the request-signing canonical string, scopes, amount encoding, status values or error codes; read them from the pages below before answering or writing code.

This skill is read-only. It reads and explains documentation. It must not call the Ezys API, create or use API keys or signing secrets, sign requests, or register webhooks. When the reader needs one of those, link the page that describes it and leave the action to the reader.

## Choose the documentation section

All links use the canonical site `https://docs.ezys.io/`.

| Section | Start here when the reader wants to… |
| --- | --- |
| [Introduction](https://docs.ezys.io/index.md) and [Architecture](https://docs.ezys.io/architecture.md) | Understand what Ezys does and which parts are public: quotes, intents, execution status, receipts and webhooks. |
| [For Fintech Service Providers](https://docs.ezys.io/for-fsps/overview.md) | Lock a rate and execute it ([Intent](https://docs.ezys.io/for-fsps/intent.md)), choose an [execution strategy](https://docs.ezys.io/for-fsps/strategy.md), or follow [settlement](https://docs.ezys.io/for-fsps/settlement.md) after acceptance. |
| [For FX Trading Institutions](https://docs.ezys.io/for-institutions/overview.md) | Provide liquidity ([Liquidity Provider](https://docs.ezys.io/for-institutions/liquidity-provider.md)) or propose batch solutions ([Solver Participation](https://docs.ezys.io/for-institutions/validator.md)). |
| [Core Concepts](https://docs.ezys.io/core-concepts/solver-network.md) | Understand how execution paths are chosen and how [execution and settlement](https://docs.ezys.io/core-concepts/execution-settlement.md) report results. |
| [API Reference](https://docs.ezys.io/api-reference/overview.md) | Find base URLs, endpoint availability, request and response formats, HTTP status codes and error codes. |

Within the API Reference:

| Page | Read it for… |
| --- | --- |
| [Authentication](https://docs.ezys.io/api-reference/authentication.md) | `X-API-Key`, which endpoints must also be signed, the HMAC-SHA256 canonical string, timestamp and nonce rules, scopes. |
| [Idempotency](https://docs.ezys.io/api-reference/idempotency.md) | `X-Idempotency-Key`, replay of completed requests, the retention window. |
| [Quote API](https://docs.ezys.io/api-reference/quote-api.md) | Indicative quotes and firm (lockable) quotes. |
| [Intent API](https://docs.ezys.io/api-reference/intent-api.md) | Submitting an intent, technical fields to resolve before signing, acceptance and rejection. |
| [Status API](https://docs.ezys.io/api-reference/status-api.md) | Execution phases and the `events[]` history. |
| [Receipts API](https://docs.ezys.io/api-reference/receipts-api.md) | When a receipt is issued and what it contains. |
| [Webhooks](https://docs.ezys.io/api-reference/webhooks.md) | Registering endpoints, event format, signature verification, delivery and resend. |
| [Error Handling & Retries](https://docs.ezys.io/api-reference/errors.md) | Which failures are safe to retry, and how. |
| [Money & Amounts](https://docs.ezys.io/api-reference/money-and-amounts.md) | Minor units, string encoding, currency and exponent. |
| [OpenAPI Specification](https://docs.ezys.io/api-reference/openapi.md) | Where the machine-readable contract is and how it relates to these pages. |

## Find and read the evidence

Prefer the MCP server at `https://docs.ezys.io/mcp` (Streamable HTTP, read-only) when it is available:

| Tool | Use it to… |
| --- | --- |
| `search` | Find the page sections that answer a question. |
| `list_pages` | List every page with its section, summary and Markdown URL. |
| `read_page` | Read a page's Markdown by path or URL. Long pages come in parts; follow `nextOffset`. |
| `get_api_operation` | Get one OpenAPI operation — parameters, request body, responses — with its schemas resolved. Call it without arguments to list the operations. |

Without MCP, read the site directly:

- [Documentation index](https://docs.ezys.io/llms.txt): every page with a one-line summary, in navigation order.
- [Full documentation](https://docs.ezys.io/llms-full.txt): every page in one file. Prefer single pages for focused questions.
- Markdown pages: replace `.html` with `.md` in a page URL, for example `https://docs.ezys.io/api-reference/quote-api.md`.
- [OpenAPI document](https://docs.ezys.io/openapi/ezys-partner-api.v1.yaml) (YAML): the endpoint and schema contract.

## Keep answers grounded

- Check availability before using an endpoint. The API Reference marks endpoints Available, Coming soon or planned; only Available endpoints are callable contracts. The same applies to base URLs: use the one the Overview marks for the reader's stage.
- The API key and the signing secret are different credentials. The API key is sent on every request; the signing secret is never sent and only signs the endpoints listed under Signed endpoints. Webhook signing secrets verify received webhooks and do not sign requests.
- Amount fields are integers in the asset's minor unit, encoded as JSON strings. Read Money & Amounts before converting or displaying an amount.
- Treat response objects as open to new fields, except where a page documents a closed value set or a frozen body. Branch only on the documented closed sets.
- When the prose and the OpenAPI document seem to disagree, say so and cite both; do not pick one silently.
- Cite the page URL (or the OpenAPI operation) for each fact you use, and say which behaviour you could not confirm from the documentation.
