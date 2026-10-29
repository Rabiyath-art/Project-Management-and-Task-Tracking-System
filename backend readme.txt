npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client@6
npm install -D typescript tsx prisma@6 @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
npx tsc --init
npx prisma init --datasource-provider MySQL  (this create prisma -> schema.prisma )


---------------- Seed data ------------------
npm install bcryptjs
npm install -D tsx

package.json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}

------- Run the seed -----------
npx prisma migrate dev
npx prisma generate
npx prisma db seed

configuration files
backend/
├── prisma/
│   └── schema.prisma
├── .env
├── package.json
└── tsconfig.json


prisma/schema.prisma


generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  MEMBER
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}


npx prisma migrate dev --name init
npx prisma generate
npx prisma validate

npx prisma migrate dev --name init


Section one

npm install zod


----------------- API -----------------------
----- Register -----
POST http://localhost:5000/api/auth/register


----- Login -----
POST http://localhost:5000/api/auth/login


----- Get current user ----- 
GET http://localhost:5000/api/auth/me


-------------- Project Management APIs ---------------------

POST         http://localhost:5000/api/projects                -- Create a project
GET          http://localhost:5000/api/projects                -- List projects
PATCH        http://localhost:5000/api/projects/PROJECT_ID     -- Update project
PATCH        http://localhost:5000/api/projects/PROJECT_ID/archive



------------- Project member management -------------------
POST	/api/projects/:projectId/members	        Add a member
GET	/api/projects/:projectId/members	        List project members
DELETE	/api/projects/:projectId/members/:userId	Remove a member


----------- Task Management APIs ---------------------

POST    /api/projects/PROJECT_ID/tasks                                               Create a task
GET     /api/projects/PROJECT_ID/tasks?status=TODO&priority=HIGH&page=1&limit=10     List
PATCH   /api/tasks/TASK_ID           						     Update task status
DELETE  /api/tasks/TASK_ID					                     delete	


--------------  Comments and activity history -----------------------

POST	/api/tasks/:taskId/comments	Add a comment
GET	/api/tasks/:taskId/comments	View task comments
GET	/api/tasks/:taskId/activities	View task activity history


--------------- Add a comment ----------------------------
POST  http://localhost:5000/api/tasks/TASK_ID/comments
GET   http://localhost:5000/api/tasks/TASK_ID/comments 
GET   http://localhost:5000/api/tasks/TASK_ID/activities


--------------- Notification ---------------------

GET   http://localhost:5000/api/notifications?page=1&limit=10 
PATCH http://localhost:5000/api/notifications/NOTIFICATION_ID/read

---------- Dashboard -----------------------
GET   http://localhost:5000/api/dashboard




---------- Frontend ----------------
npx create-next-app@latest frontend
npm install lucide-react	
npm install axios			

app inside
àlreayd ne sona mathiri auth-login and register
projects =id,new and more
then layout.t`sx and page

component`s

dashboard-`statcard
layout applayout,header,protedtepage`s,s`idebar
project`s- projectcard,projectfilter,project forn,projectmemeber,projectprogre`s`s and s`tatus`badge

UI - button,empty`state,inut,loading`screen,`status`badge
data-project.`st`s
lib
`service

