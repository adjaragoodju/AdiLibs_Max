// scripts/fixModels.js
const fs = require('fs');
const path = require('path');

// Path to models directory
const modelsDir = path.join(__dirname, '..', 'models');

// Skip index.js as we'll handle it separately
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'));

console.log(`Found ${modelFiles.length} model files to update`);

// Process each model file
modelFiles.forEach((file) => {
  const filePath = path.join(modelsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Model name is typically the file name without extension, capitalized
  const modelName = file.charAt(0).toUpperCase() + file.slice(1, -3);

  // Table name is lowercase version of model name with 's' at end
  const tableName = file.slice(0, -3).toLowerCase() + 's';

  // Check if the model already has table name setting
  if (content.includes('tableName:')) {
    console.log(`${file} already has tableName defined, skipping`);
    return;
  }

  // Find the line with model definition
  const defineRegex = new RegExp(
    `const ${modelName} = sequelize.define\\('${modelName}', {`
  );
  const match = content.match(defineRegex);

  if (!match) {
    console.log(`Could not find model definition in ${file}, skipping`);
    return;
  }

  // Find the end of the model attributes to add the options object
  const lastAttributeIndex = content.indexOf('});', content.indexOf(match[0]));

  if (lastAttributeIndex === -1) {
    console.log(`Could not find end of model attributes in ${file}, skipping`);
    return;
  }

  // Insert the tableName and timestamp options
  const updatedContent =
    content.slice(0, lastAttributeIndex) +
    '}, {\n' +
    '    // Explicitly use lowercase table name for PostgreSQL\n' +
    `    tableName: '${tableName}',\n` +
    '    // Keep timestamps but make sure they match PostgreSQL conventions\n' +
    '    timestamps: true,\n' +
    "    createdAt: 'created_at',\n" +
    "    updatedAt: 'updated_at'\n" +
    '  ' +
    content.slice(lastAttributeIndex);

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Updated ${file} with PostgreSQL-friendly configuration`);
});

console.log('All model files have been updated!');
