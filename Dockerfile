# Use the official Bun image as base
FROM oven/bun:latest

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Create a non-root user
RUN adduser --disabled-password --gecos "" botuser && \
    chown -R botuser:botuser /app

# Switch to non-root user
USER botuser

# Start the bot
CMD ["bun", "run", "src/index.ts"]