# 使用官方的 Node.js 20 镜像作为构建阶段
FROM node:20 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (如果有) 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建项目
RUN npm run build

# 使用 nginx 作为生产阶段
FROM nginx:stable-alpine AS production-stage

# 复制构建的文件到 nginx 的 html 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# COPY --from=build-stage /app/certificate.crt /usr/share/nginx/html
# COPY --from=build-stage /app/private.key /usr/share/nginx/html

# 复制自定义的 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 5174

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
