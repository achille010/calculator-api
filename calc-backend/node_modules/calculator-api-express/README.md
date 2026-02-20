<div align="center">

# Calculator API Express

[![npm version](https://img.shields.io/npm/v/calculator-api-express.svg?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/calculator-api-express)
[![npm downloads](https://img.shields.io/npm/dm/calculator-api-express.svg?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/calculator-api-express)
[![GitHub Stars](https://img.shields.io/github/stars/achille010/calculator-api?style=for-the-badge&logo=github&logoColor=white&color=181717)](https://github.com/achille010/calculator-api)
[![GitLab](https://img.shields.io/badge/gitlab-mirror-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/arise-code/calculator-api)
[![License](https://img.shields.io/npm/l/calculator-api-express.svg?style=for-the-badge&color=blue)](https://github.com/achille010/calculator-api)

**A lightweight REST API for mathematical operations built with Express.js**

Perfect for microservices, serverless functions, or anywhere you need instant calculations.

[Get Started](#installation) • [Documentation](#api-reference) • [Examples](#usage-examples)

---

</div>

##  Features

```diff
+ Lightning-fast arithmetic operations
+ RESTful API with query params and JSON body support
+ Zero-config setup with built-in error handling
+ Calculation history tracking
+ TypeScript ready
```

##  Installation

```bash
npm i calculator-api-express
```

##  Quick Start

```javascript
const calculatorAPI = require('calculator-api-express');
const app = calculatorAPI(); //CommonJS

import calculatorAPI from 'calculator-api-express';
const app = calculatorAPI(); //module

app.listen(3000, () => {
  console.log(' Calculator API running on port 3000');
});
```

##  API Reference

### Basic Operations

<table>
<tr>
<td width="25%"><b>Endpoint</b></td>
<td width="20%"><b>Methods</b></td>
<td width="25%"><b>Parameters</b></td>
<td width="30%"><b>Description</b></td>
</tr>
<tr>
<td><code>/add</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/> <img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>a</code>, <code>b</code></td>
<td>Addition</td>
</tr>
<tr>
<td><code>/subtract</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/> <img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>a</code>, <code>b</code></td>
<td>Subtraction</td>
</tr>
<tr>
<td><code>/multiply</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/> <img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>a</code>, <code>b</code></td>
<td>Multiplication</td>
</tr>
<tr>
<td><code>/divide</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/> <img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>a</code>, <code>b</code></td>
<td>Division (handles division by zero)</td>
</tr>
<tr>
<td><code>/power</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/> <img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>a</code>, <code>b</code></td>
<td>Exponentiation (a<sup>b</sup>)</td>
</tr>
</table>

### Advanced Operations

<table>
<tr>
<td width="30%"><b>Endpoint</b></td>
<td width="20%"><b>Method</b></td>
<td width="25%"><b>Parameters</b></td>
<td width="25%"><b>Description</b></td>
</tr>
<tr>
<td><code>/factorial/:n</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/></td>
<td><code>n</code> (path)</td>
<td>Factorial calculation</td>
</tr>
<tr>
<td><code>/sumarray</code></td>
<td><img src="https://img.shields.io/badge/POST-49CC90?style=flat-square"/></td>
<td><code>numbers</code> (array)</td>
<td>Sum array of numbers</td>
</tr>
<tr>
<td><code>/history</code></td>
<td><img src="https://img.shields.io/badge/GET-61AFFE?style=flat-square"/></td>
<td>-</td>
<td>Get calculation history</td>
</tr>
</table>

##  Usage Examples

<details>
<summary><b>Query Parameters</b></summary>

```bash
GET http://localhost:3000/add?a=35&b=23
```
</details>

<details>
<summary><b>JSON Body</b></summary>

```bash
GET http://localhost:3000/multiply
Content-Type: application/json

{ "a": 6, "b": 7 }
```
</details>

<details>
<summary><b>Factorial</b></summary>

```bash
GET http://localhost:3000/factorial/5
```
</details>

<details>
<summary><b>Sum Array</b></summary>

```bash
POST http://localhost:3000/sumarray
Content-Type: application/json

{ "numbers": [1, 2, 3, 4, 5] }
```
</details>

<details>
<summary><b>Response Format</b></summary>

```json
{
  "result": 58,
  "operation": "add"
}
```
</details>

---

<div align="center">

##  Built With

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

##  Links

[![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/calculator-api-express)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/achille010/calculator-api)
[![GitLab](https://img.shields.io/badge/GitLab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/arise-code/calculator-api)

##  Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

##  License

**MIT** © [Achille010](https://github.com/achille010)

---

#### Made with `</>` using <code>Express.js</code>

</div>