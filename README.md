<div align="center">
  <h1><b>CCIAA-Service</b></h1>

  <p>A package that provides a set of functions to interact with the CCIAA  (Camera di Commercio, Industria, Artigianato e Agricoltura )</p>
</div>

## Getting Started

This package is available in the npm registry.

```bash
npm install cciaa-service
```

Next, configure the .env file (by following the example) and set the following variables for testing the library:

<ul>
  <li><strong>VITE_CCIAA_USERNAME</strong>: the username of the CCIAA portal </li>
  <li><strong>VITE_CCIAA_PASSWORD</strong>: the password of the CCIAA portal </li>

</ul>

## Installation

Install the package along with its required peer dependencies:

```bash
npm install @likable-hair/cciaa-service
```

> Puppeteer is listed as a peer dependency because it downloads a Chromium binary (~300MB) on install. This gives you full control over the version and avoids duplicate binaries if you already use Puppeteer in your project.

## Requirements

<ul>
  <li>
    <strong>Node.js >= 22.5.4</strong>: Ensure that you have Node.js version 22.x or higher installed on your system. 
    You can check your version by running:
    <pre><code>node -v</code></pre>
  </li>
  <li>
    <strong>Access to CCIAA portal</strong>: You must have valid credentials (username and password) to access the CCIAA portal.
  </li>
  <li>ESM projects (`"type": "module"`) are fully supported</li>
</ul>

## Usage

Run the following command to test the package

```bash
npm run test
```
