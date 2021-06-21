FROM 012684607649.dkr.ecr.eu-west-1.amazonaws.com/verdi/docker-greensill-base:node12-1.1.0

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=8080
COPY dist/out ./dist
COPY server ./
COPY node_modules ./node_modules

EXPOSE 8080
CMD [ "node", "--require", "newrelic", "server.js"]
