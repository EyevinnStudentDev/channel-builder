<h1 align="center">
  SDVT Channel-builder
</h1>

<div align="center">
  SDVT Channel builder is a powerful website template designed to make livestreaming seamless. Turn video files into HLS and create livestreaming channels effortlessly. Users can then browse and view livestreams across various channels with ease.
  <br />
  <br />
  
Whether you're building a live platform for events, education or entertainment, Channel builder provides a solid foundation for creating your own custom website. Say goodbye to complicated setups with this streamlined, ready-to-go solution.

  <br />
</div>

<div align="center">
<br />

[![npm](https://img.shields.io/npm/v/@eyevinn/sdvt-channel-builder?style=flat-square)](https://www.npmjs.com/package/@eyevinn/sdvt-channel-builder)
[![github release](https://img.shields.io/github/v/release/Eyevinn/sdvt-channel-builder?style=flat-square)](https://github.com/Eyevinn/sdvt-channel-builder/releases)
[![license](https://img.shields.io/github/license/eyevinn/{{repo-name}}.svg?style=flat-square)](LICENSE)

[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/eyevinn/{{repo-name}}/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![made with hearth by Eyevinn](https://img.shields.io/badge/made%20with%20%E2%99%A5%20by-Eyevinn-59cbe8.svg?style=flat-square)](https://github.com/eyevinn)
[![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)
<br />

</div>

## Features

- Upload HLS-files into FAST Channel Engine for quick streaming in one step
- Set up Channels with multiple HLS-files, sorted into channels
- Authentication template for setting up a user system
- **[To be added]** Full Authentication system using NextAuth.js
- **[To be added]** Transcoding video files to HLS. Seamlessly transitioning from video files to streaming.
  <br />

## Requirements

- **Node.js v18.15.0 or higher**  
  Required to run the React app, manage dependencies, and build the project.  
  (You can download it from [Node.js official website](https://nodejs.org/))

- **npm v8.5.0 or higher** (usually bundled with Node.js)  
  Used for managing the project's dependencies.

- **Next.js v14.1.3 or higher**
  Required for building the React app. Check your installed version with: `npm list next`

## Installation Guide

Welcome to the **sdvt-channel-builder** installation guide. Follow the steps below to set up the project on your local machine.

### Prerequisites

### Built with

- **React** v.18.3.1
- **Node.js** v.18.15.0
- **Next.js**
- **TailwindCSS**
- **TypeScript**
- **Docker**
- **MySQL2**

##### This project also requires features available in [osaas.io](https://www.osaas.io):

- **MariaDB**
- **FAST Channel Engine**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18.15.0 or higher)

You can check if these are installed by running the following commands:

```bash
node -v
git --version
```

---

### 1. Clone Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/svdt-channel-builder.git

cd svdt-channel-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a .env file in the root directory of the project. Use the provided .env file as a reference:

```bash
# .env
# for api calls to OSAAS
OSC_ACCESS_TOKEN=your-OSAAS-token
```

See the chapter on Database setup below for more.

### 4. Run the Application

#### Development mode

To start the application in development mode:

```bash
npm run dev
```

#### Production Mode

Build and run the application:

```bash
npm run build
npm start
```

The application will be available at http://localhost:3000 (or the specified port).

## OSAAS Setup

This project uses FAST Channel Engine and MariaDB as services from [osaas.io](https://www.osaas.io). In order to use this website template you will need to setup an account to use these services. After setting up an account follow these instructions.

### 1. Setup MariaDB

Browse to MariaDB. Create a service secret and add it to your .env file.

### 2. Setup Database Instance

Create a new dabase instance. Add the following parameters: Hostip, Port, username, password, database name.

### 3. Update Environment variables

Add above parameters to your environmental variables. See below for example.

```bash
# OSAAS
OSC_ACCESS_TOKEN=OSC_ACCESS_TOKEN

# MariaDB
MYSQL_HOST=MYSQL_HOST         (e.g. 192.125.123.102)
MYSQL_PORT=MYSQL_PORT         (e.g. 10502)
MYSQL_USER=MYSQL_USER         (e.g. user)
MYSQL_PASSWORD=MYSQL_PASSWORD (e.g. password123)
MYSQL_DATABASE=MYSQL_DATABASE (e.g. databasename)

```

## Development

[To be updated]

## Frontend

the frontend is using open-ended architecture and is set to be updated in further development. See below for current structure tree.

```
📦 src
 ┣ 📂 app
 ┃ ┣ 📂 Admin
 ┃ ┣ 📂 api
 ┃ ┃ ┣ 📂 api-doc
 ┃ ┃ ┃ ┣ 📄 page.tsx
 ┃ ┃ ┃ ┗ 📄 react-swagger.tsx
 ┃ ┃ ┣ 📂 getChannels
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┣ 📂 getData
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┣ 📂 managePlaylist
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┣ 📂 postChannel
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┣ 📂 postData
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┣ 📂 postGist
 ┃ ┃ ┃ ┗ 📄 route.ts
 ┃ ┃ ┗ 📂 webhook/[channelId]
 ┃ ┃   ┗ 📄 route.ts
 ┃ ┣ 📂 auth
 ┃ ┃ ┗ 📄 page.tsx
 ┃ ┣ 📂 channels
 ┃ ┃ ┗ 📄 page.tsx
 ┃ ┣ 📂 create
 ┃ ┃ ┗ 📄 page.tsx
 ┃ ┣ 📂 lib
 ┃ ┣ 📂 manage
 ┃ ┃ ┗ 📄 page.tsx
 ┃ ┣ 📂 managePlaylists
 ┃ ┃ ┗ 📄 page.tsx
 ┃ ┣ 📄 globals.css
 ┃ ┣ 📄 layout.tsx
 ┃ ┣ 📄 page.tsx
 ┃ ┗ 📄 providers.tsx
 ┣ 📂 components
 ┣ 📂 entities
 ┃ ┣ 📄 Channel.ts
 ┃ ┣ 📄 ChannelEntity.ts
 ┃ ┗ 📄 Playlist.ts
 ┣ 📄 middleware.ts
 ┗ 📄 .env.local
```

## Backend

In the current iteration most of the backend is handled using calls to OSAAS. Future implementations will see a more developed backend.

## API Endpoints

| **Method** | **URL**                      | **Description**                             | **Requires body?** |
| ---------- | ---------------------------- | ------------------------------------------- | ------------------ |
| `GET`      | `/getChannels`               | Fetch all channels from OSAAS               | No                 |
| `POST`     | `/postChannel`               | Create new channel in OSAAS                 | Yes                |
| `POST`     | `/postData`                  | Store channel data in MariaDB               | Yes                |
| `GET`      | `/getData`                   | Get all channels and their playlists        | No                 |
| `DELETE`   | `/managePlaylist?id?={id}`   | Delete channel and its playlists            | No                 |
| `DELETE`   | `/deleteChannel/{channelId}` | Rollback - delete specific channel/playlist | No                 |
| `GET`      | `/webhook/{channelId}`       | Webhook for multi-playlist channels         | No                 |

## Database

## Contributing

Contributions are welcome.

## The Team

- <a href="https://github.com/AxelHolst">Axel Barck-Holst</a>
- <a href="https://github.com/edvinhed">Edvin Hedenström</a>
- <a href="https://github.com/JinHedman">Filip Hedman</a>
- <a href="https://github.com/kajlid/">Kajsa Lidin</a>
- <a href="https://github.com/okam97/">Oliver Kamruzzaman</a>

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE).

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

a
[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
