FROM oven/bun
WORKDIR /app
EXPOSE 3000
ENTRYPOINT ["bash", "entrypoint.sh"]
