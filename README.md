
# TICKET-FASTER

A NodeJs MicroServices app. Each unique service, such as authentication, has its own Docker container. All the containers are managed by Kubernetes. The api routes and load balancing are managed by ingress.

Users can signup/login, make orders for ticket and then purchase tickets.





## Features
- CD/CI through Github Actions
- Jest Unit testing 
- Self published npm library to stadardize dev practices
- Custom Message Broker through nats streaming
- Payments through Stripe API


## Deployment

Used to be deployed @ ticket-faster.xyz but sadly had to be taken down due to immense hosting cost incurred by k8s cluster



## Installation

```bash
  skaffold dev
```

Note: Requires docker and skaffold: https://skaffold.dev/

    
## Tech Stack
- Typescript
- React
- NodeJS
- MongoDB
- Redis
- Docker
- Kubernetes
- Skaffold
- Jest
