FROM mcr.microsoft.com/playwright:v1.43.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Railway overrides this per service
CMD ["node", "src/server.js"]
