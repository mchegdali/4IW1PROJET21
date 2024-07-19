/* eslint-env node */
const fs = require('fs');
const path = require('path');
const https = require('https');

function checkGithubUrl(url) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', () => {
        resolve(false);
      });
  });
}

async function getRepositoryUrl(repository) {
  if (typeof repository === 'string') {
    if (/^[^/]+\/[^/]+$/.test(repository)) {
      const githubUrl = `https://github.com/${repository}`;
      if (await checkGithubUrl(githubUrl)) {
        return githubUrl;
      }
    }
    return repository;
  } else if (repository && repository.url) {
    return repository.url;
  }
  return null;
}

function cleanRepositoryUrl(url) {
  if (!url) return 'Non disponible';
  url = url.replace(/^git\+/, '');
  url = url.replace(/\.git$/, '');
  url = url.replace(/^git:\/\//, 'https://');
  return url;
}

async function getPackageInfo(packageName, version) {
  try {
    const packagePath = path.join('node_modules', packageName, 'package.json');
    const packageJsonContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const npmLink = `https://www.npmjs.com/package/${packageName}`;
    const repoUrl = await getRepositoryUrl(packageJson.repository);
    const repositoryLink = cleanRepositoryUrl(repoUrl);
    return {
      name: packageName,
      version: version,
      license: packageJson.license || 'Non spécifiée',
      npmLink: npmLink,
      repositoryLink: repositoryLink
    };
  } catch (error) {
    console.error(
      `Erreur lors de la lecture des informations pour ${packageName}: ${error.message}`
    );
    return {
      name: packageName,
      version: version,
      license: 'Erreur lors de la lecture',
      npmLink: `https://www.npmjs.com/package/${packageName}`,
      repositoryLink: 'Non disponible'
    };
  }
}

async function generateVueComponent() {
  try {
    const projectPackageJsonContent = fs.readFileSync('package.json', 'utf8');
    const projectPackageJson = JSON.parse(projectPackageJsonContent);
    const dependencies = {
      ...projectPackageJson.dependencies,
      ...projectPackageJson.devDependencies
    };

    let packagesData = [];
    for (const [packageName, version] of Object.entries(dependencies)) {
      const packageInfo = await getPackageInfo(packageName, version);
      packagesData.push(packageInfo);
    }

    const vueTemplate = `
<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Licences open-source</h1>
    <div v-for="package in packages" :key="package.name" class="mb-6 p-4 bg-white shadow rounded-lg">
      <h2 class="text-xl font-semibold mb-2 text-gray-700">{{ package.name }} <span class="text-sm font-normal text-gray-500">(version {{ package.version }})</span></h2>
      <p class="mb-1"><span class="font-medium text-gray-600">Licence :</span> {{ package.license }}</p>
      <p class="mb-1">
        <span class="font-medium text-gray-600">Lien npm :</span> 
        <a :href="package.npmLink" target="_blank" class="text-blue-600 hover:underline">{{ package.npmLink }}</a>
      </p>
      <p>
        <span class="font-medium text-gray-600">Lien du dépôt :</span> 
        <a v-if="package.repositoryLink !== 'Non disponible'" :href="package.repositoryLink" target="_blank" class="text-blue-600 hover:underline">{{ package.repositoryLink }}</a>
        <span v-else class="text-gray-500">{{ package.repositoryLink }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LicensesComponent',
  data() {
    return {
      packages: ${JSON.stringify(packagesData, null, 2)}
    }
  }
}
</script>
`;

    fs.writeFileSync('LicensesComponent.vue', vueTemplate, 'utf8');
    console.log('Le composant Vue "LicensesComponent.vue" a été généré avec succès.');
  } catch (error) {
    console.error(
      `Une erreur est survenue lors de la génération du composant Vue : ${error.message}`
    );
  }
}

generateVueComponent();
