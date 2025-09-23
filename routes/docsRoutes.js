const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const openapiSpec = YAML.load(path.join(__dirname, '..', 'docs', 'openapi.yaml'));

router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

module.exports = router;
