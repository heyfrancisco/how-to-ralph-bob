# Example 1: Building a REST API

## plan.md

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
```

## Running Ralph

```bash
./ralph.sh 15
```

## Expected Progress

```
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