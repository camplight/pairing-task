# Introduction

## Scripts

Please check the setup and tests script in package.json

## Parametrization

This demo showcases test parametrization. Tests are basically functions and can have params. This allows us to have a significant volume of test cases covered by a compact volume of code bodies

## Response Validation

This demo showcases using schemas to validate response structures. In real production scenarios we have highly complex structures in responses. Schemas are a standardized and simplified way to validate them

## The problem of Scale VS The problem of troubleshooting in QA Automation

QA Automation has some very standard problems. One such problem is the problem of scale. It is trivial to manage a project with 50 e2e test cases, but 500 is hard and 5000 is a living nightmare. The most obvious way to manage scale is to reuse code. This demo showcases 2 strategies to do that - parametrization and schemas.

Both strategies are completely unnecessary for this test, because the problem we are solving here is super simple. My solution is a showcase

Troubleshooting failing tests is the most common activity in QA. The most common way to waste our budget is to have QA automation where processing test results (this includes re-running, troubleshooting) is a nightmare. A common criticism to strategies I showcase here is that they make troubleshooting harder. There is some truth here. As anything in programing, we are dancing between trade-offs. If this topic is interesting to you, we can dive quite deeper.