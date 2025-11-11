# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# 依存関係のみ先にコピー（キャッシュ有効化）
COPY package*.json ./

# 再現性の高いインストール
RUN npm ci

# アプリ本体をコピー（.dockerignore が効いていれば node_modules は来ない）
COPY . .

# 念のため .bin 配下に実行権を付与（環境により不要だが安全）
RUN chmod -R u+x node_modules/.bin || true

# ビルド
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
