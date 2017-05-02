import test from 'ava'
import TestResolver from '../src/system/TestResolver'
const fetchMock = require('fetch-mock')
const debug = require('debug')('graphcool')
import 'isomorphic-fetch'
import pullCommand from '../src/commands/pull'
import {systemAPIEndpoint, graphcoolProjectFileName, graphcoolConfigFilePath} from '../src/utils/constants'
import {
  mockedPullProjectResponse1, mockedPullProjectFile1, mockedPullProjectFile2, mockedPullProjectResponse2,
  mockedCreateProjectResponseWithAlias, mockedPullProjectFileWithAlias1, mockedPullProjectResponseWithAlias1,
  mockedPullProjectResponseWithAlias2, mockedPullProjectFileWithAlias2
} from './mock_data/mockData'
import {SystemEnvironment} from '../src/types'
import TestOut from '../src/system/TestOut'

test.afterEach(() => {
  fetchMock.restore()
})

/*
 Tests:
- Pull without project file but passing project ID as argument
- Pull without project file (defaulting to project.graphcoool)
- Pull without project file (defaulting to project.graphcoool) updating version from 1 to 2
- Pull without project file but passing project ID as argument, result has an alias
- Pull without project file (defaulting to project.graphcoool) result has an alias, updating version from 1 to 2
- Pull with specific project file, updating version from 1 to 2
- Pull without project file (defaulting to project.graphcoool) and specify output path
- Pull without project files but with multiple project files in current directory
 */

test('Pull without project file but passing project ID as argument', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponse1)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  const sourceProjectId = "cj26898xqm9tz0126n34d64ey"
  const props = { sourceProjectId }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFile1
  const result = env.resolver.read(graphcoolProjectFileName)

  t.is(result, expectedProjectFileContent)

})

test('Pull without project file (defaulting to project.graphcoool)', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponse1)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(graphcoolProjectFileName, mockedPullProjectFile1)
  const props = { }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFile1
  const result = env.resolver.read(graphcoolProjectFileName)

  t.is(result, expectedProjectFileContent)
})

test('Pull without project file (defaulting to project.graphcoool) updating version from 1 to 2', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponse2)
  fetchMock.post(systemAPIEndpoint, mockedResponse)
  debug(`Mocked response: ${JSON.stringify(mockedResponse)}`)

  // dummy pull data
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(graphcoolProjectFileName, mockedPullProjectFile1)
  const props = { }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFile2
  const result = env.resolver.read(graphcoolProjectFileName)

  t.is(result, expectedProjectFileContent)

})

test('Pull without project file but passing project ID as argument, result has an alias', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponseWithAlias1)
  debug(`Mock response: ${JSON.stringify(mockedResponse)}`)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  const sourceProjectId = "cj26898xqm9tz0126n34d64ey"
  const props = { sourceProjectId }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFileWithAlias1
  const result = env.resolver.read(graphcoolProjectFileName)

  t.is(result, expectedProjectFileContent)

})

test('Pull without project file (defaulting to project.graphcoool) result has an alias, updating version from 1 to 2', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponseWithAlias2)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(graphcoolProjectFileName, mockedPullProjectFile1)
  const props = { }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFileWithAlias2
  const result = env.resolver.read(graphcoolProjectFileName)

  t.is(result, expectedProjectFileContent)

})

test('Pull with specific project file, updating version from 1 to 2', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponse2)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const projectFile = '/Desktop/example.graphcool'
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(projectFile, mockedPullProjectFile1)
  const props = { projectFile }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFile2
  const result = env.resolver.read(projectFile)

  t.is(result, expectedProjectFileContent)
})

test('Pull without project file (defaulting to project.graphcoool) and specify output path', async t => {

  // configure HTTP mocks
  const mockedResponse = JSON.parse(mockedPullProjectResponse1)
  fetchMock.post(systemAPIEndpoint, mockedResponse)

  // dummy pull data
  const outputPath = '/Desktop/example.graphcool'
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(graphcoolProjectFileName, mockedPullProjectFile1)
  const props = { outputPath }

  await t.notThrows(
    pullCommand(props, env)
  )

  const expectedProjectFileContent = mockedPullProjectFile1
  const result = env.resolver.read(outputPath)

  t.is(result, expectedProjectFileContent)
})

test('Pull without project files but with multiple project files in current directory', async t => {

  // dummy pull data
  const projectFile1 = 'example.graphcool'
  const projectFile2 = graphcoolProjectFileName
  const env = testEnvironment({})
  env.resolver.write(graphcoolConfigFilePath, '{"token": ""}')
  env.resolver.write(projectFile1, mockedPullProjectFile1)
  env.resolver.write(projectFile2, mockedPullProjectFile1)
  const props = { }

  await t.throws(
    pullCommand(props, env)
  )

  const expectedProjectFileContent1 = mockedPullProjectFile1
  const expectedProjectFileContent2 = mockedPullProjectFile1
  const result1 = env.resolver.read(projectFile1)
  const result2 = env.resolver.read(projectFile2)
  t.is(result1, expectedProjectFileContent1)
  t.is(result2, expectedProjectFileContent2)
})


function testEnvironment(storage: any): SystemEnvironment {
  return {
    resolver: new TestResolver(storage),
    out: new TestOut()
  }
}
