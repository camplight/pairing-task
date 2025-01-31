# Summary

This is the Camplight LLM pair coding task. You and the interviewer are going to work together on it to implement an LLM-enabled system.

# Preparation

1. If you use VSCode: install LiveShare plugin
2. IF you use another IDE: install https://mob.sh/

The intention is to work in a true pair-programming manner.

# Goals

1. Create an application that enhances text input using an LLM similar to grammarly. It should receive some text and fix grammar and style issues in it.
    1. LLM Model
        - local -> ollama -> deepseek, llama3.1 8b
        - remote -> huggingface/claude/, API?
        - use a factory for model caller / grammar corrector 
        - what if we publish it as a service / sell it to somebody? 
            - what if they want to pay less? we can choose a distilled model 
            - business side of things? how much to charge, how much is will be the traffic
    2. Backend architecture -> can be used without interface
        - nodejs + express / bun + hono
        - password / token authentication
    3. Front-end/CLI tool -> uses backend grammar API
2. Add caching, so we can reduce the calls to the LLM.
    1. what to cache? sentence vs text, two similar sentences can produce the same result (consistency)
    2. dynamic map / in memory / redis
    3. Permanent storage
    4. rate limiting
3. Implement a queue-based interface for the text-enhancement logic.
    1. queue for new requests for users
    2. for same sentences in a request
    3. streaming or polling
4. Deployment
    1. Lambda? ECS? On-Prem?
        - cloudflare workers for free
            - storage considerations
        - if on-prem: serverless and a microservice for running ollama (lightsail ? hetzner (VPS for running warmly)? container?)
5. Approach
    1. simple (run a local server + express app/hono)
    2. Run LLM and test with prompts
    

DECISIONS:
- local + rate limiting + 