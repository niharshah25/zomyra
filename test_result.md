#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Import the repository https://github.com/niharshah25/zomyra.git and set it up so I can continue development."

backend:
  - task: "Backend setup after repo import"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Cloned repo, installed python deps from backend/requirements.txt (incl. emergentintegrations==0.2.0), created backend/.env with MONGO_URL=mongodb://localhost:27017 and DB_NAME=zomyra_database. /api/ returns 200. Supervisor 'backend' RUNNING."
      - working: true
        agent: "testing"
        comment: "✅ ALL BACKEND TESTS PASSED (5/5). Verified: (1) GET /api/ returns {message: Hello World} with 200 status, (2) POST /api/status successfully creates StatusCheck with id/client_name/timestamp, (3) GET /api/status retrieves all status checks from MongoDB, (4) MongoDB connection working - data persists correctly in status_checks collection (2 documents created and retrieved), (5) CORS configured to allow all origins (*). Supervisor backend service RUNNING (pid 815). No errors in backend logs. Backend is fully functional."

frontend:
  - task: "Frontend setup after repo import"
    implemented: true
    working: true
    file: "frontend/app/index.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Cloned Zomyra repo files into /app/frontend (preserving /app/.git and /app/.emergent). Ran yarn install (614 packages). Created frontend/.env with EXPO_PACKAGER_PROXY_URL, EXPO_PACKAGER_HOSTNAME, EXPO_PUBLIC_BACKEND_URL. Expo bundled successfully (3086 modules). Landing screen 'Zomyra — Find a partner who shares your values' renders correctly with Continue with Phone / Continue with Google CTAs."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Repository import & environment bootstrap"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Imported https://github.com/niharshah25/zomyra.git into /app. Installed all dependencies (yarn for frontend, pip for backend). Created .env files for both. All supervisor services (mongodb, backend, expo) are RUNNING. Frontend renders the Zomyra onboarding screen at port 3000."
  - agent: "testing"
    message: "Backend verification complete after repo import. All 5 backend tests PASSED: (1) GET /api/ endpoint working, (2) POST /api/status creates records correctly, (3) GET /api/status retrieves records, (4) MongoDB connection and data persistence verified (2 test documents created), (5) CORS configured properly. Backend service running on pid 815. No critical errors in logs. Backend is fully functional and ready for development."
