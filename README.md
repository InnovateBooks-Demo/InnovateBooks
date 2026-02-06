## \# InnovateBooks

## 

## InnovateBooks is a multi-tenant enterprise SaaS platform designed for finance, commerce, and operations workflows.

## 

## \## 🚀 Features

## \- Multi-tenant architecture

## \- Role-based access control (RBAC)

## \- Subscription-based feature gating

## \- Finance \& commerce modules

## \- Secure JWT authentication

## 

## \## 🛠 Tech Stack

## \- Backend: FastAPI, MongoDB

## \- Frontend: React

## \- Auth: JWT

## \- Payments: Razorpay (configured via environment variables)

## 

## \## 🔐 Environment Setup

## This repository does \*\*NOT\*\* include secrets.

## 

## Copy the example files and configure locally:

## 

## ```bash

## cp backend/.env.example backend/.env

## cp frontend/.env.example frontend/.env

## 

## 

## 

## 

## 

## ⚠️ Security

## 

## Never commit .env files

## 

## Never commit API keys or tokens

## 

## Use .env.example only

## 

## 

## 

## 🧪 Development

## 

## 

## \# Backend

## cd backend

## pip install -r requirements.txt

## uvicorn main:app --reload

## 

## \# Frontend

## cd frontend

## npm install

## npm start

## 

## 

