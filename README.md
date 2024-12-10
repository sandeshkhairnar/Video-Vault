# Video Vault

## Overview
The Video Vault is a full-stack video management application built with Flask (backend) and React.js (frontend), designed to provide a seamless video recording, storing, and playback experience.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Styling**: Tailwind CSS
- **Deployment**: Cloud Platform (e.g., AWS, Heroku, or Google Cloud)

## Prerequisites
- Node.js (v14 or later)
- Python 3.8+
- pip
- npm or yarn

## Project Structure
```
video-management-app/
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── VideoPlayer.js
│   │   │   └── VideoRecorder.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── tailwind.css
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── app.py
│   ├── videos/
│   │   └── (stored video files)
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

## Local Development Setup

### Backend Setup
1. Navigate to the backend directory
```bash
cd backend
```

2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Set up environment variables
- Create a `.env` file in the `backend/` directory
- Add necessary configurations (e.g., database connection, secret keys)

5. Run the Flask server
```bash
python app.py
```

### Frontend Setup
1. Navigate to the frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

## Deployment

### Frontend Deployment
- Recommended Platforms: 
  - Netlify
  - Vercel
  - GitHub Pages

Steps:
1. Build the React application
```bash
npm run build
```

2. Deploy the contents of the `build/` directory to your chosen cloud platform

### Backend Deployment
- Recommended Platforms:
  - Heroku
  - AWS Elastic Beanstalk
  - Google App Engine

Steps:
1. Ensure all dependencies are in `requirements.txt`
2. Create a `Procfile` for platform-specific deployment configuration
3. Set up environment variables in the cloud platform's dashboard

## Features
- Video Recording
- Video Playback
- Cloud Storage Integration
- Responsive Design

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/video-management-app](https://github.com/yourusername/video-management-app)