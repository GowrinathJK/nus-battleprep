NUS BattlePrep
Team Name: AG Darks
Team Members: Gowrinath Jayamani Kanagaraj and Sadhick Batcha Aashil Mohammed
Targeted Level of Achievement: Apollo 11
Milestone 1: Ideation
Problem Motivation
Revision can get quite repetitive when students are studying alone or just going through practice questions by themselves. It is also easy to keep practising without really knowing which areas need more attention.
NUS BattlePrep is our idea to make revision more engaging through quiz battles. Students will be able to revise module content while competing with their friends in short timed quizzes. 
Proposed Core Features
The main features we are planning for the platform are:
1. Google Login
Users will be able to sign in using their Google account so that they can access the platform through their own account.
2. Module Based Quizzes
Users will be able to choose a module and attempt questions related to that module.
3. Friend Battle Rooms
Users will be able to create or join a quiz battle with their friends using a room code.
4. Scores and Leaderboard
Users will be able to compare their quiz performance through scores and a leaderboard.
5. Weak Topic Tracking
We plan to eventually allow users to identify topics where they tend to make more mistakes.
Current Design
At this stage, we have built the frontend of the application and connected the login page to Firebase Authentication.
The current working flow is:
User  NUS BattlePrep website built with Next.js  Google Sign In through Firebase Authentication  Dashboard page after successful login
Technical Proof of Concept
For Milestone 1, we have completed a working authentication flow.
The following has been implemented and tested:
•	The frontend application runs locally
•	A login page has been created
•	The login page is connected to Firebase Authentication
•	Google Sign In works successfully
•	After signing in, the user is redirected to the dashboard
•	The authenticated user appears in the Firebase Authentication Users page
This shows that our frontend can successfully connect to Firebase Authentication and support user login, which will be needed before implementing quizzes and battles.
Development Plan
Completed for Milestone 1
•	Finalised our project idea
•	Identified the main proposed features
•	Chosen our initial technologies
•	Built the initial frontend interface
•	Created a working login page
•	Connected Google Sign In using Firebase Authentication
•	Tested login and dashboard redirection
Next Step: Quiz Setup
•	Set up Firebase Firestore
•	Store basic user information after login
•	Add questions for selected modules
•	Build a simple quiz attempt flow
•	Display the user's score after completing a quiz
Later Step: Battle System
•	Allow users to create a room
•	Generate a room code
•	Allow friends to join the same room
•	Give both players the same quiz questions
•	Compare their scores at the end of the battle

