#!/bin/bash
# ralph-bob.sh - The Ralph Wiggum Technique for Bob-Shell
# Usage: ./ralph-bob.sh <iterations>

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
   - Format: 'feat: <what you did>'

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
  
  # Run Bob with the Ralph prompt
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
