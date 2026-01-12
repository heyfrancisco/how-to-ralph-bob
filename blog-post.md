---
title: "How to Ralph with Bob"
date: "2026-01-12"
author: "Francisco Ramos do Ó"
---

![Ralph Loop](ralph-loop.png)

### What is Ralph?

> *tl;dr:* In the purest form, Ralph is just a **Bash** loop. 
This approach separates the **what** from the **how**. The developer provides a high-level goal, and the system handles the procedural steps of implementation.

It can be described as an AI methodology that runs AI coding agents in a continuous loop with a **single prompt**. This approach eliminates the need for phase-specific prompts and lets the agent work naturally through iterative cycles:

```bash
# Example of a ralph.sh script with IBM Bob AI Agent
if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

for ((i=1; i<=$1; i++)); do
  result=$(bob --yolo "@plan.md @progress.txt
    Instructions for this iteration:
    1. **Decide Priority**: Review the plan and progress. Choose the SINGLE task that YOU determine has the highest priority. Consider:
    2. **Execute**: Implement ONLY that single feature/task completely.
    3. **Validate**: Type checks and tests.
    4. **Document**: Append your progress to progress.txt
    5. **Commit**: Make a git commit with a clear, descriptive message. 'feat: <what you did>'
    6. **Check Completion**: If ALL work from the plan is complete and validated, output <promise>COMPLETE</promise>")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete after $i iterations."
    exit 0
  fi
done
```

The Agent has the freedom to self-organize, prioritize, and execute tasks autonomously. Named after the beloved [Simpsons character](https://simpsons.fandom.com/wiki/Ralph_Wiggum) known for his simple yet profound observations, this technique lets the AI agent work naturally through iterative cycles.

In each iterative cycle, it performs the following steps:

*   It consults a plan file (e.g., `plan.md`) to understand the overall objectives.
*   It reviews a `progress.md` file to see what has already been completed.
*   Based on this, it decides which task to execute next.
*   It explores the codebase to gather context for the task.
*   It implements the required code changes.
*   It runs feedback loops (such as type-checking, linting, and tests) to verify the changes.
*   Finally, it commits the verified code to version control.

Ralph can be implemented with any tool that does not cap tool calls and usage. It has defects, but these are identifiable and resolvable through various styles of prompts. 

> The technique is deterministically bad in an undeterministic world. 

The critical distinction in this methodology is that the agent, not the developer, chooses the immediate sub-task. The developer sets the high-level goal, but the agent has the autonomy to break it down and execute the plan iteratively. This plan-centric approach offers significant advantages over manual setup. It enforces engineering best practices and consistency across all projects. Every repository starts with the same standards for testing, linting, and documentation. The process is deterministic and repeatable, eliminating the human error inherent in manual configuration.

### A Practical Bob Walkthrough

Adopting Ralph is straightforward: set a goal, review the plan, and let the loop run. Below is a condensed outline, adapted from the repo [how-to-ralph-bob](https://github.com/heyfrancisco/how-to-ralph-bob), for creating a user management REST API.

First, the developer provides a high-level `plan.md` file structured with natural language that defines the overall objectives of the project.

```markdown
# User Management API

## Features
- [ ] Create user endpoint (POST /users)
- [ ] Get user endpoint (GET /users/:id)
- [ ] List users endpoint (GET /users)
- [ ] Update user endpoint (PUT /users/:id)
- [ ] Delete user endpoint (DELETE /users/:id)
- [ ] Input validation
- [ ] Error handling
- [ ] API documentation

## Tech Stack
- Node.js + Express
- TypeScript
- Jest
- Swagger/OpenAPI

## Success Criteria
- All endpoints working
- 90%+ test coverage
- OpenAPI spec complete
- No TypeScript errors

## Running Ralph

$ ./ralph.sh 15

## Expected Progress

Iteration 1: Created Express app setup and basic structure
Iteration 2: Implemented POST /users endpoint with validation
Iteration 3: Added tests for user creation
Iteration 4: Implemented GET /users/:id endpoint
Iteration 5: Added tests for get user
Iteration 6: Implemented GET /users list endpoint
Iteration 7: Added pagination to list endpoint
Iteration 8: Implemented PUT /users/:id endpoint
Iteration 9: Added tests for update user
Iteration 10: Implemented DELETE /users/:id endpoint
Iteration 11: Added comprehensive error handling
Iteration 12: Created OpenAPI specification
Iteration 13: Added input validation middleware
Iteration 14: Completed all tests, 92% coverage
Iteration 15: Final documentation and cleanup
<promise>COMPLETE</promise>
```

After the `plan.md` file is ready, we can run the `ralph.sh` script.

This plan is Ralph’s map. Keep it precise and sequential. For the REST API example, that means:

* Initialize a Node.js project and configure `package.json`.
* Install core dependencies (`express`, `typescript`) and dev dependencies (`jest`, `ts-node`, `eslint`).
* Create and configure `tsconfig.json` and `.eslintrc.json`.
* Scaffold the directory structure: `src/`, `tests/`, `src/controllers`, `src/services`, etc.
* Write the initial `User` model in `src/models/user.ts`.
* Implement the Express server entry point in `src/app.ts` and `src/server.ts`.
* Create the `UserController` with stubbed-out CRUD methods.
* Establish API routes in `src/routes/userRoutes.ts`.
* Write integration tests in `tests/integration/userRoutes.test.ts` for the endpoints.
* Generate an OpenAPI specification in `docs/openapi.yaml`.

When running this script, you set the number of **iterations** for Ralph. It's important to choose appropriate **iteration counts**:

| Project Size | Recommended Iterations |
|--------------|------------------------|
| Small (1-3 features) | 5-10 |
| Medium (4-10 features) | 10-20 |
| Large (10+ features) | 20-50 |
| Refactoring | 5-15 |
| Bug fixes | 3-10 |


```bash
./ralph.sh <number_of_iterations>
```

The system now runs the Ralph Cycle:

```
┌─────────────────────────────────────────────────────────┐
│                    Start Iteration                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  1. Read Context (@plan.md, @progress.txt)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. AI Decides: What's the highest priority task?       │
│     - Considers dependencies                            │
│     - Evaluates complexity                              │
│     - Checks prerequisites                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Execute Single Feature/Task                         │
│     - Write code                                        │
│     - Update documentation                              │
│     - Make focused changes                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. Run Feedback Loops                                  │
│     - Type checking                                     │
│     - Unit tests                                        │
│     - Linting                                           │
│     - Integration tests                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. Update Progress                                     │
│     - Append to progress.txt                            │
│     - Document what was done                            │
│     - Note any issues or decisions                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. Git Commit                                          │
│     - Commit the feature                                │
│     - Clear, descriptive message                        │
│     - Single feature per commit                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────────────────┐
│  7. Check Completion                                      │
│     - All tasks done? → Output <promise>COMPLETE</promise>│
│     - More work? → Continue to next iteration             │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
              [Next Iteration or Exit]
```

With the plan established, the system executes each step. It creates the files, populates them with well-structured boilerplate, and runs the necessary commands (`npm install`, `npm test`). The result is a complete project directory, fully version-controlled with an initial Git commit, ready for developers to begin implementing the core business logic.

By abstracting setup into a declarative, plan-first system, Ralph reduces friction from idea to implementation. It augments the engineer: automation handles the scaffolding and feedback loops so humans can focus on decisions that matter.

### Let Ralph Ralph

Ralph works best when you trust its loop to converge. Give it room to self-identify, self-correct, and self-improve—across the implementation plan, task definition, and prioritization. Expect eventual consistency through iteration.

#### Move Outside the Loop  

Your job is to set the stage, not micromanage. Ralph should pick what to do next and how to do it. Sit on the loop, observe early iterations, and adjust the environment. When Ralph fails in a specific way, add a sign so it succeeds next time.

Think of signs as anything Ralph can discover:
* Prompt guardrails (e.g., “don’t assume not implemented”).
* An `AGENTS.md` with operational learnings and build/test tips.
* Utilities and patterns in the codebase—Ralph will adopt what it finds.
* Other discoverable, relevant inputs.

#### Use Protection (Really)

To run autonomously, Ralph typically needs `--dangerously-skip-permissions`; asking for approval on every tool call breaks the loop and bypasses Claude’s permission system entirely. Treat a sandbox as your only security boundary—assume it will get popped and plan for blast radius.

Operate in isolated environments with minimal access:
* Provide only the API keys and deploy keys needed for the task.
* Expose no private data beyond requirements; restrict network egress when possible.
* Prefer Docker sandboxes locally or remote isolates (Fly Sprites, E2B, etc.).

Keep escape hatches handy: `Ctrl+C` stops the loop, `git reset --hard` reverts uncommitted changes, and you can regenerate the plan if the trajectory drifts.

### Risks of Using Ralph

Ralph introduces several risks that require careful consideration. The most critical concern is security exposure when bypassing permission checks, which makes sandboxing mandatory rather than optional. Without proper isolation, there is potential for data leakage if credentials, browser cookies, SSH keys, or access tokens become accessible to the agent. The methodology can also lead to runaway or wasteful iterations if the initial plan or discoverable signs are poorly defined, causing the agent to spin its wheels or pursue low-value tasks. Without clear, discoverable guardrails, Ralph may mis-prioritize work, focusing on less important features while critical functionality remains incomplete. Finally, loose network or resource limits can result in infrastructure surprises or unexpected costs, especially if the agent makes excessive API calls or consumes resources beyond what was anticipated.

More about Ralph:
- [Guide to leveraging Ralph AI Methodology with IBM Bob](https://github.com/heyfrancisco/how-to-ralph-bob)
- [Original source](https://ghuntley.com/ralph/)
- [The Ralph playbook](https://claytonfarr.github.io/ralph-playbook/)
