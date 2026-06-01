FROM node:18-slim AS build

WORKDIR /app

# copy dependency manifests first for better caching
COPY package.json package-lock.json* ./

# install dependencies
RUN npm ci --prefer-offline --no-audit --progress=false || npm install

# copy rest of the source and build
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles React Router fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
