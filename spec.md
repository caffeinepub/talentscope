# TalentScope

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A talent analysis app where users input their social media activity data (posts, topics, engagement, frequency, interests) and receive an AI-style analysis of their talents and potential
- Profile form for users to enter: username/name, and social interaction data manually (since direct OAuth to social platforms is not supported)
  - Fields: name, social platform selection (Twitter/X, LinkedIn, Instagram, Reddit, etc.), topics they post about, content types (text, images, video, links), engagement style (creator, commenter, sharer, lurker), frequency of activity, interests/hobbies mentioned
- Talent analysis engine (backend logic) that maps input signals to talent categories:
  - Analytical/Research, Creative/Artistic, Leadership/Influence, Communication/Writing, Technical/Engineering, Entrepreneurial, Empathetic/Social, Strategic/Planning
- Potential score (0-100) per talent category based on weighted signals
- Results page showing talent breakdown with visual representation (bar/progress bars), top 3 talents highlighted, and personalized insights per talent
- History: users can save multiple analyses and review past results
- Sample/demo analysis with pre-filled data so users can explore the app

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Data types: SocialProfile, TalentScore, AnalysisResult
   - Store submitted profiles and their analysis results
   - Compute talent scores based on weighted input signals
   - CRUD: submitAnalysis, getAnalysis, listAnalyses, deleteAnalysis
   - Seed with 1-2 sample analyses

2. Frontend (React):
   - Landing/home page with hero section explaining the app
   - Analysis form (multi-step): basic info -> platform selection -> activity data
   - Results page: talent breakdown cards, top 3 highlights, score bars, insights text
   - History page: list of past analyses
   - Navigation between pages
   - Responsive design
