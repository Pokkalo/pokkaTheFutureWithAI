// Simple deployment helper script
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get GitHub username from git config
const getGitHubUsername = () => {
  try {
    const output = execSync('git config --get user.email').toString().trim();
    return output.split('@')[0];
  } catch (error) {
    console.warn('Could not get GitHub username from git config');
    return 'yourusername';
  }
};

// Update package.json with the correct GitHub username
const updateHomepage = () => {
  const username = getGitHubUsername();
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.homepage = `https://${username}.github.io/pokkaTheFutureWithAI`;
  
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  
  console.log(`Updated homepage to: ${packageJson.homepage}`);
};

// Main function
const main = () => {
  try {
    console.log('Installing gh-pages package...');
    execSync('npm install --save-dev gh-pages', { stdio: 'inherit' });
    
    updateHomepage();
    
    console.log('Building and deploying to GitHub Pages...');
    execSync('npm run deploy', { stdio: 'inherit' });
    
    console.log('\n✅ Deployment complete!');
    console.log('\nNOTE: You need to deploy your backend separately.');
    console.log('Free options for backend hosting:');
    console.log('- Render.com (https://render.com)');
    console.log('- Railway (https://railway.app)');
    console.log('- Fly.io (https://fly.io)');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};

main();
