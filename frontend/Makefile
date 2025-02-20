.PHONY: start backend frontend

# Start the backend server
backend:
	cd ../backend && node server.js

# Start the frontend
frontend:
	npm start

# Start both frontend and backend in parallel
start:
	make -j2 backend frontend
