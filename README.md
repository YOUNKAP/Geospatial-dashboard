# APLGroup

A Geospatial web application to visualize the map potential areas to build data centers in Japan.

### Getting Started

Follow the steps listed below to set up the projects on your local machine

### Frontend Codebase set up

The frontend codebase is built with NextJS 12 and Mapbox using NodeJS v.16.17.10

1. Go to the Frontend directory:

```sh
cd frontend
```

2. Install dependencies by using yarn or npm

```sh
yarn install # or npm i
```

3. Run Development mode

```sh
yarn dev # or npm run dev
```

4. Run Build

```sh
yarn build # or npm run build
```

## Deploying to Vercel through a Mirror Repository

Note: This method is implemented to meet the quick requirement we have for the development of the project.

1. The mirror repository is the exact copy of the APLGroup repository under the Omdena Organization.
2. It is only used to make the deployment to Vercel possible under the hobby account which support free hosting and deployments.

**Run the following commands on the root of this project:**

1. Set up new git remote for the mirror repository

```sh
git remote add production https://github.com/quadroloop/apl-group-mirror
```

The APL Code mirror is only used for deployment to vercel, you need access to this repository to be able to push to it.

2. Deploy using the following command:

```sh
git push -f production # or yarn deploy production
```

Alternatively, you can also use the deployment script:

```sh
./deploy-app.sh
```

this command will only work once the 1st step is completed.

### Backend Codebase setup

Follow the instructions below to run the backend service for backend codebase.

1. Navigate to the backend codebase

```sh
cd backend
```

2. Following installation steps in the README.md file
