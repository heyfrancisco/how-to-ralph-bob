# The Ralph Wiggum Technique for IBM Bob

## Table of Contents
1. [Introduction](#introduction)
2. [Core Philosophy](#core-philosophy)
3. [How It Works](#how-it-works)
4. [Implementation with Bob-Shell](#implementation-with-bob-shell)
5. [The Ralph Loop Script](#the-ralph-loop-script)
6. [Prompt Engineering](#prompt-engineering)
7. [Best Practices](#best-practices)
8. [Advanced Patterns](#advanced-patterns)
9. [Troubleshooting](#troubleshooting)
10. [Examples](#examples)
11. [Comparison: Traditional vs Ralph](#comparison-traditional-vs-ralph)
12. [Tips for Success](#tips-for-success)

---

## Introduction

The **Ralph Wiggum Technique** is a revolutionary AI methodology that simplifies complex software development workflows by embracing a single, powerful principle:

> **"Ralph simplifies everything."**

Instead of crafting elaborate, phase-specific prompts for each stage of development, you run the **same prompt in a loop**, allowing the AI to self-organize, prioritize, and execute tasks autonomously.

Named after the beloved Simpsons character known for his simple yet profound observations, this technique strips away complexity and lets the AI agent work naturally through iterative cycles.

### Why Ralph Wiggum?

Ralph Wiggum's character embodies simplicity and unexpected wisdom. Similarly, this technique:
- **Simplifies** complex workflows into a single repeating pattern
- **Trusts** the AI's judgment for task prioritization
- **Iterates** naturally without rigid phase structures
- **Delivers** results through consistent, focused execution

---

## Core Philosophy

### The Three Pillars

1. **Single Prompt, Multiple Iterations**
   - One well-crafted prompt runs repeatedly
   - No phase-specific prompt engineering required
   - Consistency across all iterations

2. **AI-Driven Prioritization**
   - The AI decides which task to tackle next
   - Priority is based on dependencies, complexity, and logical flow
   - Human intervention only when needed

3. **Feedback Loop Integration**
   - Each iteration checks its own work (tests, types, linting)
   - Progress is tracked and committed
   - Self-correcting through continuous validation

---

## How It Works

### The Ralph Cycle

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

---

## Implementation with Bob-Shell

### Prerequisites

1. **Bob-Shell installed and configured**
   ```bash
   # Verify Bob-Shell is available
   bob --version
   ```

2. **Project Structure**
   ```
   your-project/
   ├── plan.md              # Your project plan/PRD
   ├── progress.txt         # Progress tracking file
   ├── ralph.sh             # The Ralph loop script
   └── [your project files]
   ```

3. **Initial Setup Files**

   **plan.md** - Your project requirements:
   ```markdown
   # Project Plan
   
   ## Overview
   [Brief description of what you're building]
   
   ## Features
   - [ ] Feature 1: Description
   - [ ] Feature 2: Description
   - [ ] Feature 3: Description
   
   ## Technical Requirements
   - Language: [e.g., TypeScript, Python]
   - Framework: [e.g., React, FastAPI]
   - Testing: [e.g., Jest, pytest]
   
   ## Success Criteria
   - All features implemented
   - Tests passing
   - Documentation complete
   ```

   **progress.txt** - Initially empty or with a header:
   ```
   # Progress Log
   
   Started: [Date]
   
   ---
   ```

---

## The Ralph Loop Script

### Basic Implementation

Create `ralph.sh` in your project root:

```bash
#!/bin/bash
# ralph.sh - The Ralph Wiggum Technique for Bob-Shell
# Usage: ./ralph.sh <iterations>

set -e

# Color output for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

if [ -z "$1" ]; then
  echo -e "${RED}Usage: $0 <iterations>${NC}"
  echo "Example: $0 10"
  exit 1
fi

ITERATIONS=$1
echo -e "${BLUE}🎯 Starting Ralph Wiggum Technique with ${ITERATIONS} iterations${NC}"
echo ""

# The Ralph Prompt - Simple, consistent, powerful
RALPH_PROMPT="@plan.md @progress.txt

You are working on this project using the Ralph Wiggum Technique.

Instructions for this iteration:

1. **Decide Priority**: Review the plan and progress. Choose the SINGLE task 
   that YOU determine has the highest priority. Consider:
   - Dependencies (what needs to be done first?)
   - Complexity (start simple, build up)
   - Logical flow (what makes sense next?)

2. **Execute**: Implement ONLY that single feature/task completely.
   - Write clean, well-documented code
   - Follow project conventions
   - Make focused, atomic changes

3. **Validate**: Run all feedback loops:
   - Type checking (if applicable)
   - Unit tests
   - Linting
   - Integration tests (if applicable)
   - Fix any issues found

4. **Document**: Append your progress to progress.txt with:
   - What you implemented
   - Any decisions made
   - Issues encountered and resolved
   - What's next (optional)

5. **Commit**: Make a git commit with a clear, descriptive message.
   Format: 'feat: <what you did>'

6. **Check Completion**: If ALL work from the plan is complete and validated:
   - Output exactly: <promise>COMPLETE</promise>
   - Otherwise, continue to next iteration

IMPORTANT: Work on ONE feature only. Be thorough but focused."

# Main loop
for ((i=1; i<=$ITERATIONS; i++)); do
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}Iteration $i of $ITERATIONS${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  # Run Bob with the Ralph prompt (--yolo flag accepts all prompts automatically)
  result=$(bob --yolo "$RALPH_PROMPT")
  
  echo "$result"
  echo ""
  
  # Check for completion signal
  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ Project complete! All tasks finished.${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
  fi
  
  # Brief pause between iterations (optional)
  if [ $i -lt $ITERATIONS ]; then
    echo -e "${BLUE}Continuing to next iteration...${NC}"
    echo ""
    sleep 1
  fi
done

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  Reached maximum iterations ($ITERATIONS)${NC}"
echo -e "${YELLOW}Check progress.txt and plan.md to see status${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
```

### Make it Executable

```bash
chmod +x ralph.sh
```

### Usage

```bash
# Run with 10 iterations
./ralph.sh 10

# Run with 20 iterations for larger projects
./ralph.sh 20

# Run with 5 iterations for quick tasks
./ralph.sh 5
```

### The --yolo Flag

The script uses Bob-Shell's `--yolo` flag, which automatically accepts all prompts without requiring user confirmation. This is essential for the Ralph Wiggum Technique because:

- **Autonomous Operation**: Allows the script to run multiple iterations without manual intervention
- **Continuous Flow**: Enables the AI to work through tasks sequentially without pausing
- **True Automation**: Makes the Ralph loop fully automated as intended

**Important**: The `--yolo` flag means Bob will execute all tool calls automatically. Ensure your `plan.md` is well-defined and your project is in a safe state (e.g., committed to git) before running Ralph.

---

## Prompt Engineering

### The Anatomy of a Ralph Prompt

The Ralph prompt has six key components:

#### 1. Context Loading
```
@plan.md @progress.txt
```
- Loads the project plan and current progress
- Provides full context to the AI
- No need to repeat information

#### 2. Task Selection
```
1. **Decide Priority**: Review the plan and progress. Choose the SINGLE task that YOU determine has the highest priority.
```
- Empowers AI to make decisions
- Emphasizes single-task focus
- Provides decision criteria

#### 3. Execution Guidelines
```
2. **Execute**: Implement ONLY that single feature/task completely.
```
- Clear scope limitation
- Quality expectations
- Convention adherence

#### 4. Validation Requirements
```
3. **Validate**: Run all feedback loops:
   - Type checking
   - Unit tests
   - Linting
```
- Built-in quality gates
- Self-correction mechanism
- Ensures working code

#### 5. Progress Tracking
```
4. **Document**: Append your progress to progress.txt
```
- Maintains history
- Enables learning from past iterations
- Provides audit trail

#### 6. Completion Signal
```
6. **Check Completion**: If ALL work is complete:
   - Output exactly: <promise>COMPLETE</promise>
```
- Clear exit condition
- Prevents over-iteration
- Signals success

---

## Best Practices

### 1. Start with a Clear Plan

**EXAMPLE: Good plan.md:**
```markdown
# E-commerce Cart System

## Features
- [ ] Add item to cart with quantity
- [ ] Remove item from cart
- [ ] Update item quantity
- [ ] Calculate cart total
- [ ] Apply discount codes
- [ ] Persist cart to localStorage

## Technical Stack
- TypeScript
- React
- Jest for testing
- ESLint + Prettier

## Success Criteria
- All features working
- 80%+ test coverage
- No TypeScript errors
- All linting rules pass
```

**EXAMPLE: Poor plan.md:**
```markdown
# Build a cart

Make a shopping cart that works.
```

### 2. Set Appropriate Iteration Counts

| Project Size | Recommended Iterations |
|--------------|------------------------|
| Small (1-3 features) | 5-10 |
| Medium (4-10 features) | 10-20 |
| Large (10+ features) | 20-50 |
| Refactoring | 5-15 |
| Bug fixes | 3-10 |

### 3. Monitor Progress

Check `progress.txt` periodically:
```bash
# View recent progress
tail -n 50 progress.txt

# Search for specific feature
grep -i "authentication" progress.txt

# Count completed features
grep -c "✅" progress.txt
```

### 4. Use Git Effectively

The Ralph technique creates a clean git history:
```bash
# View the commit history
git log --oneline

# See what was done in each iteration
git log --stat

# Review a specific feature
git show <commit-hash>
```

### 5. Handle Interruptions

If you need to stop and resume:
```bash
# Stop the script (Ctrl+C)
^C

# Review progress
cat progress.txt

# Resume with remaining iterations
./ralph.sh 5
```

### 6. Adjust Based on Feedback

If iterations are too small or too large:

**Too Small** (not enough progress per iteration):
- Simplify the prompt
- Reduce validation steps
- Combine related features in plan.md

**Too Large** (too much per iteration):
- Break down features in plan.md
- Add more specific acceptance criteria
- Emphasize "single feature" more strongly

---

## Advanced Patterns

### Pattern 1: Multi-Stage Ralph

For complex projects, use multiple Ralph scripts:

```bash
# Stage 1: Core features
./ralph-core.sh 10

# Stage 2: Integration
./ralph-integration.sh 5

# Stage 3: Polish
./ralph-polish.sh 5
```

Each script has a tailored prompt for its stage.

### Pattern 2: Ralph with Review Gates

Add human review between iterations:

```bash
#!/bin/bash
# ralph-reviewed.sh

for ((i=1; i<=$1; i++)); do
  result=$(bob "$RALPH_PROMPT")
  echo "$result"
  
  # Human review gate
  echo "Review the changes. Continue? (y/n)"
  read -r response
  if [[ "$response" != "y" ]]; then
    echo "Stopping for review."
    exit 0
  fi
done
```

### Pattern 3: Ralph with Metrics

Track performance metrics:

```bash
#!/bin/bash
# ralph-metrics.sh

METRICS_FILE="metrics.json"
echo "[]" > $METRICS_FILE

for ((i=1; i<=$1; i++)); do
  start_time=$(date +%s)
  
  result=$(bob "$RALPH_PROMPT")
  
  end_time=$(date +%s)
  duration=$((end_time - start_time))
  
  # Log metrics
  jq ". += [{\"iteration\": $i, \"duration\": $duration, \"timestamp\": \"$(date -Iseconds)\"}]" \
    $METRICS_FILE > tmp.json && mv tmp.json $METRICS_FILE
  
  echo "$result"
done
```

### Pattern 4: Parallel Ralph

For independent features:

```bash
#!/bin/bash
# ralph-parallel.sh

# Split plan into independent chunks
split -l 5 plan.md plan-chunk-

# Run Ralph on each chunk in parallel
for chunk in plan-chunk-*; do
  (
    bob "@$chunk @progress-$(basename $chunk).txt [Ralph prompt]"
  ) &
done

wait
echo "All parallel Ralph processes complete"
```

### Pattern 5: Ralph with Rollback

Add automatic rollback on failure:

```bash
#!/bin/bash
# ralph-safe.sh

for ((i=1; i<=$1; i++)); do
  # Create checkpoint
  git tag "ralph-checkpoint-$i"
  
  result=$(bob "$RALPH_PROMPT")
  echo "$result"
  
  # Check if tests pass
  if ! npm test; then
    echo "Tests failed! Rolling back..."
    git reset --hard "ralph-checkpoint-$i"
    git tag -d "ralph-checkpoint-$i"
    exit 1
  fi
  
  # Clean up old checkpoint
  if [ $i -gt 1 ]; then
    git tag -d "ralph-checkpoint-$((i-1))"
  fi
done
```

---

## Troubleshooting

### Problem: AI Keeps Working on the Same Task

**Symptoms:**
- Multiple iterations on the same feature
- Progress.txt shows repeated attempts
- No forward movement

**Solutions:**
1. Update plan.md to mark completed tasks:
   ```markdown
   - [x] Completed feature
   - [ ] Next feature
   ```

2. Add explicit instruction in prompt:
   ```
   NEVER work on a task marked with [x] in plan.md
   ```

3. Review progress.txt and update it manually if needed

### Problem: Iterations Are Too Large

**Symptoms:**
- Each iteration takes very long
- Multiple features per iteration
- Large git commits

**Solutions:**
1. Break down features in plan.md:
   ```markdown
   Instead of:
   - [ ] User authentication
   
   Use:
   - [ ] User registration form
   - [ ] Password validation
   - [ ] Login endpoint
   - [ ] JWT token generation
   ```

2. Emphasize in prompt:
   ```
   CRITICAL: Implement the SMALLEST possible unit of work.
   If a feature can be split, split it.
   ```

### Problem: Tests Keep Failing

**Symptoms:**
- Validation step fails repeatedly
- AI can't fix the issues
- Stuck in a loop

**Solutions:**
1. Add debugging step to prompt:
   ```
   3.5. **Debug**: If tests fail:
      - Add console.log statements
      - Run tests in verbose mode
      - Check test output carefully
      - Fix ONE issue at a time
   ```

2. Reduce iteration count and review manually:
   ```bash
   ./ralph.sh 3  # Just a few iterations
   # Then review and fix manually
   ```

3. Simplify the test requirements temporarily

### Problem: No Completion Signal

**Symptoms:**
- All tasks done but no `<promise>COMPLETE</promise>`
- Script runs all iterations
- Work is actually complete

**Solutions:**
1. Check plan.md - ensure all tasks are marked [x]

2. Add explicit completion check:
   ```
   6. **Check Completion**: 
      - Count tasks in plan.md
      - Count [x] marks
      - If equal, output: <promise>COMPLETE</promise>
   ```

3. Manually verify and add completion to progress.txt

### Problem: Git Commits Are Messy

**Symptoms:**
- Unclear commit messages
- Multiple features per commit
- Hard to track changes

**Solutions:**
1. Add commit format to prompt:
   ```
   5. **Commit**: Use conventional commits format:
      - feat: for new features
      - fix: for bug fixes
      - docs: for documentation
      - test: for tests
      - refactor: for refactoring
      
      Example: "feat: add user login validation"
   ```

2. Review commits after Ralph completes:
   ```bash
   git rebase -i HEAD~10  # Interactive rebase to clean up
   ```

---

## Examples

See the `/examples/` folder for detailed examples:

- [Example 1: Building a REST API](examples/01-building-rest-api.md)
- [Example 2: React Component Library](examples/02-react-component-library.md)
- [Example 3: Database Migration](examples/03-database-migration.md)

---

## Comparison: Traditional vs Ralph

### Traditional Approach

```bash
# Phase 1: Setup
bob "Set up the project structure"

# Phase 2: Core features
bob "Implement feature A"
bob "Implement feature B"
bob "Implement feature C"

# Phase 3: Testing
bob "Write tests for feature A"
bob "Write tests for feature B"
bob "Write tests for feature C"

# Phase 4: Integration
bob "Integrate all features"

# Phase 5: Polish
bob "Add error handling"
bob "Add documentation"
bob "Final review"
```

**Problems:**
- 10+ different prompts to write
- Manual phase management
- Easy to forget steps
- No automatic prioritization
- Requires constant human oversight

### Ralph Approach

```bash
# One script, one prompt, automatic execution
./ralph.sh 15
```

**Benefits:**
- Single prompt to maintain
- AI handles prioritization
- Automatic validation
- Self-documenting progress
- Minimal human intervention
- Consistent execution

---

## Tips for Success

### 1. Trust the Process
- Let the AI make decisions
- Don't micromanage task order
- Review progress periodically, not constantly

### 2. Start Small
- Begin with 5 iterations
- Observe the pattern
- Scale up as you gain confidence

### 3. Iterate on the Prompt
- Your first Ralph prompt won't be perfect
- Refine based on results
- Keep a changelog of prompt versions

### 4. Use Version Control
- Commit plan.md changes
- Track progress.txt
- Tag successful Ralph runs

### 5. Combine with Human Review
- Use Ralph for implementation
- Review code quality manually
- Refine and polish as needed

---

**Version:** 1.0.0  
**Last Updated:** January 2026  
**License:** MIT
