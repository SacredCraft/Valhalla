import { checkbox, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import fs from 'fs-extra'

const logger = console

// Recursively scan all package.json files
const availablePackages: {
  name: string
  value: string
  description: string
}[] = []

const scanPackages = (dir: string) => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = `${dir}/${file}`
    const stat = fs.statSync(fullPath)

    // Skip node_modules and hidden files
    if (file === 'node_modules' || file.startsWith('.')) {
      continue
    }

    if (stat.isDirectory()) {
      scanPackages(fullPath)
    } else if (file === 'package.json') {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as {
          name: string
        }
        availablePackages.push({
          name: pkgJson.name,
          value: fullPath,
          description: `Path: ${fullPath}`,
        })
      } catch (_err) {
        logger.warn(chalk.yellow(`Failed to read ${fullPath}`))
      }
    }
  }
}

// Common function to select packages
const selectPackages = async () => {
  return await checkbox({
    message: 'Select packages to update',
    choices: availablePackages.map((pkg) => ({
      name: pkg.name,
      value: pkg,
      description: pkg.description,
    })),
  })
}

// Common function to write package.json
const writePackageJson = (path: string, content: unknown) => {
  fs.writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`, 'utf-8')
  logger.log(chalk.gray(`Updated ${path}`))
}

scanPackages('.')

const action = await select({
  message: 'Select an action',
  choices: [
    {
      name: 'Rename workspace',
      value: 'rename',
    },
    {
      name: 'Update version',
      value: 'version',
    },
    {
      name: 'Update author',
      value: 'author',
    },
  ],
})

if (action === 'rename') {
  logger.log()
  logger.log(
    chalk.red(
      'This is a dangerous operation, please be careful and proceed with caution.'
    )
  )
  logger.log(
    chalk.gray(
      'Please make sure to backup your work or commit your changes before proceeding.'
    )
  )
  logger.log()

  const selectedPackages = await selectPackages()

  // Get new name
  const name = await input({
    message: 'Enter new name',
  })

  logger.log()

  // Update selected packages and their dependencies
  for (const pkg of selectedPackages) {
    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkg.value, 'utf-8')) as {
        name: string
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }
      const oldName = pkgJson.name.split('/')[0].substring(1)
      pkgJson.name = `@${name}/${pkgJson.name.split('/').pop()}`

      // Update workspace dependencies
      if (pkgJson.dependencies) {
        for (const [dep, version] of Object.entries(pkgJson.dependencies)) {
          if (version === 'workspace:*' && dep.startsWith(`@${oldName}/`)) {
            const newDep = `@${name}/${dep.split('/').pop()}`
            delete pkgJson.dependencies[dep]
            pkgJson.dependencies[newDep] = 'workspace:*'
          }
        }
      }

      // Update workspace devDependencies
      if (pkgJson.devDependencies) {
        for (const [dep, version] of Object.entries(pkgJson.devDependencies)) {
          if (version === 'workspace:*' && dep.startsWith(`@${oldName}/`)) {
            const newDep = `@${name}/${dep.split('/').pop()}`
            delete pkgJson.devDependencies[dep]
            pkgJson.devDependencies[newDep] = 'workspace:*'
          }
        }
      }

      writePackageJson(pkg.value, pkgJson)

      // Update tsconfig.json extends field
      const tsconfigPath = pkg.value.replace('package.json', 'tsconfig.json')
      if (fs.existsSync(tsconfigPath)) {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8')) as {
          extends?: string
        }
        if (tsconfig.extends?.includes(`@${oldName}/tsconfig`)) {
          tsconfig.extends = tsconfig.extends.replace(
            `@${oldName}/tsconfig`,
            `@${name}/tsconfig`
          )
          writePackageJson(tsconfigPath, tsconfig)
        }
      }
    } catch (_err) {
      logger.warn(chalk.yellow(`Failed to update ${pkg.value}`))
    }
  }

  logger.log()
  logger.log(chalk.bold.green('Workspace name update completed'))
}

if (action === 'version') {
  const selectedPackages = await selectPackages()

  const version = await input({
    message: 'Enter new version',
  })

  logger.log()

  // Update selected packages and their dependencies
  for (const pkg of selectedPackages) {
    try {
      const pkgPath = pkg.value
      const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
        version?: string
        dependencies?: Record<string, string>
        devDependencies?: Record<string, string>
      }

      // Update package version
      pkgJson.version = version

      // Update dependencies versions
      for (const dep of selectedPackages) {
        const name = dep.name
        if (pkgJson.dependencies?.[name]) {
          pkgJson.dependencies[name] = `workspace:^${version}`
        }
        if (pkgJson.devDependencies?.[name]) {
          pkgJson.devDependencies[name] = `workspace:^${version}`
        }
      }

      writePackageJson(pkgPath, pkgJson)
    } catch (_err) {
      logger.warn(chalk.yellow(`Failed to update ${pkg.value}`))
    }
  }

  logger.log()
  logger.log(chalk.bold.green('Workspace version update completed'))
}

if (action === 'author') {
  const selectedPackages = await selectPackages()

  const author = await input({
    message: 'Enter new author',
  })

  logger.log()

  // Update selected packages and their dependencies
  for (const pkg of selectedPackages) {
    try {
      const pkgJson = JSON.parse(fs.readFileSync(pkg.value, 'utf-8')) as {
        author?: string
      }
      pkgJson.author = author

      writePackageJson(pkg.value, pkgJson)
    } catch (_err) {
      logger.warn(chalk.yellow(`Failed to update ${pkg.value}`))
    }
  }

  logger.log()
  logger.log(chalk.bold.green('Workspace author update completed'))
}
